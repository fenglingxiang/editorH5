<template>
  <van-uploader
    :before-read="beforeRead"
    :after-read="uploadImgSuccess"
    :accept="accept"
  >
    <div
      class="upload-box flex-column justify-between"
      :style="{
        width: size + 'px',
        height: size + 'px',
        marginTop: offsetTop + 'px',
      }"
    >
      <div class="flex-column align-center" style="padding: 46px 0">
        <van-icon name="plus" size="30" />
        <div class="fs-16 mt-10">{{ title }}</div>
        <div class="mt-17">{{ ruleText }}</div>
      </div>
      <div class="tips flex">
        <van-icon
          name="https://fc-sd-a569b88z1.oss-cn-hangzhou.aliyuncs.com/badge-print/icons/warn-icon.png"
          size="28px"
          style="height: max-content"
        />
        <div class="ml-20" style="width: 480rpx">{{ explain }}</div>
      </div>
    </div>
  </van-uploader>
</template>

<script setup>
const props = defineProps({
  size: {
    type: [Number, String],
    default: 355,
  },

  offsetTop: {
    type: [Number, String],
    default: 60,
  },

  title: {
    type: String,
    default: "上传图片",
  },

  ruleText: {
    type: String,
    default: "图片仅支持png、jpg或jpeg （建议600dpi）",
  },

  explain: {
    type: String,
    default:
      "请避免使用#FFFFFF的纯白色；线条宽度要大于6 像素(0.5mm)；透明度大于50%；",
  },

  accept: {
    type: String,
    default: "image/png, image/jpg, image/jpeg",
  },

  beforeRead: {
    type: Function
  }
});

const emits = defineEmits(["uploadImgSuccess"]); 

const uploadImgSuccess = (e) => {
  console.log("🚀 ~ uploadImgSuccess ~ e:", e)
  emits("uploadImgSuccess", e);
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
</style>
