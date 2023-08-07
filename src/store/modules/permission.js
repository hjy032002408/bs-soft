import { constantRoutes } from '@/router'
import Layout from '@/layout'

/**
 * 静态路由懒加载
 * @param {*} view
 * @returns
 */
export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}.vue`], resolve)
}
/**
 * 把从后端查询的菜单数据拼装成路由格式的数据
 * 后端返回的菜单数据
 * @param {*} routes
 * @param {*} data
 * @returns
 */
export function generaMenu(routes, data) {
  data.forEach((item) => {
    const menu = {
      path: item.url,
      component: item.component === '#' ? Layout : loadView(item.component),
      hidden: item.status === 0, // 状态为0的隐藏
      redirect: item.redirect,
      children: [],
      name: item.code,
      meta: item.meta
    }

    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
  return routes
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // 拼接静态路由和动态路由
    state.routes = constantRoutes.concat(routes)
  }
}
export default {
  namespaced: true,
  state,
  mutations
}
