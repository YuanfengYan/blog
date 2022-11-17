import Cookies from 'js-cookie'

export default function(content,inject){
  const curTheme = Cookies.get('blogTheme')
  // console.log('plugin-content',content,process.server,curTheme)
  if(curTheme){//如果存在
    Cookies.set( 'blogTheme', curTheme)
    content.store.commit('theme/SET_THEME',curTheme)
  }else{
    Cookies.set( 'blogTheme', 'dark')
    content.store.commit('theme/SET_THEME','dark')
  }
  
}
