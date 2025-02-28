<template>
  <v-popup v-model:show="show" title="设计说明" width="335px">
    <div class="fs-12 lh-24 ta-left mt-20">
      <div class="flex align-center justify-between flex-wrap">
        <div class="rule-item" v-for="(item, index) in rules" :key="index">
          <div style="color: var(--com-grey-color);">{{ item.name }}</div>
          <div class="fw-700 mt-10">{{ item.value }}</div>
        </div>
      </div>
      <div>
        <div>注意：</div>
        <div>
          1.该商品实物出血会上下左右裁剪4mm，红色区域为裁剪区域，需注意作品创作元素排布，以保证裁剪切割后不影响主体画面
        </div>
      </div>
      <div class="fw-700 mt-10" style="color: var(--com-blue-color)" @click="showMoreExplain">
        查看详细说明
      </div>
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

const rules = ref([
  {
    name: "图片尺寸：",
    value: "626 x 826像素",
  },
  {
    name: "图片大小：",
    value: "最大不能超过20MB",
  },
  {
    name: "图片格式寸：",
    value: "建议png格式",
  },
  {
    name: "图片分辨率及色域",
    value: "300DPI、RGB模式",
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

<style lang="scss" scoped>
.rule-item {
  width: 138px;
  font-size: 12px;
  line-height: 17px;
  padding: 6px 10px;
  border-radius: 6px;
  background: rgba(247, 247, 247, 0.9);
  margin-bottom: 10px;
}
</style>
