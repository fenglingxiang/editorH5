import axios from "axios"
// import { useUserStoreHook } from "@/store/modules/user"
import { showLoadingToast, showToast } from 'vant';

const loginLose = message => {
  showToast({
    message: message || "登录已过期，请重新登录",
    forbidClick: true,
    duration: 2500
  })
  return Promise.reject("请求异常拦截 - 登录态已过期")
}

/**
 * axios请求拦截器
 * @param {object} config axios请求配置对象
 * @return {object} 请求成功或失败时返回的配置对象或者promise error对象
 **/
let count = 0
let loadingInstance
axios.interceptors.request.use(
  config => {
    if (!config.hideLoading) {
      //不需要加载loading
      loadingInstance = showLoadingToast({
        message: '加载中...',
        forbidClick: true,
      });
      count++
    }

    // if (getItem(TOKEN)) config.headers["Authorization"] = getItem(TOKEN)
    config.headers["Authorization"] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZ2VudElkIjoxLCJyb2xlIjoiTk9STUFMIiwibWVyY2hhbnRJZCI6LTEsImN1cnJlbnRUaW1lTWlsbGlzIjoxNzQxNjYxODA4OTAyLCJuYW1lIjoi8J-SpCIsImV4cCI6MTc0MTk0OTgwOCwiaWF0IjoxNzQxNjYxODA4LCJhY2NvdW50Ijoib2t0ZFg2SUtaNEZCZldDSWtUWkZKSGh0TEhWMCIsIm1lbWJlcklkIjo3Mn0.oLkrFvrKpA3eBrtmOnLCSJV-zbyVzORq-qNlZqNa784"

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * axios 响应拦截器
 * @param {object} response 从服务端响应的数据对象或者error对象
 * @return {object} 响应成功或失败时返回的响应对象或者promise error对象
 **/
axios.interceptors.response.use(
  response => {
    if (!response.config.hideLoading) count--
    if (count == 0) loadingInstance?.close()
    return response
  },
  error => {
    let response = error?.response || {}
    count--
    if (count == 0) loadingInstance?.close()
    if (axios.isCancel(error)) return Promise.reject(`${error}请求已取消`) //防止取消的请求抛出错误
    if (response?.status == 401) {
      return loginLose(response?.data?.message)
    }
    showToast({
      message: response?.data?.message || "网络异常，请稍后重试！",
      forbidClick: true,
      duration: 2500
    })
    return Promise.reject(error)
  }
)

export default function http(options) {
  // 获取不同环境的请求域名
  const server_url = import.meta.env.VITE_BASE_API

  let opt = {}
  const method = options.method || "post"
  const url = options.url
  const data = options.data || {}
  if (!options.url) {
    console.error("url参数缺失")
    return
  }
  opt = {
    method,
    baseURL: "",
    url: url.indexOf("//") > -1 ? url : server_url + url,
    timeout: 60000
  }
  if (["post", "POST", "put", "PUT"].includes(method) || options.requestJson) {
    opt.contentType = "application/json;charset-utf-8"
    opt.data = data
  } else if (["get", "GET", "delete", "DELETE"].includes(method)) opt.params = data
  if (options.headers) opt.headers = options.headers
  if (options.responseType) opt.responseType = options.responseType
  if (options.hideLoading) opt.hideLoading = options.hideLoading //配置项，不需要加载loading
  return new Promise((resolve, reject) => {
    axios(opt).then(
      res => {
        if (options.responseType === "blob") {
          if (res.data.size) resolve(res.data)
          else {
            showToast({
              message: "网络异常，请稍后重试！",
              forbidClick: true,
              duration: 2500
            })
          }
          return
        }
        const { data, config, status } = res
        let { code, message } = data
        if (status == 401) return loginLose(message)
        else if (status == 502) {
          showToast({
            message: "服务未启动",
            forbidClick: true,
            duration: 2500
          })
          return Promise.reject("请求异常拦截: 502")
        }

        if (code === 200) {
          // 成功
          let authorization = res?.headers?.Authorization || res?.headers?.authorization
          if (authorization) useUserStoreHook.setToken(authorization)
          resolve(data.data)
        } else if (code == 401) {
          // 登录过期
          return loginLose(message)
        } else if (code == 403) {
          //接口无权限
          showToast({
            message: message || "暂无接口权限",
            forbidClick: true,
            duration: 2500
          })
          return Promise.reject("请求异常拦截:" + JSON.stringify({ url: config.url, code, message }) || "Error")
        } else {
          console.log("error===>", data.data)
          showToast({
            message: message || "网络异常，请稍后重试！",
            forbidClick: true,
            duration: 2500
          })
          reject(data.data)
          return Promise.reject("请求异常拦截:" + JSON.stringify({ url: config.url, code, message }) || "Error")
        }
      },
      err => {
        reject(err)
      }
    )
  })
}
