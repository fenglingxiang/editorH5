<template>
  <div ref="canvasBox" class="relative h-100">
    <div
      ref="buttonRef"
      :class="['flex', 'align-center', !isEdit && 'justify-end']"
    >
      <van-button
        type="primary"
        size="small"
        class="save-button"
        @click="saveImg"
        v-if="!isEdit"
        >保存</van-button
      >
      <van-button
        icon="/src/assets/images/exit-icon.png"
        type="primary"
        size="small"
        class="save-button"
        @click="isShowExitDialog = true"
        v-else
        >退出</van-button
      >
    </div>
    <canvas ref="canvasRef"></canvas>
    <div
      v-if="!isEdit"
      class="explain"
      :style="{ top: 36 + offsetTop + canvasSize.w + 10 + 'px' }"
    >
      红色区域包含吧唧的侧面及背面包边，请务必填满图案！！无图案部分实物为白色，因此产生的露白问题不在售后范围内！
    </div>
    <bottom-box @getBottomBoxH="getBottomBoxH">
      <div class="bg-white" v-if="!isEdit">
        <!-- 编辑图片tool -->
        <div
          class="img-tools flex align-center justify-center pl-10 pr-10 pt-10 pb-10"
          v-show="bottomToolsMode === 'img'"
        >
          <van-uploader
            :before-read="beforeRead"
            :after-read="changeImgSuccess"
            :accept="accept"
            :readonly="item.type !== 'change'"
            v-for="(item, index) in imgTools"
            :key="index"
          >
            <div
              :class="[
                'flex-column',
                'align-center',
                index !== imgTools.length - 1 && 'mr-20',
              ]"
              @click="toolHandle(item.type)"
            >
              <van-icon
                :name="'/src/assets/images/' + item.icon + '.png'"
                size="19px"
              />
              <div class="mt-2">{{ item.name }}</div>
            </div>
          </van-uploader>
        </div>
        <!-- 边框 -->
        <border-tools
          v-show="bottomToolsMode === 'border'"
          @changeBorder="paintBorder"
          @clearBorder="clearBorder"
        />
        <div class="bottom-tools flex align-ceneter justify-center">
          <div
            :class="[
              'bottom-tools-item',
              'flex-column',
              'align-center',
              bottomToolsMode === item.type && 'bottom-tools-item--active',
            ]"
            v-for="item in bottomTools"
            :key="item.type"
            @click="bottomToolToggle(item.type)"
          >
            <van-icon
              :name="'/src/assets/images/' + item.icon + '.png'"
              size="20px"
            />
            <div class="mt-2">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div
        class="bg-white flex align-center justify-between pl-10 pr-10 pt-10 pb-10"
        v-else
      >
        <van-uploader
          :before-read="beforeRead"
          :after-read="changeImgSuccess"
          :accept="accept"
          class="change-upload flex-1 mr-12"
        >
          <van-button class="w-100">更换图片</van-button>
        </van-uploader>
        <van-button class="flex-1" type="primary" @click="editFinish"
          >编辑完成</van-button
        >
      </div>
    </bottom-box>

    <!-- 未撑满提示 -->
    <not-fill-dialog v-model:show="isShowNotFillDialog" @toFill="toFill" />

    <!-- 退出编辑提示 -->
    <exit-dialog v-model:show="isShowExitDialog" @exit="editExit" />
  </div>
</template>

<script setup>
import { ref, shallowRef } from "vue";
import { Canvas, Circle } from "fabric";
import * as fabric from "fabric";
import {
  loadFabricImage,
  initImgOptions,
  renderControlIcon,
} from "@/utils/fabricUtil";
import notFillDialog from "./notFillDialog.vue";
import exitDialog from "./exitDialog.vue";
import borderTools from "./borderTools.vue";
import { getImgInfo } from "@/utils/util";

const mainImgInfo = defineModel("mainImgInfo", {
  type: Object,
  default: () => {
    return {};
  },
});

const props = defineProps({
  maskUrl: {
    type: String,
    default: "/src/assets/images/editor-img-mask-red.png",
  },

  offsetTop: {
    type: [Number, String],
    default: 60,
  },

  accept: {
    type: String,
    default: "image/png, image/jpg, image/jpeg",
  },
});

const emits = defineEmits([
  "getDesignBottomBoxH",
  "changeImgSuccess",
  "showUploadWhiteInk",
]);

const buttonRef = ref(null);
const canvasBox = ref(null);
const canvasRef = ref(null);
const canvasSize = ref({});
const canvas = shallowRef(null);
const historyCanvasJsonData = ref("");
const imgTools = ref([
  {
    icon: "editor-icon",
    name: "编辑",
    type: "edit",
  },
  {
    icon: "change-icon",
    name: "替换",
    type: "change",
  },
]);
const bottomTools = ref([
  {
    icon: "pic-icon",
    name: "编辑图片",
    type: "img",
  },
  {
    icon: "border-icon",
    name: "选择边框",
    type: "border",
  },
  {
    icon: "mask-icon",
    name: "调整白墨",
    type: "whiteInk",
  },
]);
const bottomToolsMode = ref(bottomTools.value[0].type);
const isEdit = ref(false);
const isShowNotFillDialog = ref(false);
const isShowExitDialog = ref(false);
const disabledImgs = ["maskImg", "borderImg"]; //🈲操作的图层id

const paintImg = async (src, options = {}, clipOptions) => {
  const { width } = canvas.value;
  if (clipOptions?.type == "circle") {
    delete clipOptions.type;
    options.clipPath = clipCircle({
      radius: width / 2,
      ...clipOptions,
      absolutePositioned: true,
    });
  }
  const fabricImage = await loadFabricImage(src, {
    // originX: "center",
    // originY: "center",
    centeredRotation: true,
    centeredScaling: true,
    ...options,
  });
  //缩放图片
  initImgOptions(fabricImage, {
    width: canvas.value.width,
    offsetTop: props.offsetTop,
  });
  // 自定义控制框
  customControls(fabricImage);
  fabricImage.setCoords();
  canvas.value.add(fabricImage);
  return fabricImage;
};

const clipCircle = (options = {}) => {
  const circle = new Circle(options);
  return circle;
};

const reverseHandle = () => {
  const obj = canvas.value.getActiveObject();
  obj.set({
    flipX: !obj.flipX,
  });
  obj.setCoords();
  canvas.value.requestRenderAll();
};

const init = async () => {
  canvas.value = new Canvas(canvasRef.value, {
    preserveObjectStacking: true,
    selection: false,
  });
  canvas.value.setDimensions({
    width: canvasSize.value.w,
    height: canvasSize.value.h,
  });
  const mainImg = await paintImg(
    mainImgInfo.value.url,
    {
      selectable: false,
      id: "mainImg",
    },
    {
      left: 0,
      top: props.offsetTop,
      type: "circle",
    }
  );
  console.log("🚀 ~ init ~ mainImgInfo.value:", mainImgInfo.value);
  const maskImg = await paintImg(props.maskUrl, {
    left: 0,
    top: props.offsetTop,
    selectable: false,
    evented: false,
    id: "maskImg",
  });
  canvas.value.renderAll();
  canvas.value.on("mouse:up", (e) => {
    let flag = maskImg.containsPoint(e.pointer); //判断点击点是否在maskImg内部
    if (!isEdit.value && flag && bottomToolsMode.value === "img") {
      editStart();
    }
  });
};

const customControls = (fabricObject, options = {}) => {
  fabricObject.set({
    borderColor: "#000",
    borderScaleFactor: 2,
    borderDashArray: [6, 6],
    cornerColor: "#000",
    borderOpacityWhenMoving: 1,
    ...options,
  });
  if (fabricObject.type === "image") {
    const reserveIcon = "/src/assets/images/editor-handle-icon1.png";
    const transformIcon = "/src/assets/images/editor-handle-icon2.png";
    const rotateIcon = "/src/assets/images/rotate-icon.png";
    // 左上角镜像按钮
    renderControlIcon(fabricObject, reserveIcon, "tl", {
      cornerSize: 28,
      cursorStyle: "pointer",
      mouseUpHandler: reverseHandle,
    });
    //右下角缩放按钮
    renderControlIcon(fabricObject, transformIcon, "br", {
      cornerSize: 28,
      cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
      actionHandler: fabric.controlsUtils.scalingEqually,
    });
    //中间旋转按钮
    renderControlIcon(fabricObject, rotateIcon, "mtr", {
      cornerSize: 28,
      offsetY: -30,
      withConnection: true,
      cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
      actionHandler: fabric.controlsUtils.rotationWithSnapping,
    });
    fabricObject.setControlsVisibility({
      tr: false,
      bl: false,
      mt: false,
      mr: false,
      mb: false,
      ml: false,
    });
  }
};

const getBottomBoxH = (e) => {
  canvasSize.value = {
    w: canvasBox.value.clientWidth,
    h: canvasBox.value.clientHeight - buttonRef.value.clientHeight - e.h,
  };
  init();
};

const bottomToolToggle = (e) => {
  bottomToolsMode.value = e;
  if (e === "whiteInk") {
    emits("showUploadWhiteInk");
  }
};

const toolHandle = (e) => {
  switch (e) {
    case "edit":
      editStart();
      break;
    default:
      break;
  }
};

const editStart = () => {
  //保存历史画布数据，额外暴露id字段标识图层
  historyCanvasJsonData.value = canvas.value.toObject(["id"]);
  isEdit.value = true;
  canvas.value.forEachObject((obj) => {
    obj.selectable = !disabledImgs.includes(obj.id);
    obj.evented = !disabledImgs.includes(obj.id);
    if (obj.id === "mainImg") {
      canvas.value.setActiveObject(obj);
      canvas.value.requestRenderAll();
    }
  });
};

const beforeRead = (file) => {
  console.log("🚀 ~ beforeRead ~ file:", file);
  if (props.accept.indexOf(file.type) === -1) {
    showToast("图片格式不支持");
    return false;
  }
  return true;
};

const changeImgSuccess = (e) => {
  canvas.value.forEachObject(async (obj) => {
    if (obj.id === "mainImg") {
      console.log("🚀 ~ canvas.value.forEachObject ~ obj:", obj);
      await obj.setSrc(e.objectUrl);
      initImgOptions(obj, {
        width: canvas.value.width,
        offsetTop: props.offsetTop,
      });
      canvas.value.requestRenderAll();
      mainImgInfo.value = await getImgInfo(e.objectUrl);
    }
  });
};

//编辑完成
const editFinish = async () => {
  const flag = await isFill();
  //图片未撑满
  if (!flag) {
    isShowNotFillDialog.value = true;
    return;
  }
  isEdit.value = false;
  canvas.value.forEachObject((obj) => {
    obj.set({
      selectable: false,
    });
  });
  canvas.value.discardActiveObject();
  canvas.value.requestRenderAll();
};

//判断裁剪区是否填满图案
const isFill = () => {
  return new Promise((resolve) => {
    canvas.value.forEachObject((obj) => {
      if (obj.id === "mainImg") {
        const { tl, tr, bl, br } = obj.aCoords;
        console.log(
          "🚀 ~ canvas.value.forEachObject ~ obj.aCoords:",
          obj.aCoords
        );
        const { left, top, width, height } = obj.clipPath;
        const clipPathPoints = {
          ctl: { x: left, y: top },
          ctr: { x: left + width, y: top },
          cbl: { x: left, y: top + height },
          cbr: { x: left + width, y: top + height },
        };
        const { ctl, ctr, cbl, cbr } = clipPathPoints;
        console.log(
          "🚀 ~ canvas.value.forEachObject ~ clipPathPoints:",
          clipPathPoints
        );

        const isTlIn = ctl.x >= Math.round(tl.x) && ctl.y >= Math.round(tl.y); //左上角是否被包含
        console.log("🚀 ~ canvas.value.forEachObject ~ isTlIn:", isTlIn);
        const isTrIn = ctr.x <= Math.round(tr.x) && ctr.y >= Math.round(tr.y); //右上角是否被包含
        console.log("🚀 ~ canvas.value.forEachObject ~ isTrIn:", isTrIn);
        const isBrIn = cbr.x <= Math.round(br.x) && cbr.y <= Math.round(br.y); //右下角是否被包含
        console.log("🚀 ~ canvas.value.forEachObject ~ isBrIn:", isBrIn);
        const isBlIn = cbl.x >= Math.round(bl.x) && cbl.y <= Math.round(bl.y); //左下角是否被包含
        console.log("🚀 ~ canvas.value.forEachObject ~ isBlIn:", isBlIn);
        resolve(isTlIn && isTrIn && isBrIn && isBlIn);
      }
    });
  });
};

const toFill = () => {
  canvas.value.forEachObject((obj) => {
    if (obj.id === "mainImg") {
      initImgOptions(obj, {
        width: canvas.value.width,
        offsetTop: props.offsetTop,
      });
      canvas.value.requestRenderAll();
      isShowNotFillDialog.value = false;
    }
  });
};

//退出编辑
const editExit = async () => {
  canvas.value = await canvas.value.loadFromJSON(
    historyCanvasJsonData.value,
    (obj, ins) => {
      customControls(ins, {
        selectable: false,
        evented: false,
      });
      if (ins.id === "mainImg") {
        mainImgInfo.value = {
          url: obj.src,
          w: obj.width,
          h: obj.height,
        };
      }
    }
  );
  canvas.value.requestRenderAll();
  isEdit.value = false;
};

//绘制边框图片
const paintBorder = async (e) => {
  const borderImg = await paintImg(e.img, {
    left: 0,
    top: props.offsetTop,
    selectable: false,
    evented: false,
    id: "borderImg",
  });
  moveDownOneLayer(borderImg);
};

//清除边框图片
const clearBorder = () => {
  canvas.value.forEachObject((obj) => {
    if (obj.id === "borderImg") {
      canvas.value.remove(obj);
      canvas.value.requestRenderAll();
    }
  });
};

const moveDownOneLayer = (target) => {
  const objects = canvas.value.getObjects();
  const currentIndex = objects.indexOf(target);

  if (currentIndex > 0) {
    // 直接交换两个对象的位置
    canvas.value.moveObjectTo(objects[currentIndex - 1], currentIndex);
    canvas.value.moveObjectTo(target, currentIndex - 1);

    // 更高效的渲染方式
    canvas.value.discardActiveObject();
    canvas.value.requestRenderAll();
  }
};

const saveImg = () => {
  let clipPath;
  canvas.value.forEachObject((obj) => {
    if (obj.id === "mainImg") {
      clipPath = obj.clipPath;
    }
  });
  let options = {
    format: "png",
    quality: 1,
    filter: (obj) => obj.id !== "maskImg",
  };
  if (clipPath) {
    options = {
      ...options,
      left: clipPath.left,
      top: clipPath.top,
      width: clipPath.width,
      height: clipPath.height,
    };
  }
  const res = canvas.value.toDataURL({ ...options });
  console.log("🚀 ~ saveImg ~ res:", res);
};
</script>

<style lang="scss" scoped>
.explain {
  font-size: 12px;
  line-height: 17px;
  font-weight: 500;
  color: var(--com-red-color);
  position: absolute;
  left: 0;
  padding: 0 10px;
}

.img-tools {
  padding: 12px 10px;
  border: 1px solid #f1f1f1;
}

.bottom-tools {
  padding: 18px 20px;

  .bottom-tools-item {
    padding: 10px;
    border: 1px solid transparent;
    border-radius: 2px;
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }
  }

  .bottom-tools-item--active {
    border-color: #b9b9b9;
    background-color: #f5f5f5;
  }
}

:deep(.change-upload .van-uploader__wrapper .van-uploader__input-wrapper) {
  flex: 1;

  .van-button {
    width: 100%;
  }
}
</style>
