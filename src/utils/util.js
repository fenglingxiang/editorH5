export const getImgInfo = (data) => {
  return new Promise((resolve, reject) => {
    if(!(data instanceof File) && (typeof data !== "string")) reject("🚀 ~ img数据格式有误")
    let url = data
    if (data instanceof File) {
      url = URL.createObjectURL(data)
    }
    const img = new Image()
    img.src = url
    img.onload = () => {
      resolve({ w: img.width, h: img.height, url })
    }
  })
}