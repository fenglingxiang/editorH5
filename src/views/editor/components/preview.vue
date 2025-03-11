<template>
  <v-popup
    v-model:show="show"
    position="bottom"
    title="保存并预览"
    :padding="[10, 20]"
    class="no-padding-title"
  >
    <div class="mt-30" v-if="skuList.length">
      <div class="flex align-center scroll-x">
        <div
          :class="[
            'type-item',
            'flex',
            'align-center',
            (index === curType || item.isSave) && 'type-item--active',
          ]"
          v-for="(item, index) in skuList"
          :key="item.id"
          @click="onTypeChange(index)"
        >
          <van-icon name="passed" v-if="item.isSave" color="#fff" style="margin-right: 6px;" />
          <div class="type-item-left" size="10px" v-else></div>
          <div>{{ item.name }}</div>
        </div>
      </div>
      <van-image
        :src="skuList[curType].previewImg"
        width="100%"
        height="335"
        fit="widthFix"
        class="mt-10"
      />
      <div v-if="!skuList[curType].isSave">
        <input
          class="product-info"
          v-model="skuList[curType].defaultProductName"
        />
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
        <div class="flex align-center justify-center p-10 mt-10">
          <van-button type="primary" style="width: 164px" @click="saveConfirm"
            >确认保存</van-button
          >
        </div>
      </div>
      <div class="mt-10" v-else>
        <div
          class="flex align-center justify-center"
          style="
            background-color: #e4e7ec6b;
            padding: 20px 0;
            border-radius: 2px;
          "
        >
          <van-icon name="checked" size="16px" color="#7AD89C" />
          <div class="ml-10">保存成功</div>
        </div>
        <div class="flex align-center p-10 mt-10">
          <van-button class="flex-1">
            <div class="flex-column align-center">
              <van-icon :name="homeIcon" size="28px" />
              <div class="fs-10 mt-4">首页</div>
            </div>
          </van-button>
          <van-button type="primary" class="flex-1">去下单</van-button>
        </div>
      </div>
    </div>
  </v-popup>
</template>

<script setup>
import homeIcon from "@/assets/images/home-icon.png";
import { ref, watch } from "vue";
import { getGoodsSketch, getGoodsSpecificationParameters } from "@/api/goods";
import { saveOrUpdate } from "@/api/member";

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const props = defineProps({
  imgUrl: {
    type: String,
    default: "",
  },

  jsonData: {
    type: Object,
    default: () => {
      return {}
    }
  },

  goodsId: {
    type: Number,
    default: 1,
  },
});

const curType = ref(0);
const isOpen = ref(false);
const skuList = ref([]);

watch(
  () => show.value,
  async (val) => {
    console.log("🚀 ~ watch ~ val", val);
    if (val) {
      await getGoodsSpecificationParametersReq();
      getGoodsSketchReq();
    } else {
      curType.value = 0;
      isOpen.value = false;
      skuList.value.forEach((item) => {
        item.previewImg = ""
        item.isSave = false
      });
    }
  }
);

const getGoodsSpecificationParametersReq = () => {
  if (skuList.value.length) return;
  let specParamIds = "";
  [1].forEach((item) => {
    specParamIds = specParamIds + `&specParamIds=${item}`;
  });
  console.log(
    "🚀 ~ getGoodsSpecificationParametersReq ~ specParamIds:",
    specParamIds
  );
  return getGoodsSpecificationParameters({
    goodsId: 1,
    type: 3,
    specParamIds,
  }).then((res) => {
    console.log("🚀 ~ getGoodsSpecificationParametersReq ~ res:", res);
    skuList.value = res;
  });
};

const getGoodsSketchReq = () => {
  if (skuList.value[curType.value].previewImg) return;
  getGoodsSketch({
    chalkImageUrl: "",
    imageUrl: props.imgUrl,
    skuId: skuList.value[curType.value].id,
  }).then((res) => {
    skuList.value[curType.value].previewImg = res;
  });
};

const onTypeChange = (index) => {
  curType.value = index;
  getGoodsSketchReq();
};

const saveConfirm = () => {
  let item = skuList.value[curType.value]
  const jsonData = JSON.parse(JSON.stringify(props.jsonData));
  saveOrUpdate({
    id: "",
    sketchUrl: item.previewImg || "",
    jsonData: JSON.stringify(jsonData),
    name: item.defaultProductName,
    skuId: item.id,
  }).then((res) => {
    item.isSave = true;
  });
};
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
  width: 100%;
  margin-top: 10px;
  padding: 6px 10px;
  border-radius: 2px;
  border: 1px solid #4f524f;
  font-size: 12px;
  line-height: 17px;
}
</style>
