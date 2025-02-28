<template>
  <v-popup v-model:show="show" width="335px">
    <div>
      <div>退出后你的操作将不会被保存，确认退出吗?</div>
      <div class="flex align-center justify-between mt-20">
        <van-button type="primary" hairline plain class="mr-20" style="width: 138px" @click="show = false"
          >取消</van-button
        >
        <van-button type="primary" style="width: 138px" @click="exit"
          >退出</van-button
        >
      </div>
    </div>
  </v-popup>
</template>

<script setup>
const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const emits = defineEmits(["exit"]);

const exit = () => {
  show.value = false;
  emits("exit");
};
</script>

<style lang="scss" scoped></style>
