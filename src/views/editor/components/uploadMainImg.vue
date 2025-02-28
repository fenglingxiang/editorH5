<template>
  <div ref="containerRef">
    <div class="flex align-center justify-end">
      <van-button type="primary" size="small" class="save-button" disabled
        >保存</van-button
      >
    </div>
    <upload
      :beforeRead="beforeRead"
      :size="uploadW"
      :offset-top="offsetTop"
      :accept="accept"
      @uploadImgSuccess="uploadImgSuccess"
    />
    <bottom-box>
      <div class="bg-white flex align-center justify-between p-10">
        <van-button class="flex-1 mr-12" @click="showExplain"
          >设计说明</van-button
        >
        <van-uploader
          :before-read="beforeRead"
          :after-read="uploadImgSuccess"
          :accept="accept"
          class="upload-btn flex-1"
        >
          <van-button type="primary" class="w-100">上传图片</van-button>
        </van-uploader>
      </div>
    </bottom-box>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import upload from "./upload.vue";

const props = defineProps({
  offsetTop: {
    type: [Number, String],
    default: 60,
  },

  accept: {
    type: String,
    default: "image/png, image/jpg, image/jpeg",
  },
});

const emits = defineEmits(["showExplain", "uploadImgSuccess"]);

const containerRef = ref(null);
const uploadW = ref(0);

onMounted(() => {
  uploadW.value = containerRef.value.clientWidth;
});

const showExplain = () => {
  emits("showExplain");
};

const beforeRead = (file) => {
  return new Promise(async (resolve, reject) => {
    if (props.accept.indexOf(file.type) === -1) {
      showToast("图片格式不支持");
      reject();
    }
    resolve();
  });
};

const uploadImgSuccess = (e) => {
  console.log("🚀 ~ uploadImgSuccess ~ e:", e);
  emits("uploadImgSuccess", {
    img: e.objectUrl,
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
