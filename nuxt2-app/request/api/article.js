import { GET } from '../http.js'
import article from '../urls/article'

// 获取文章详情
export function getArticleDetail(params) {
  return GET({
    url: article.detail + '/' + params.id,
    params
  })
}

// 获取文章列表
export function getArticleList(params) {
  return GET({
    url: article.list,
    params
  })
}
// 获取文章详情
export function getArticleSearch(params) {
  return GET({
    url: article.search,
    params
  })
}
// 获取文章详情
export function getArticleBaseInfo(params) {
  return GET({
    url: article.baseinfo,
    params
  })
}
