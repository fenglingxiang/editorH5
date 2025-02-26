<template>
  <van-popup v-model:show="show" round style="--van-popup-round-radius: 10px">
    <div class="popup-box">
      <div>退出后你的操作将不会被保存，确认退出吗?</div>
      <div class="flex align-center justify-between mt-20">
        <van-button class="mr-20" style="width: 138px;" @click="show = false"
          >取消</van-button
        >
        <van-button type="primary" style="width: 138px;" @click="exit"
          >退出</van-button
        >
      </div>
    </div>
  </van-popup>
</template>

<script setup>
const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const emits = defineEmits(['exit'])

const exit = () => {
  emits("exit")
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
