import { defineAsyncComponent } from "vue"
const components = import.meta.glob("../components/**/*") // 异步方式
export default app => {
  for (const [key, value] of Object.entries(components)) {
    const name = key.slice(key.lastIndexOf("/") + 1, key.lastIndexOf("."))
    app.component(name, defineAsyncComponent({loader: value}))
  }
}