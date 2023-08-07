// 登录流程
// 登陆后跳转，然后请求资源并根据资源列表添加路由

import router from './router'
import store from './store'
import { Message } from 'element-ui'
// 进度条库
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 从cookie里面获取token
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import addRoutesByResources from '@/utils/routes-add'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.onReady(() => {
  //  如何已经登录存在资源就可以直接登录，初次登录不调用这个
  if (store.getters.resources) {
    // console.log(store.getters.resources)
    const resources = store.getters.resources
    addRoutesByResources(resources)
  }
  // 此处注意：通配符 '*' 不能在默认路由router/index.js里面添加，否则会造成刷新页面404等错误
  router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])
})

router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  // 获取token
  const hasToken = getToken()
  // 登陆后跳转，然后请求资源并根据资源列表添加路由
  if (hasToken) {
    // 有token
    if (to.path === '/login') {
      // 登陆成功，跳转到主页面
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 获取角色资源
          await store.dispatch('user/getInfo')

          // 需要在store添加对应方法、参数，并且需要在Commit之后调用
          if (store.getters.resources) {
            // 动态添加路由

            // console.log(store.getters.resources)
            const resources = store.getters.resources
            // 根据资源列表添加路由
            addRoutesByResources(resources)
          }
          // 此处注意：通配符 '*' 不能在默认路由router/index.js里面添加，否则会造成刷新页面404等错误
          router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])
          next()
        } catch (error) {
          // 出错时，移除token等，并跳转到登录页面
          await store.dispatch('user/resetToken')
          await store.dispatch('user/resetCodeAndAccount')
          await store.dispatch('user/resetUserId')
          Message.error(error || 'Has Error')
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token

    if (whiteList.indexOf(to.path) !== -1) {
      // 空的白名单，跳转到登陆
      next()
    } else {
      // 页面没有token，跳转回登陆页面
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})
