// https://v3.nuxtjs.org/api/configuration/nuxt.config
const lifecycle = process.env.npm_lifecycle_event;
import AutoImport from 'unplugin-auto-import/vite'
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// console.log('lifecycle', process.env)
export default defineNuxtConfig({
  app: {
    head: {
      title: "Yan's blog",
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  //  vite plugins
  vite: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        dts: true,
        resolvers: [ElementPlusResolver()]
      }),
    ],
    optimizeDeps: {
      // 添加该行代码
      include: [],
      // 用于：从预捆绑中排除的依赖项
      exclude: [],
    },
  },
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      apiBase: '/api'
    }
  },
  // css: ["~/assets/scss/index.scss"],
  css: [
    'element-plus/dist/index.css',
  ],
  // @import "element-plus/dist/index.css";

  modules: [
    // '@unocss/nuxt',
  ],
  typescript: {
    shim: false
  },
  //  Babel 转译特定的依赖
  build: {
    transpile:  ["element-plus"] 
  },
  // builder: 'vite',
})
