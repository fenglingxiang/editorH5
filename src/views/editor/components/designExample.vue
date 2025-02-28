<template>
  <v-popup v-model:show="show" position="bottom">
    <div class="pt-10">
      <div class="flex-column align-center">
        <div class="fs-16 fw-700">实物偏移为正常现象</div>
        <div class="flex align-center mt-6">
          <van-icon name="/src/assets/images/warn-icon.png" size="20" />
          <div>均不在售后范围内！</div>
        </div>
      </div>
      <div class="p-10" v-for="(item, index) in examples" :key="index">
        <div class="flex align-center mb-10">
          <div class="fw-500 mr-10">情况{{ index + 1 }}</div>
          <div>{{ item.title }}</div>
        </div>
        <van-image :src="URL + item.img + '.png'" width="100%" height="135px" />
      </div>
      <div
        class="fs-12 fw-500 pr-10 pb-10 pl-10"
        style="color: var(--com-red-color)"
      >
        所有图案中带有圆形元素的情况下，实物均有不同程度的偏移，均不在售后范围内！
      </div>
      <bottom-box>
        <div class="flex algin-center jusitfy-between p-10">
          <van-button class="flex-1 mr-12" @click="showMoreExplain">详细说明</van-button>
          <van-button type="primary" class="flex-1" @click="show = false">开始设计</van-button>
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

const emits = defineEmits(["showMoreExplain"])

const URL =
  "https://fc-sd-a569b88z1.oss-cn-hangzhou.aliyuncs.com/badge-print/design-template/";

const examples = ref([
  {
    title: "图案设计成圆形",
    img: "fumo-example1",
  },
  {
    title: "图案内有圆形的文字或线条等元素",
    img: "fumo-example2",
  },
]);

const showMoreExplain = () => {
  show.value = false
  //设置延时是因为popup有0.3s的动画
  let timer = setTimeout(() => {
    clearTimeout(timer)
    emits("showMoreExplain")
  }, 300);
}
</script>

<style lang="scss" scoped></style>
