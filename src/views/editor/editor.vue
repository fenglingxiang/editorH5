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
      <upload-img
        :uploadW="centerContent.width"
        :uploadH="centerContent.width"
        @uploadImgSuccess="uploadImgSuccess"
        v-show="mode == 'uploadMainImg'"
      />
      <template v-if="mainImgUrl">
        <design-img
          :main-img-url="mainImgUrl"
          v-show="mode == 'editImg'"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import designImg from "./components/designImg.vue";
import uploadImg from "./components/uploadImg.vue";

const navBarRef = ref(null);
const centerRef = ref(null);
const centerContent = ref({});
const mainImgUrl = ref("");
const mode = ref("uploadMainImg");
// const mode = ref("editImg");
const offsetTop = 60;

onMounted(async () => {
  //保证dom完全渲染
  let timer = setTimeout(() => {
    clearTimeout(timer);
    centerContent.value = {
      width: centerRef.value.clientWidth - 20,
      height: window.innerHeight - navBarRef.value.clientHeight,
    };
  }, 0);
});

const back = () => {};

const uploadImgSuccess = (e) => {
  mode.value = "editImg";
  mainImgUrl.value = e.img;
};
</script>

<style scoped lang="scss">
.container {
  :deep(.van-nav-bar) {
    backdrop-filter: blur(20px);
    background: rgba(247, 247, 247, 0.9);
  }
}
</style>
