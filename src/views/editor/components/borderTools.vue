<template>
  <div>
    <div class="p-10 relative">
      <div
        class="flex align-center bg-white"
        style="padding-right: 42px; overflow-x: auto"
      >
        <div
          class="clear-item border-item flex-column align-center justify-center"
          @click="clearBorder"
        >
          <van-icon name="/src/assets/images/clear-icon.png" size="40" />
          <div>清空</div>
        </div>
        <div
          :class="[
            'border-item',
            index === curBorder && 'border-item--active',
            'flex-column',
            'align-center',
            'justify-center',
          ]"
          v-for="(item, index) in borderList"
          :key="index"
          @click="changeBorder(index)"
        >
          <van-image :src="item.img" width="60px" height="60px" />
        </div>
      </div>
      <div class="check-more flex align-center justify-center">
        <div @click="show = true">查看全部</div>
      </div>
    </div>
    <all-border v-model:show="show" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import allBorder from "./allBorder.vue";

const emits = defineEmits(["clearBorder", "changeBorder"]);

const borderList = ref([
  {
    img: "/src/assets/images/border.png",
  },
]);
const curBorder = ref(-1);
const show = ref(false);

const clearBorder = () => {
  curBorder.value = -1;
  emits("clearBorder");
};

const changeBorder = (index) => {
  curBorder.value = index;
  emits("changeBorder", borderList.value[index]);
};
</script>

<style lang="scss" scoped>
.clear-item {
  background-color: #f5f5f5;
  font-size: 12px;
  line-height: 17px;
  color: #b9b9b9;
}

.border-item {
  width: 80px;
  height: 107px;
  border-radius: 2px;
  border: 1px solid #e1e2e1;
  margin-right: 10px;
  background-color: #fff;
}

.border-item--active {
  border-color: #2b2d2b;
}

.check-more {
  width: 42px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 2px 0px 0px 2px;
  box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 0 6px;
  font-size: 12px;
  line-height: 17px;
  font-weight: 500;
  color: #2b2d2bcc;
}
</style>
