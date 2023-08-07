import request from '@/utils/request'

const ROLE_URL = '/v1/role'
/**
 * 添加用户
 * @param {*} RoleDTO
 * @returns
 */
export function add(RoleDTO) {
  return request({
    url: ROLE_URL,
    method: 'post',
    data: RoleDTO
  })
}

/**
 * 单行删除
 * @param {*} id
 * @param {*} version
 * @returns
 */
export function remove(id, version) {
  return request({
    url: ROLE_URL,
    method: 'delete',
    params: { id: id, version: version }
  })
}

/**
 * 批量删除
 * @param {*} RoleDTOs
 * @returns
 */
export function batchRemove(RoleDTOs) {
  return request({
    url: ROLE_URL + '/batch',
    method: 'delete',
    data: RoleDTOs
  })
}

/**
 * 修改
 * @param {*} data
 * @returns
 */
export function modify(data) {
  return request({
    url: ROLE_URL,
    method: 'put',
    data
  })
}

/**
 * 复制
 * @param {*} id
 * @returns
 */
export function copy(id) {
  return request({
    url: ROLE_URL + '/copy',
    method: 'post',
    data: { id: id }
  })
}

export function commonQuery(RoleQuery) {
  return request({
    url: ROLE_URL,
    method: 'get',
    params: RoleQuery
  })
}

export function commonQueryUser(userQuery) {
  return request({
    url: ROLE_URL + '/commonQueryUser',
    method: 'get',
    params: userQuery
  })
}

export function assignUser(userRoleDTO) {
  return request({
    url: ROLE_URL + '/assignUser',
    method: 'post',
    data: userRoleDTO
  })
}

export function assignResource(roleResourceDTO) {
  return request({
    url: ROLE_URL + '/assignResource',
    method: 'post',
    data: roleResourceDTO
  })
}

export function selectCompany() {
  return request({
    url: ROLE_URL + '/selectCompany',
    method: 'get'
  })
}

