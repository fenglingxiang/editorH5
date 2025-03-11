import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // base: env.VITE_BASE_URL,
    base: "/",
    plugins: [
      vue(),
      // vueDevTools(),
      AutoImport({
        resolvers: [VantResolver()],
      }),
      Components({
        resolvers: [VantResolver()],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/variables.css" as *;`,
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      cors: true, // 允许跨域
      host: "0.0.0.0",
      open: true, // 服务启动时是否自动打开浏览器
      port: 8080, // 服务端口号
      // proxy: {
      // 	"/api": {
      // 		changeOrigin: true,
      // 		rewrite: (path) => path.replace(/^\/api/, ""),
      // 		// target: "http://127.0.0.1:9999/"
      // 		target: "http://localhost:8080/"
      // 	}
      // }

    },
    build: {
      outDir: env.VITE_PACKAGE_NAME,
      /** 单个 chunk 文件的大小超过 2048KB 时发出警告 */
      chunkSizeWarningLimit: 2048,
      /** 禁用 gzip 压缩大小报告 */
      reportCompressedSize: false,
      /** 打包后静态资源目录 */
      // assetsDir: "static",
      rollupOptions: {
        output: {
          /**
           * 分块策略
           * 1. 注意这些包名必须存在，否则打包会报错
           * 2. 如果你不想自定义 chunk 分割策略，可以直接移除这段配置
           */
          manualChunks: {
            vue: ["vue", "vue-router"],
          },
          chunkFileNames: "static/js/[name]-[hash].js", // 引入文件名的名称
          entryFileNames: "static/js/[name]-[hash].js", // 包的入口文件名称
          assetFileNames: "static/[ext]/[name]-[hash].[ext]", // 资源文件像 字体，图片等
        }
      }
    },
    /** 混淆器 */
    esbuild:
      mode === "development"
        ? undefined
        : {
          /** 打包时移除 console.log */
          pure: ["console.log"],
          /** 打包时移除 debugger */
          drop: ["debugger"],
          /** 打包时移除所有注释 */
          legalComments: "none"
        },
  }
})
