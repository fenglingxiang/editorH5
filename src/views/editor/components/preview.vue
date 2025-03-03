<template>
  <v-popup
    v-model:show="show"
    position="bottom"
    title="保存并预览"
    :padding="[10, 20]"
    class="no-padding-title"
  >
    <div class="mt-30">
      <div class="flex align-center scroll-x">
        <div
          :class="[
            'type-item',
            'flex',
            'align-center',
            index === curType && 'type-item--active',
          ]"
          v-for="(item, index) in 10"
          :key="index"
        >
          <div class="type-item-left"></div>
          <div>亮膜</div>
        </div>
      </div>
      <van-image
        src=""
        width="100%"
        height="335"
        fit="widthFix"
        class="mt-10"
      />
      <div class="product-info">【Ycattle】10cm覆膜吧唧 十字镭射膜</div>
      <div class="flex align-center pt-4 pb-4 mt-10">
        <van-switch
          v-model="isOpen"
          active-color="#000"
          inactive-color="#dcdee0"
          size="15px"
          class="mr-3"
        />
        <div class="lh-17">同图推荐</div>
        <div class="fs-12" style="color: #b9b9b9">
          开启后去下单我们将为您推荐更多合适商品
        </div>
      </div>
      <div class="flex align-center p-10 mt-10">
        <van-button class="flex-1">
          <div class="flex-column align-center">
            <van-icon name="/src/assets/images/home-icon.png" size="28px" />
            <div class="fs-10 mt-4">首页</div>
          </div>
        </van-button>
        <van-button type="primary" class="flex-1">去下单</van-button>
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

const curType = ref(0);
const isOpen = ref(false);
</script>

<style lang="scss" scoped>
.type-item {
  padding: 4px 8px;
  min-width: 56px;
  border-radius: 2px;
  background-color: #e4e7ec;
  font-size: 12px;
  line-height: 17px;
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  .type-item-left {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 6px;
  }
}

.type-item--active {
  background-color: #2b2d2b;
  color: #fff;
}

.product-info {
  margin-top: 10px;
  padding: 6px 10px;
  border-radius: 2px;
  border: 1px solid #4f524f;
  font-size: 12px;
  line-height: 17px;
}
</style>
