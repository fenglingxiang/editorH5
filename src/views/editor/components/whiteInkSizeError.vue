<template>
  <v-popup v-model:show="show" width="335px">
    <div>
      <div class="fs-16 fw-700" style="color: var(--com-red-color);">白墨图尺寸与原图尺寸不符?</div>
      <div class="mt-10">当前原图尺寸：{{ mainImgInfo.w }}*{{ mainImgInfo.h }}px</div>
      <div class="mt-10">当前白墨图尺寸：{{ whiteInkInfo.w }}*{{ whiteInkInfo.h }}px</div>
      <van-button type="primary" class="w-100 mt-20" @click="show = false">去修改</van-button>
    </div>
  </v-popup>
</template>

<script setup>
const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const props = defineProps({
  whiteInkInfo: {
    type: Object,
    default: () => {
      return {};
    },
  },

  mainImgInfo: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
</script>

<style lang="scss" scoped></style>
