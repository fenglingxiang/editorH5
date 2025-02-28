<template>
  <div class="relative h-100" ref="containerRef">
    <div ref="buttonRef">
      <van-button
        icon="/src/assets/images/exit-icon.png"
        type="primary"
        size="small"
        class="save-button"
        @click="exitUploadWhiteInk"
        >退出</van-button
      >
    </div>
    <canvas ref="canvasRef" v-if="isUplaodSuccess"></canvas>
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
      <div class="bg-white flex align-center justify-between p-10">
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
import { getImgInfo } from "@/utils/util";
import { ref, onMounted, shallowRef, nextTick } from "vue";
import upload from "./upload.vue";
import whiteInkUploadRule from "./whiteInkUploadRule.vue";
import whiteInkSizeError from "./whiteInkSizeError.vue";
import { Canvas, FabricImage, Pattern, Rect } from "fabric";
import { loadFabricImage, initImgOptions } from "@/utils/fabricUtil";

const props = defineProps({
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
const isUplaodSuccess = ref(false);

onMounted(() => {
  uploadW.value = containerRef.value.clientWidth;
});

const getBottomBoxH = (e) => {
  nextTick(() => {
    console.log(
      "🚀 ~ getBottomBoxH ~ containerRef.value:",
      containerRef.value.clientHeight,
      buttonRef.value.clientHeight,
      e.h
    );
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

const uploadImgSuccess = (e) => {
  isUplaodSuccess.value = true;
  nextTick(() => {
    initCanvas(e.objectUrl);
  });
};

const initCanvas = async (src) => {
  canvas.value = new Canvas(canvasRef.value, {
    preserveObjectStacking: true,
    selection: false,
  });
  canvas.value.setDimensions({
    width: canvasSize.value.w,
    height: canvasSize.value.h,
  });
  createGrid();
  paintImg(src);
  canvas.value.renderAll();
  console.log("🚀 ~ initCanvas ~ canvas.value:", canvas.value);
};

const paintImg = async (src) => {
  const fabricImage = await loadFabricImage(src, {
    left: 0,
    top: props.offsetTop,
    selectable: false,
    evented: false,
  });
  initImgOptions(fabricImage, {
    width: canvas.value.width,
    offsetTop: props.offsetTop,
  });
  canvas.value.add(fabricImage);
};

const createGrid = () => {
  // 创建网格图案
  const pattern = generatePattern();
  const { w, h } = props.mainImgInfo
  const grid = new Rect({
    width: w,
    height: h,
    fill: pattern,
    selectable: false,
    evented: false,
    excludeFromExport: true,
    objectCaching: false,
  });

  canvas.value.add(grid);
};

const generatePattern = () => {
  const size = 28;
  const { w, h } = props.mainImgInfo

  const ctx = canvas.value.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#ddd";
  ctx.fillRect(0, 0, size, size);
  ctx.fillRect(size, size, size, size);

  return new Pattern({
    source: canvasRef.value,
    repeat: "repeat",
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
