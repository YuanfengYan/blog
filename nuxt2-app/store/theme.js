
const state = () => ({
  theme: 'dark',
})

const mutations = {
  SET_THEME(state, data) {
    console.log('SET_THEME-SET_THEME')
    if(process.client){
      document.body.setAttribute("data-theme", data);
    }
    state.theme = data
  },
}


export default {
  namespace: true,
  state,
  mutations
}
