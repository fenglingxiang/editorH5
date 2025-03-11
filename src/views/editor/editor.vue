<template>
  <div class="container" v-if="isRender">
    <!-- <div ref="navBarRef">
      <van-nav-bar
        title="商品设计"
        left-arrow
        fixed
        placeholder
        safe-area-inset-top
        :border="false"
        @click-left="back"
      />
    </div> -->
    <div
      ref="centerRef"
      :style="{
        padding: '10px 10px 0 10px',
        position: 'relative',
        width: '100%',
        height: centerContent.height + 'px',
        overflow: 'hidden',
      }"
    >
      <upload-main-img
        @uploadImgSuccess="uploadImgSuccess"
        @showExplain="isShowDesignExplain = true"
        v-show="mode == 'uploadMainImg'"
      />
      <template v-if="mainImgInfo.url || jsonData.version">
        <design-img
          :main-img-info="mainImgInfo"
          :clipPath="clipPath"
          :jsonData="jsonData"
          :white-ink-info="whiteInkInfo"
          v-show="mode == 'editImg'"
          @updateMainImgInfo="updateMainImgInfo"
          @updateWhiteInkImgInfo="updateWhiteInkImgInfo"
          @showUploadWhiteInk="mode = 'uploadWhiteInk'"
          @clearWhiteInkImg="whiteInkInfo = { url: '' }"
          @saveImg="saveImg"
        />
      </template>

      <upload-white-ink
        :white-ink-url="whiteInkInfo.url"
        :main-img-info="mainImgInfo"
        :clipPath="clipPath"
        @exitUploadWhiteInk="mode = 'editImg'"
        @setWhiteInkImg="setWhiteInkImg"
        v-if="mode == 'uploadWhiteInk'"
      />
    </div>

    <!-- 设计例子 -->
    <design-example
      v-model:show="isShowDesignExample"
      @showMoreExplain="isShowUploadImgRule = true"
    />

    <!-- 传图规范 -->
    <upload-img-rule v-model:show="isShowUploadImgRule" />

    <!-- 设计说明 -->
    <design-explain
      v-model:show="isShowDesignExplain"
      @showMoreExplain="isShowUploadImgRule = true"
    />

    <preview
      v-model:show="isShowPreview"
      :imgUrl="previewImg"
      :jsonData="jsonData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import designImg from "./components/designImg.vue";
import uploadMainImg from "./components/uploadMainImg.vue";
import designExample from "./components/designExample.vue";
import uploadImgRule from "./components/uploadImgRule.vue";
import designExplain from "./components/designExplain.vue";
import uploadWhiteInk from "./components/uploadWhiteInk.vue";
import { getImgInfo, getQueryObject } from "@/utils/util";
import Preview from "./components/preview.vue";
import { getJsJDKSgin } from "@/api/open";
import { upload } from "@/utils/upload";
import { getGoodsDetail } from "@/api/member";

// const navBarRef = ref(null);
const isRender = ref(false);
const centerRef = ref(null);
const centerContent = ref({});
const mainImgInfo = ref({});
const mode = ref("uploadMainImg");
const isShowDesignExample = ref(false);
const isShowUploadImgRule = ref(false);
const isShowDesignExplain = ref(false);
const clipPath = ref({
  width: 355,
  height: 355,
});
const whiteInkInfo = ref({
  url: "",
}); //白墨图信息
const isShowPreview = ref(false);
const previewImg = ref("");
const jsonData = ref({});

onMounted(async () => {
  // getJsJDKSginReq()
  let data = await getGoodsDetailReq();
  if (data) {
    jsonData.value = JSON.parse(data.jsonData);
    mode.value = "editImg";
  }
  isRender.value = true;
  isShowDesignExample.value = !data;
  //保证dom完全渲染
  let timer = setTimeout(() => {
    clearTimeout(timer);
    centerContent.value = {
      width: centerRef.value.clientWidth - 20,
      height: window.innerHeight,
    };
    clipPath.value = {
      w: centerRef.value.clientWidth - 20,
      h: centerRef.value.clientWidth - 20,
    };
  }, 0);
});

const back = () => {};

const getGoodsDetailReq = async () => {
  return getGoodsDetail({
    goodsId: 1,
  })
};

const getJsJDKSginReq = () => {
  getJsJDKSgin({
    agent_id: 45,
    url: encodeURIComponent(location.href),
  }).then((res) => {
    console.log("🚀 ~ getJsJDKSginReq ~ res:", res);
  });
};

const uploadImgSuccess = async (e) => {
  console.log("🚀 ~ uploadImgSuccess ~ e:", e);
  mode.value = "editImg";
  mainImgInfo.value = await getImgInfo(e.oosUrl);
};

const updateMainImgInfo = (info) => {
  mainImgInfo.value = info;
  whiteInkInfo.value = whiteInkInfo.value;
  console.log("🚀 ~ updateMainImgInfo ~ mainImgInfo.value:", mainImgInfo.value);
};

const updateWhiteInkImgInfo = (info) => {
  whiteInkInfo.value = info;
  console.log(
    "🚀 ~ updateWhiteInkImgInfo ~ whiteInkInfo.value:",
    whiteInkInfo.value
  );
};

const setWhiteInkImg = (info) => {
  mode.value = "editImg";
  whiteInkInfo.value = info;
  console.log("🚀 ~ setWhiteInkImg ~ whiteInkInfo.value:", whiteInkInfo.value);
};

const saveImg = async (e) => {
  console.log("🚀 ~ saveImg ~ e:", e);
  const uploadRes = await upload(e.img);
  previewImg.value = uploadRes.oosUrl;
  jsonData.value = e.jsonData;
  isShowPreview.value = true;
};
</script>

<style scoped lang="scss">
.container {
  :deep(.van-nav-bar) {
    backdrop-filter: blur(20px);
    background: rgba(247, 247, 247, 0.9);

    .van-nav-bar__left {
      padding: 0 10px;
    }
  }
}
</style>
