import axios from "@/utils/axios"

// 微信api配置
export const getJsJDKSgin = data => {
	return axios({
		url: "/open/wx/api/getJsJDKSgin",
		method: "GET",
		data
	})
}