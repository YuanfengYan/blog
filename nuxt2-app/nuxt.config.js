const dotenv = require('dotenv')
const envConfig = dotenv.config({ path: `.env.${process.env.NODE_ENV}` }).parsed

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '前端杂货铺',
    htmlAttrs: {
      lang: 'en',
    },
    script:[{src:'https://hm.baidu.com/hm.js?225dda0a0f1768d18983f6a9de266e2b'}],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading:'~/components/loading/loading.vue',
  env:{
    baseUrl:process.env.BASE_URL || 'http://localhost:5000'
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'assets/rest.css',
  ],
  styleResources: {
    scss: [
      './assets/theme.scss'
    ]
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/md-editor',
    '@/plugins/element-ui',
    '@/plugins/axios',
    '@/plugins/axios-ports',
    {src:'@/plugins/theme',ssr: false},
    { src: '@/plugins/scrollTo', ssr: false }

    
    
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],
  router: {
    // middleware: 'auth'
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/style-resources' // 添加对应的模块
  ],
  // axios: {
  //   proxy: true,
  //   // prefix: '/api/',
  //   credentials: true
  //   // See https://github.com/nuxt-community/axios-module#options
  // },
  // proxy: {
  //   '/api/': {
  //     target: 'http://47.99.103.174:5000/api',//这个网站是开源的可以请求到数据的
  //     pathRewrite: {
  //       '^/api/': '/api/',
  //       changeOrigin: true
  //     }
  //   }
  // },
  server: {
    port: 3000, // 默认: 3000
    host: '0.0.0.0' // 默认: localhost,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },
  publicRuntimeConfig:{
    BASE_URL: process.env.BASE_URL,
  }

}
