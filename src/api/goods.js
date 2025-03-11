import axios from "@/utils/axios"

// 获取商品效果图
export const getGoodsSketch = data => {
  return axios({
    url: "/badge-mini/goods/getGoodsSketch",
    method: "POST",
    data
  })
}

// 获取商品规格参数
export const getGoodsSpecificationParameters = data => {
  return axios({
    url: `/badge-mini/goods/getGoodsSpecificationParameters?goodsId=${data.goodsId}&type=${data.type}${data.specParamIds}`,
    method: "GET",
    // data
  })
}
