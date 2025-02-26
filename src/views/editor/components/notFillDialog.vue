<template>
  <van-popup v-model:show="show" round style="--van-popup-round-radius: 10px">
    <div class="popup-box">
      <van-image src="/src/assets/images/explain.png" width="295px" height="84px" />
      <div class="mt-20">图片未撑满打印区域，可能造成背面边缘露白</div>
      <div class="mt-10 fs-12">（预览效果仅供参考）</div>
      <van-button type="primary" class="mt-20 w-100" @click="toFill">帮我撑满</van-button>
    </div>
  </van-popup>
</template>

<script setup>
const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const emits = defineEmits(["toFill"])

const toFill = () => {
  emits("toFill")
}
</script>

<style lang="scss" scoped>
.popup-box {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  text-align: center;
}
</style>
