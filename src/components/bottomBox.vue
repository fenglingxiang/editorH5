<template>
  <div :style="{ height: bottomH + 'px' }">
    <div class="bottom-box" ref="bottomBoxRef">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

const bottomBoxRef = ref(null);
const bottomH = ref(0);

const emits = defineEmits(["getBottomBoxH"]);

const getBottomBoxH = (h) => {
  console.log("🚀 ~ getBottomBoxH ~ h:", h)
  bottomH.value = h;
  emits("getBottomBoxH", { h });
};

// watch(
//   () => bottomBoxRef.value?.clientHeight,
//   newVal => {
//     console.log("bottomBoxRef===>clientHeight", newVal)
//     getBottomBoxH(newVal)
//   }
// )

onMounted(() => {
  let timer = setTimeout(() => {
    clearTimeout(timer)
    getBottomBoxH(bottomBoxRef.value.clientHeight);
  }, 0);
});
</script>

<style lang="scss" scoped>
.bottom-box {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
