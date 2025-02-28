<template>
  <van-popup
    v-model:show="show"
    :close-on-click-overlay="false"
    style="--van-popup-background: transparent"
    :overlay-style="{ background: '#fff', opacity: 0.5 }"
  >
    <div class="flex align-center justify-center" style="width: 100px; height: 100px;">
      <van-image
        src="/src/assets/images/loading-icon.png"
        width="48px"
        height="48px"
        class="loading-icon"
      />
    </div>
  </van-popup>
</template>

<script setup>
import { ref } from "vue";
const show = ref(true);
</script>

<style lang="scss" scoped>
:depp(.van-popup--center) {
  background-color: transparent;
}

.loading-icon {
  animation: rotate 1.5s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
