import Vue from 'vue'
import { removeToken, encodeToken } from "@/lib/auth";

export default ({ $axios, store ,$config: { BASE_URL }}) => {
  // config.default.baseURL
  let reqList = []
  /**
 * 阻止重复请求
 * @param {array} reqList - 请求缓存列表
 * @param {string} url - 当前请求地址
 * @param {function} cancel - 请求中断函数
 * @param {string} errorMessage - 请求中断时需要显示的错误信息
 */
  const stopRepeatRequest = function (reqList, url, cancel, errorMessage) {
    const errorMsg = errorMessage || ''
    for (let i = 0; i < reqList.length; i++) {
      if (reqList[i] === url) {
        cancel(errorMsg)
        return
      }
    }
    reqList.push(url)
  }
  /**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
const allowRequest = function (reqList, url) {
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      reqList.splice(i, 1)
      break
    }
  }
}

  $axios.defaults.baseURL = 'http://192.168.10.238:5000/'//process.env.BASE_URL
  $axios.onRequest(config => {
    // console.log('process.env.BASE_URL',config)
    //  config.baseURL ='http://192.168.10.238:5000/'

    config.headers.Authorization = encodeToken()
    let cancel
  	// 设置cancelToken对象
    config.cancelToken = new $axios.CancelToken(function(c) {
    	cancel = c
    })
    // stopRepeatRequest(reqList, config.url, cancel, `${config.url} 请求被中断`)
    return config
  })

  $axios.onResponse(res => {
    // console.log('onResponse',res)
    // setTimeout(() => {
    //   allowRequest(reqList, res.config.url)
    // }, 1000)
    if (res.status === 200 && res.data.code === 200) {
      return res
    } else {
      Vue.prototype.$message.error(res.data.msg || '获取失败')
      return Promise.reject(res)
    }
  })

  $axios.onError(err => {
    const { response } = err
    // 处理token过期无效情况，清除token，初始化store数据
    if ([401, 403].includes(response.status)) {
      removeToken()
      store.commit('user/SET_LOGIN_STATUS', false)
      store.commit('user/SET_USERINFO', null)
    }

    const msg = Array.isArray(response.data.msg) ? response.data.msg.join(',') : response.data.msg
    Vue.prototype.$message.error(msg || '获取失败')
    return Promise.reject(err)
  })
}
