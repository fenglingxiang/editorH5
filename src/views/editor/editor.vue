<template>
  <div class="container">
    <div ref="navBarRef">
      <van-nav-bar
        title="商品设计"
        left-arrow
        fixed
        placeholder
        safe-area-inset-top
        :border="false"
        @click-left="back"
      />
    </div>
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
      <template v-if="mainImgInfo.url">
        <design-img v-model:main-img-info="mainImgInfo" v-show="mode == 'editImg'" @showUploadWhiteInk="mode = 'uploadWhiteInk'" />
      </template>

      <upload-white-ink :main-img-info="mainImgInfo" @exitUploadWhiteInk="mode = 'editImg'" v-if="mode == 'uploadWhiteInk'" />
    </div>

    <!-- 设计例子 -->
    <design-example
      v-model:show="isShowDesignExample"
      @showMoreExplain="isShowUploadImgRule = true"
    />

    <!-- 传图规范 -->
    <upload-img-rule v-model:show="isShowUploadImgRule" />

    <!-- 设计说明 -->
    <design-explain v-model:show="isShowDesignExplain" @showMoreExplain="isShowUploadImgRule = true" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import designImg from "./components/designImg.vue";
import uploadMainImg from "./components/uploadMainImg.vue";
import designExample from "./components/designExample.vue";
import uploadImgRule from "./components/uploadImgRule.vue";
import designExplain from "./components/designExplain.vue";
import uploadWhiteInk from "./components/uploadWhiteInk.vue";
import { getImgInfo } from "@/utils/util"

const navBarRef = ref(null);
const centerRef = ref(null);
const centerContent = ref({});
const mainImgInfo = ref({})
const mode = ref("uploadMainImg");
const isShowDesignExample = ref(true);
const isShowUploadImgRule = ref(false);
const isShowDesignExplain = ref(false)

onMounted(async () => {
  //保证dom完全渲染
  let timer = setTimeout(() => {
    clearTimeout(timer);
    centerContent.value = {
      width: (centerRef.value.clientWidth - 20),
      height: window.innerHeight - navBarRef.value.clientHeight,
    };
  }, 0);
});

const back = () => {};

const uploadImgSuccess = async (e) => {
  mode.value = "editImg";
  mainImgInfo.value = await getImgInfo(e.img)
  console.log("🚀 ~ uploadImgSuccess ~ mainImgInfo.value:", mainImgInfo.value)
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
