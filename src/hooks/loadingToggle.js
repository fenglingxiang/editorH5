import loading from "@/components/loading.vue"
import { createVNode, render } from "vue"

export const useLoading = () => {
  let loadingInstance;
  const showLoading = () => {
    if(!loadingInstance) {
      loadingInstance = createVNode(loading)
      render(loadingInstance, document.body)
    }
  }

  const hideLoading = () => {
    if(loadingInstance) {
      render(null, document.body)
      loadingInstance = null
    }
  }

  return { showLoading, hideLoading }
}