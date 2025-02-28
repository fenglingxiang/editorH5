<template>
  <v-popup
    v-model:show="show"
    position="bottom"
    height="93vh"
    maxHeight="93vh"
    :padding="[12]"
  >
    <div class="title-box flex align-center relative bg-white" slot="header">
      <van-icon
        name="arrow-left"
        size="24"
        class="mr-8"
        @click="curType = -1"
        v-if="curType !== -1"
      />
      <div class="fw-700 fs-16 ta-left">
        {{ title }}
      </div>
      <van-icon
        name="close"
        size="24"
        class="absolute"
        style="top: 0; right: 0"
        @click="onClose"
      />
    </div>
    <div class="flex-column min-h--0" v-show="curType === -1">
      <div class="flex align-center flex-wrap mb-16">
        <van-button
          class="border-type-item"
          v-for="(item, index) in borderTypes"
          :key="index"
          @click="changeType(item)"
          >{{ item.name }}</van-button
        >
      </div>
      <div class="fs-16 fw-500 mb-3">热门推荐</div>
      <div class="flex align-center flex-wrap flex-1 scroll-y">
        <div
          class="border-img-item flex-column align-center justify-center"
          v-for="item in 50"
          :key="item"
          @click="changeBorderImg(item)"
        ></div>
      </div>
    </div>

    <div class="flex align-center flex-wrap flex-1 scroll-y mt-10" v-show="curType !== -1">
      <div
        class="border-img-item flex-column align-center justify-center"
        v-for="item in 50"
        :key="item"
        @click="changeBorderImg(item)"
      ></div>
    </div>
  </v-popup>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const title = ref("边框分类");
const borderTypes = ref([
  {
    name: "卡通",
    type: 1,
  },
  {
    name: "圣诞",
    type: 2,
  },
]);
const curType = ref(-1);

const changeType = (item) => {
  title.value = item.name;
  curType.value = item.type;
};

const onClose = () => {
  curType.value === -1 ? (show.value = false) : (curType.value = -1);
};

const changeBorderImg = (item) => {
  show.value = false
}
</script>

<style lang="scss" scoped>
.border-type-item {
  border-radius: 2px;
  background: rgb(241, 241, 241);
  padding: 0 10px;
  margin: 10px 10px 0 0;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  min-width: 68px;
  height: 36px;
}

.border-img-item {
  width: calc((100vw - 24px - 30px)/4);
  height: calc((100vw - 24px - 30px)/4);
  border-radius: 2px;
  background: rgb(246, 246, 246);
  border: 1px solid transparent;
  margin: 0 10px 10px 0;
  padding: 10px;

  &:nth-child(4n) {
    margin-right: 0;
  }
}

.border-img-item--active {
  border-color: #000;
}
</style>
