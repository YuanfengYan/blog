import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'
const  BLOG_TOKEN = process.env.BLOG_TOKEN as string

export function encodeToken() {
  const token = getToken()
  const base64 = Base64.encode(token + ':')
  return 'Basic ' + base64
}

export function getToken() {
  return Cookies.get( BLOG_TOKEN)
}

export function setToken(token:string) {
  return Cookies.set( BLOG_TOKEN, token)
}

export function removeToken() {
  return Cookies.remove( BLOG_TOKEN)
}
