/**
 * 面包屑
 * 侧边栏菜单格式：子节点，父节点判断
 */
import router from '@/router'
import { constantRoutes } from '@/router'

/**
 * 系统所支持的所有的页面组件都这里定义，
 * 根据后端所返回的角色对应的资源的 url 去匹配取得相应的 页面
 * 该模式采用预定义的模式，如果需要进一步改进也可以不定义该数组，完全由后端配置生成数组
 * 此预定义简单模式
 */
export const components = {
  '@/layout': () => import('@/layout'),
  '@/views/bg/role/index': () => import('@/views/bg/role/index')
}

function sortByCodeFun(resourceA, resourceB) {
  // 按code升序
  return resourceA.orderIndex - resourceB.orderIndex
}

export function getMenus(resources, parent) {
  // parent 为null 时默认根节点，api需要/开头,
  if (resources === undefined || resources === null) {
    // resources空或者未定义(用户中心会将null内容移除，此时resources可能为undefined)
    resources = []
  } else {
    // 使用resource的orderIndex对其排序，优化显示顺序
    resources.sort(sortByCodeFun)
  }

  // 若是根节点，初始化parent为空数组，赋值给newParent
  // const newParent = parent === null || parent === [] ? [] : parent
  let newParent
  if (parent === null || parent === []) newParent = []
  else newParent = parent
  for (let i = 0; i < resources.length; i++) {
    // 循环查找当前item的所有菜单资源
    const item = resources[i]
    if (item.resourceType === 1) {
      // resourceType：0 => 菜单; 1 => 按钮，过滤按钮
      continue
    }

    let route = null
    if (parent !== undefined && parent != null) {
      // 若非根节点，其必须依附父节点，将其push进children
      if (newParent.children === undefined || newParent.children === null) {
        newParent.children = []
      }
      route = {
        // 路由路径，前端显示使用；例如：/resource
        path: item.api.replaceAll('/', ''),
        component: components[item.url], // 组件，使用resource的url通过已提前加载的components数组获取
        meta: {
          title: item.name, // 菜单标题
          icon: item.openImg // 菜单icon，使用icons/svg下的图标
        },
        children: []
      }

      // 通过递归调用获取item的子菜单，并push到newParent.children
      newParent.children.push(getMenus(item.resourceVOs, route))
    } else {
      // 根节点，无父级
      route = {
        path: item.api,
        component: components[item.url],
        name: item.name,
        meta: {
          title: item.name,
          icon: item.openImg
        },
        children: []
      }
      // 通过递归调用获取其与子菜单，并push到newParent
      newParent.push(getMenus(item.resourceVOs, route))
    }
  }
  // 返回当前菜单组
  return newParent
}

function itemInArray(item, array) {
  // 判断item是否在array数组中
  try {
    for (let i = 0; i < array.length; i++) {
      const value = array[i]
      if (value === item) {
        return true
      }
    }
  } catch (e) {
    console.log(e)
  }
  return false
}

function addOrUpdateRoutes(menus) {
  // 删除旧的
  const oldRoutePaths = [] // 旧的路由路径数组，因为退出登录时页面并未刷新，routes还存在之前用户的路由信息，我们需要删除他们，再做操作
  const defaultPaths = [] // 默认路由数组，router/index.js里面定义
  // 遍历顶层数组
  for (let i = 0; i < constantRoutes.length; i++) {
    const item = constantRoutes[i]
    // 添加到默认路径
    defaultPaths.push(item.path)
  }
  // 查找旧路由顶层的path
  for (let i = 0; i < router.options.routes.length; i++) {
    const path = router.options.routes[i].path
    // 将之前用户的菜单添加到数组
    if (!itemInArray(path, menus) && !itemInArray(path, defaultPaths)) {
      oldRoutePaths.push(path)
    }
  }
  // 遍历删除
  for (let i = 0; i < router.options.routes.length; i++) {
    const path = router.options.routes[i].path
    // 如果当前route的path在之前查找的旧路由里面则删除
    if (itemInArray(path, oldRoutePaths)) {
      router.options.routes.splice(i, 1)
    }
  }
  const dumplingPaths = []
  // 去重，通过双重循环更新路由，并且找出重复的菜单
  for (let i = 0; i < router.options.routes.length; i++) {
    const route = router.options.routes[i]
    for (let j = 0; j < menus.length; j++) {
      const menu = menus[j]
      if (menu.path === route.path) {
        router.options.routes[i] = menu
        dumplingPaths.push(menu.path)
      }
    }
  }
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i]
    // 新增路由
    if (!itemInArray(menu.path, dumplingPaths)) {
      router.options.routes.push(menu)
    }
  }
  // 加载资源，只是更新router.options.routes不会加载资源，所以再add一遍
  router.addRoutes(menus)
}

function addRoutesByResources(resources) {
  try {
    // console.log(router.options.routes)
    // console.log(resources)
    // 从资源列表递归获取菜单

    const menus = getMenus(resources, null)
    // console.log(menus)
    // 通过菜单新增、删除、更新路由
    addOrUpdateRoutes(menus)
  } catch (e) {
    console.log('动态加载路由出错')
    console.log(e)
  }
}

export default addRoutesByResources
