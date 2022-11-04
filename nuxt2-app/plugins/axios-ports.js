import { setClient } from '~/request/request'

export default ({ app, store }) => {
    setClient(app.$axios)
    // app.router.beforeEach((to, from, next) => {
    //     // to and from are both route objects. must call `next`.
    //     next()
    // })
}
