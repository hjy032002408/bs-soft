import VueRouter from 'vue-router'
import Vue from 'vue'
// import login from '../view/login/index.vue'

Vue.use(VueRouter)
// 全局引入布局
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    // import 是一种懒加载模式
    component: () => import('@/views/login/index')
    // component:login
    // hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: '仪表盘',
        component: () => import('@/views/dashboard/index'),
        // meta:每个路由身上携带的信息
        meta: { title: '仪表盘', icon: '123456' }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        name: '仪表盘',
        component: () => import('@/views/dashboard/index'),
        // meta:每个路由身上携带的信息
        meta: { title: '仪表盘', icon: '123456' }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    component: () => '@/view/404',
    hidden: true
  }
]
const createRouter = () =>
  new VueRouter({
    // 可以实现路由跳转之后滚动条滚到顶部
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
export default router
