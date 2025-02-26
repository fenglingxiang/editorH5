<template>
  <div ref="containerRef">
    <div class="flex align-center justify-end">
      <van-button type="primary" size="small" class="save-button" disabled
        >保存</van-button
      >
    </div>
    <van-uploader :before-read="beforeRead" :after-read="uploadImgSuccess" :accept="accept">
      <div
        class="upload-box flex-column justify-between"
        :style="{
          width: uploadW + 'px',
          height: uploadW + 'px',
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
    <bottom-box>
      <div
        class="bg-white flex align-center justify-between pl-10 pr-10 pt-10 pb-10"
      >
        <van-button class="flex-1 mr-12">设计说明</van-button>
        <van-button class="flex-1" type="primary" @click="uploadImgClick"
          >上传图片</van-button
        >
      </div>
    </bottom-box>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import bottomBox from "@/components/bottomBox/index.vue";

const props = defineProps({
  // uploadW: {
  //   type: [Number, String],
  //   default: 355,
  // },

  // uploadH: {
  //   type: [Number, String],
  //   default: 355,
  // },

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
});

const emits = defineEmits(["uploadImgSuccess"]);

const containerRef = ref(null)
const uploadW = ref(0)

onMounted(() => {
  uploadW.value = containerRef.value.clientWidth
})

const beforeRead = (file) => {
  console.log("🚀 ~ beforeRead ~ file.type:", file.type)
  console.log("🚀 ~ beforeRead ~ props.accept:", props.accept)
  if (props.accept.indexOf(file.type) === -1) {
    showToast("图片格式不支持");
    return false;
  } 
  return true
};

const uploadImgSuccess = (e) => {
  console.log("🚀 ~ uploadImgSuccess ~ e:", e)
  // "https://dimg04.c-ctrip.com/images/0302y12000cp1fr3rB841.jpg",
  // "https://img0.baidu.com/it/u=2191392668,814349101&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1399",
  emits("uploadImgSuccess", {
    img: e.objectUrl
  });
};

const uploadImgClick = () => {};
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
