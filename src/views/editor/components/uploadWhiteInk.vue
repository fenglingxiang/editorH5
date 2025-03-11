<template>
  <div class="relative h-100" ref="containerRef">
    <div ref="buttonRef">
      <van-button
        :icon="exitIcon"
        type="primary"
        size="small"
        class="save-button"
        @click="exitUploadWhiteInk"
        >退出</van-button
      >
    </div>
    <div class="relative" v-if="isShowCanvas">
      <canvas ref="canvasRef"></canvas>
      <van-button
        :icon="clear2Icon"
        class="absolute"
        :style="{
          top: clipPath.h + offsetTop + 20 + 'px',
          left: '50%',
          transform: 'translateX(-50%)',
        }"
        @click="clear"
        >清空白墨层</van-button
      >
    </div>
    <upload
      :beforeRead="beforeRead"
      :size="uploadW"
      title="上传白墨图"
      rule-text="图片仅支持png，无需自定义白墨层请退出"
      explain="白墨部分为纯黑色（#000000），除白墨以外部分保持纯透明，不要设置任何图案和元素"
      :offset-top="offsetTop"
      :accept="accept"
      @uploadImgSuccess="uploadImgSuccess"
      v-else
    />
    <bottom-box @getBottomBoxH="getBottomBoxH">
      <div
        class="bg-white flex align-center justify-between p-10"
        v-if="isShowCanvas"
      >
        <van-uploader
          :before-read="beforeRead"
          :after-read="changeImgSuccess"
          :accept="accept"
          class="upload-btn flex-1 mr-12"
        >
          <van-button class="w-100">更换图片</van-button>
        </van-uploader>
        <van-button type="primary" class="flex-1" @click="confirm"
          >编辑完成</van-button
        >
      </div>
      <div class="bg-white flex align-center justify-between p-10" v-else>
        <van-button class="flex-1 mr-12" @click="show = true"
          >查看上传规范</van-button
        >
        <van-uploader
          :before-read="beforeRead"
          :after-read="uploadImgSuccess"
          :accept="accept"
          class="upload-btn flex-1"
        >
          <van-button type="primary" class="w-100">上传白墨图</van-button>
        </van-uploader>
      </div>
    </bottom-box>

    <!-- 白墨图上传规则 -->
    <white-ink-upload-rule v-model:show="show" :main-img-info="mainImgInfo" />

    <!-- 白墨图尺寸不符合 -->
    <white-ink-size-error
      v-model:show="showWhiteInkError"
      :main-img-info="mainImgInfo"
      :white-ink-info="whiteInkInfo"
    />
  </div>
</template>

<script setup>
import { getImgInfo, base64ToFile } from "@/utils/util";
import { ref, onMounted, shallowRef, nextTick, watch } from "vue";
import exitIcon from "@/assets/images/exit-icon.png";
import clear2Icon from "@/assets/images/clear2-icon.png";
import gridBgImg from "@/assets/images/grid-bg.png";
import upload from "./upload.vue";
import whiteInkUploadRule from "./whiteInkUploadRule.vue";
import whiteInkSizeError from "./whiteInkSizeError.vue";
import { Canvas, Rect } from "fabric";
import {
  loadFabricImage,
  initImgOptions,
  imgFiltersBlack,
} from "@/utils/fabricUtil";
import { upload as uploadOss } from "@/utils/upload";

const props = defineProps({
  whiteInkUrl: {
    type: String,
    default: "",
  },

  clipPath: {
    type: Object,
    default: () => {
      return {};
    },
  },

  offsetTop: {
    type: [Number, String],
    default: 60,
  },

  mainImgInfo: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const emits = defineEmits([
  "exitUploadWhiteInk",
  "showUploadRule",
  "uploadImgSuccess",
  "setWhiteInkImg",
]);

const containerRef = ref(null);
const canvasRef = ref(null);
const canvas = shallowRef(null);
const canvasSize = ref({});
const buttonRef = ref(null);
const uploadW = ref(0);
const accept = ref("image/png");
const show = ref(false);
const whiteInkInfo = ref({});
const showWhiteInkError = ref(false);
const isShowCanvas = ref(false);

onMounted(() => {
  uploadW.value = containerRef.value.clientWidth;
  if (props.whiteInkUrl) {
    console.log("🚀 ~ onMounted ~ props.whiteInkUrl:", props.whiteInkUrl);
    isShowCanvas.value = true;
    let timer = setTimeout(async () => {
      clearTimeout(timer);
      whiteInkInfo.value = await getImgInfo(props.whiteInkUrl);
      initCanvas(props.whiteInkUrl);
    }, 0);
  }
});

const getBottomBoxH = (e) => {
  nextTick(() => {
    canvasSize.value = {
      w: containerRef.value.clientWidth,
      h: containerRef.value.clientHeight - buttonRef.value.clientHeight - e.h,
    };
  });
};

const exitUploadWhiteInk = () => {
  emits("exitUploadWhiteInk");
};

const beforeRead = async (file) => {
  return new Promise(async (resolve, reject) => {
    whiteInkInfo.value = await getImgInfo(file);
    const { w, h } = props.mainImgInfo;
    if (accept.value.indexOf(file.type) === -1) {
      showToast("图片格式不支持");
      reject();
    } else if (whiteInkInfo.value.w !== w || whiteInkInfo.value.h !== h) {
      showWhiteInkError.value = true;
      reject();
    }
    resolve();
  });
};

const uploadImgSuccess = async (e) => {
  let url = "";
  url = e.file ? await uploadOssReq(e.file) : e.oosUrl;
  isShowCanvas.value = true;
  nextTick(() => {
    initCanvas(url);
  });
};

const uploadOssReq = (file) => {
  return uploadOss(file);
};

const initCanvas = async (src) => {
  console.log("🚀 ~ initCanvas ~ src:", src);
  canvas.value = new Canvas(canvasRef.value, {
    preserveObjectStacking: true,
    selection: false,
  });
  canvas.value.setDimensions({
    width: canvasSize.value.w,
    height: canvasSize.value.h,
  });
  const { left, top, angle, scaleX, scaleY } = props.mainImgInfo.fabricImage;
  paintImg(gridBgImg);
  paintImg(src, {
    id: "whiteInkImg",
    left,
    top,
    angle,
    scaleX,
    scaleY,
  });
  canvas.value.requestRenderAll();
  console.log("🚀 ~ initCanvas ~ canvas.value:", canvas.value);
};

const paintImg = async (src, options = {}) => {
  const fabricImage = await loadFabricImage(src, {
    left: 0,
    top: props.offsetTop,
    clipPath: clipRect(),
    selectable: false,
    evented: false,
  });
  initImgOptions(
    fabricImage,
    {
      width: canvas.value.width,
      offsetTop: props.offsetTop,
    },
    options
  );
  if (fabricImage.id === "whiteInkImg") imgFiltersBlack(fabricImage);
  canvas.value.add(fabricImage);
};

// const imgFilters = async (fabricImage) => {
//   const matrix = [
//     0,
//     0,
//     0,
//     0,
//     0, // R
//     0,
//     0,
//     0,
//     0,
//     0, // G
//     0,
//     0,
//     0,
//     0,
//     0, // B
//     0,
//     0,
//     0,
//     1,
//     0, // A
//   ];
//   const colorMatrix = new filters.ColorMatrix({
//     matrix,
//   });
//   // const brightness = new filters.Brightness({
//   //   brightness: -1,
//   // });
//   fabricImage.filters.push(colorMatrix);
//   fabricImage.applyFilters();
// };

const clipRect = () => {
  const { w, h } = props.clipPath;
  console.log("🚀 ~ clipRect ~ props.clipPath:", props.clipPath);
  const rect = new Rect({
    width: w,
    height: h,
    left: (w - canvas.value.width) / 2,
    top: props.offsetTop,
    absolutePositioned: true,
  });
  return rect;
};

const clear = () => {
  whiteInkInfo.value = {};
  canvas.value.clear();
  isShowCanvas.value = false;
};

const changeImgSuccess = (e) => {
  canvas.value.forEachObject(async (obj) => {
    if (obj.id === "whiteInkImg") {
      await obj.setSrc(e.objectUrl);
      canvas.value.requestRenderAll();
      whiteInkInfo.value = await getImgInfo(e.file);
    }
  });
};

const confirm = async () => {
  // let clipPath;
  // canvas.value.forEachObject((obj) => {
  //   if (obj.id === "whiteInkImg") {
  //     clipPath = obj.clipPath;
  //   }
  // });
  // let options = {
  //   format: "png",
  //   quality: 1,
  //   filter: (obj) => obj.id == "whiteInkImg",
  // };
  // if (clipPath) {
  //   options = {
  //     ...options,
  //     left: clipPath.left,
  //     top: clipPath.top,
  //     width: clipPath.width,
  //     height: clipPath.height,
  //   };
  // }

  // const res = canvas.value.toDataURL({
  //   ...options,
  // });
  // const file = base64ToFile(res, `${new Date().getTime()}-white-ink.png`);
  // const ossRes = await uploadOssReq(file)
  console.log("🚀 ~ confirm ~ whiteInkInfo.value:", whiteInkInfo.value);
  emits("setWhiteInkImg", {
    ...whiteInkInfo.value,
    // url: ossRes.oosUrl
  });
};
</script>

<style lang="scss" scoped>
.upload-box {
  border: 1px dashed #2b2d2b;
  background-color: #fff;
  padding: 20px;

  .tips {
    padding: 5px 13px;
    border-radius: 5px;
    background-color: #f7f7f7;
  }
}

:deep(.upload-btn .van-uploader__wrapper .van-uploader__input-wrapper) {
  flex: 1;

  .van-button {
    width: 100%;
  }
}
</style>
