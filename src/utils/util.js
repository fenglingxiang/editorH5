import { upload } from "@/utils/upload"

export const getImgInfo = (data) => {
  return new Promise(async (resolve, reject) => {
    if (!(data instanceof File) && (typeof data !== "string")) reject("🚀 ~ img数据格式有误")
    let url = data
    if (data instanceof File) {
      // url = URL.createObjectURL(data)
      let ossRes = await upload(data)
      url = ossRes.oosUrl
    }
    const img = new Image()
    img.src = url
    img.onload = () => {
      resolve({ w: img.width, h: img.height, url })
    }
  })
}

export const getImgUrl = (imgName) => {
  return new URL(`@/assets/images/${imgName}`, import.meta.url).href
}

/**
 * @param {string} url
 * @returns {Object}
 */
export const getQueryObject = url => {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

export const base64ToFile = (dataURL, fileName) => {
  // 拆分Base64字符串，获取MIME类型和数据部分
  const arr = dataURL.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const base64Data = arr[1];

  // 解码Base64数据为二进制字符串
  const binaryStr = atob(base64Data);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);

  // 将二进制字符串转换为字节数组
  for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
  }

  // 创建File对象
  return new File([bytes], fileName, { type: mimeType });
}