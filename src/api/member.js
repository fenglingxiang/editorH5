import axios from "@/utils/axios"

// 保存商品
export const saveOrUpdate = data => {
  return axios({
    url: "/badge-mini/member/goods/saveOrUpdate",
    method: "POST",
    data
  })
}

// 获取我的商品详情
export const getGoodsDetail = data => {
  return axios({
    url: "/badge-mini/member/goods/getGoodsDetail",
    method: "GET",
    data
  })
}