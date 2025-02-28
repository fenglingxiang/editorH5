<template>
  <van-popup
    v-model:show="show"
    :position="position"
    :close-on-click-overlay="closeOnClickOverlay"
    :round="round"
    :safe-area-inset-top="safeAreaInsetTop"
    :safe-area-inset-bottom="safeAreaInsetBottom"
    style="--van-popup-round-radius: 10px"
  >
    <div
      class="popup-box flex-column"
      :style="{ maxHeight, height, width, padding: paddingStyle }"
    >
      <div class="title-box relative bg-white" v-if="title">
        <div :class="['fw-700', 'fs-16', 'ta-' + titlePosition]">
          {{ title }}
        </div>
        <van-icon
          name="close"
          size="24"
          class="absolute close-icon"
          @click="show = false"
        />
      </div>
      <slot name="header" v-else />
      <slot />
    </div>
  </van-popup>
</template>

<script setup>
import { computed, ref } from "vue";

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const props = defineProps({
  width: {
    type: String,
    default: "100%",
  },

  height: {
    type: String,
    default: "max-contain"
  },

  maxHeight: {
    type: String,
    default: "85vh",
  },

  title: {
    type: String,
    default: "",
  },

  titlePosition: {
    type: String,
    default: "center", //可选left center right
  },

  closeOnClickOverlay: {
    type: Boolean,
    default: false,
  },

  round: {
    type: Boolean,
    default: true,
  },

  position: {
    type: String,
    default: "center", //弹出位置，可选值为 top bottom right left
  },

  safeAreaInsetTop: {
    type: Boolean,
    default: true,
  },

  safeAreaInsetBottom: {
    type: Boolean,
    default: true,
  },

  padding: {
    type: Array,
    default: [],
  },
});

const paddingStyle = computed(() => {
  let style = "";
  let padding = props.padding;
  if (padding.length === 1) {
    style = `${padding[0]}px`;
  } else if (padding.length === 2) {
    style = `${padding[0]}px ${padding[1]}px`;
  }
  return style;
});

const popupBoxRef = ref(null);
</script>

<style lang="scss" scoped>
.popup-box {
  background-color: #fff;
  border-radius: var(--van-popup-round-radius);
}

.van-popup--center .popup-box {
  padding: 20px;
  text-align: center;

  .title-box {
    padding: 0;

    .close-icon {
      top: 0;
      right: 0;
    }
  }
}

.van-popup--bottom .popup-box {
  padding-top: 14px;

  .title-box {
    padding: 12px;

    .close-icon {
      top: 12px;
      right: 12px;
    }
  }
}

.no-padding-title {
  .title-box {
    padding: 0 !important;

    .close-icon {
      top: 0 !important;
      right: 0 !important;
    }
  }
}

:deep(.van-sticky) {
  background-color: #fff;
  border-radius: var(--van-popup-round-radius);
}
</style>
