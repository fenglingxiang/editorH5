<template>
  <v-popup v-model:show="show" position="bottom" title="传图规范">
    <div class="pt-14 pb-14 pl-10 pr-10 scroll-y">
      <van-image src="https://fc-sd-a569b88z1.oss-cn-hangzhou.aliyuncs.com/badge-print/design-template/fumo-upload-img-rule.png" width="100%" />
    </div>
  </v-popup>
</template>

<script setup>
const show = defineModel("show", {
  type: Boolean,
  default: false,
});
</script>

<style lang="scss" scoped>

</style>