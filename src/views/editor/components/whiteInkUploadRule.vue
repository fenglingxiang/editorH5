<template>
  <v-popup
    v-model:show="show"
    position="bottom"
    title="白墨图上传规范"
    titlePosition="left"
    :padding="[12]"
    class="no-padding-title"
    height="517px"
  >
    <div class="scroll-y">
      <div class="mt-10">白墨图需以纯黑色(#000000)填充制</div>
      <div
        class="mt-10 fw-500"
        style="width: 182px; color: var(--com-red-color)"
      >
        上传图片尺寸必须与原图一致当前原图尺寸:{{mainImgInfo.w}}*{{mainImgInfo.h}}px
      </div>
      <div class="mt-30">
        <div class="rule-item" v-for="(item, index) in rules" :key="index">
          {{ item.title }}
        </div>
      </div>
      <bottom-box>
        <div class="p-12">
          <van-button type="primary" class="w-100" @click="show = false">确定</van-button>
        </div>
      </bottom-box>
    </div>
  </v-popup>
</template>

<script setup>
import { ref } from "vue";

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const props = defineProps({
  mainImgInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const rules = ref([
  {
    title: "如何用白墨做双闪吧唧?",
  },
  {
    title: "白墨小知识Q&A",
  },
  {
    title: "如何自制白墨图?",
  },
]);
</script>

<style lang="scss" scoped>
.rule-item {
  padding: 10px 12px;
  font-size: 20px;
  font-weight: 500;
  line-height: 29px;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    rgb(241, 241, 241),
    rgba(241, 241, 241, 0) 100%
  );
  margin-bottom: 19px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
