import request from '@/utils/request'

// 资源管理模块的相对路径
const RESOURCE_URL = '/resource'

/**
 * 初始化使调用此方法加载系统的树
 * @param {*} ResourceQuery
 * @returns
 */
export function treeQuery(ResourceQuery) {
  return request({
    url: RESOURCE_URL + '/tree',
    method: 'get',
    params: ResourceQuery
  })
}
