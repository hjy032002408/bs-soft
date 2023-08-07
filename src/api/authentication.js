import request from '@/utils/request'
/**
 * 前端发起登录请求的时候调用此接口 此接口在/store/moudle/user.js 中发起调用
 * @param {*} data 登录数据 包含 工号，密码，租户账号
 * @returns
 */
export function login(data) {
  return request({
    url: '/v1/user/login',
    method: 'get',
    params: data
  })
}

/**
 * 前端 登录认证成功后 进入 主控制台的时候 在permission.js 的router拦截器中发起 用户信息获取的调用，
 * @param {*} data 这些信息包含了 *角色和资源列表，用户基本信息，header中已经是携带token
 * @returns
 */
export function getInfo(data) {
  return request({
    url: '/v1/user/info',
    method: 'get',
    params: data
  })
}

/**
 * 通知后端用户登录做相应前后端的状态清除包括前端store后端token等
 * @param {*} data  用户基本信息
 * @returns
 */
export function logout(data) {
  return request({
    url: '/v1/user/logout',
    method: 'get',
    params: data
  })
}
