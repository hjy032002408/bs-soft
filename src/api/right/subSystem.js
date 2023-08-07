import request from '@/utils/request'

const SUBSYSTEM_URL = '/subsystem'
// 成功则true CommonResponse 应答码和消息统一参考基础框架

export function add(subSystemDTO) {
  return request({
    url: SUBSYSTEM_URL,
    method: 'post',
    data: subSystemDTO
  })
}

export function remove(id, version) {
  return request({
    url: SUBSYSTEM_URL,
    params: { id: id, version: version },
    method: 'delete'
  })
}

export function batchRemove(subSystemDTOS) {
  return request({
    url: SUBSYSTEM_URL + '/batch',
    data: subSystemDTOS,
    method: 'delete'
  })
}

export function modify(subSystemDTO) {
  return request({
    url: SUBSYSTEM_URL,
    method: 'put',
    params: subSystemDTO
  })
}

export function commonQuery(subSystemQuery) {
  return request({
    url: SUBSYSTEM_URL,
    method: 'get',
    params: subSystemQuery
  })
}

export function tenantQuery() {
  return request({
    url: SUBSYSTEM_URL + '/tenant',
    method: 'get'
  })
}

export function querySubSystemById(id) {
  return request({
    url: SUBSYSTEM_URL + '/' + id,
    method: 'get'
  })
}

export function querySubSystemByTenantId(tenantId) {
  return request({
    url: SUBSYSTEM_URL + '/tenantId',
    method: 'get',
    params: { tenantId: tenantId }
  })
}

