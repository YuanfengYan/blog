import Cookies from 'js-cookie'

const state = () => ({
  theme: 'light',
})

const mutations = {
  SET_THEME(state, data) {
    // if(process.client){
    // }
    console.log('SET_THEME',data)
    Cookies.set('blogTheme', data)
    state.theme = data
  },
}


export default {
  namespace: true,
  state,
  mutations
}
