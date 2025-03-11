// request get ali-oss information
import axios from "axios"
import request from "@/utils/axios"

const createOssPolicy = data => {
	return request({
		url: "/wapp/oss/createOssPolicy",
		method: "get",
		data
	})
}

export const fileTypes = ["photo", "audio", "video", "file"] // 上传的文件类型

export const getFormat = path => {
	return path.substring(path.lastIndexOf("/") + 1, path.length)
}

const uploadOss = (host, formData, callback) => {
	return axios({
		url: host,
		method: "post",
		data: formData,
		onUploadProgress: progressEvent => {
			// 原生获取上传进度的事件
			if (progressEvent.lengthComputable) {
				callback && callback(progressEvent)
			}
		}
	}).then(res => {
		return res
	})
}

// 上传文件到阿里云
export const upload = (file, prefix = "", fileType = 0, callback) => {
	return new Promise((resolve, reject) => {
		createOssPolicy({
			format: getFormat(file.type),
			fileType: fileTypes[fileType],
			prefix
		})
			.then(async res => {
				if (res.code == 401) return
				const {dir, host, accessKeyId, policy, signature} = res
				let formData = new FormData()
				formData.append("OSSAccessKeyId", accessKeyId)
				formData.append("policy", policy)
				formData.append("signature", signature)
				formData.append("key", dir)
				formData.append("success_action_status", "200")
				formData.append("file", file)
				let res2 = await uploadOss(host, formData, callback)
				if (res2.code == 401) return
				if (res2.status == 200) {
					return resolve({
						oosUrl: host + "/" + dir,
						fileName: file.name
					})
				}
			})
			.catch(err => {
				console.log(err)
				return reject({
					msg: "上传失败，请重试！"
				})
			})
	})
}
