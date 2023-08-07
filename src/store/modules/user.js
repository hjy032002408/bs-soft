import { login, getInfo, logout } from '@/api/authentication'
import {
  getToken, setToken, removeToken,
  getCode, setCode, removeCode,
  getAccount, setAccount, removeAccount,
  getUserId, setUserId, removeUserId } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    code: getCode(),
    account: getAccount(),
    token: getToken(),
    name: '',
    avatar: '',
    resources: [],
    hassetroutes: false,
    tenantId: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // token一定要存在storage缓存中，
  // 否则刷新一下，store会重新被加载，token就没了
  // 修改token，并将token存入localStorage
  SET_CODE: (state, code) => {
    state.code = code
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_RESOURCES: (state, resources) => {
    state.resources = resources
  },
  SET_TENANTID: (state, tenantId) => {
    state.tenantId = tenantId
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { code, account, password } = userInfo

    return new Promise((resolve, reject) => {
      // trim()去除字符串的头尾空格:
      login({ code: code, account: account.trim(), password: password })
        .then((response) => {
          const { data } = response
          if (!data.token) {
            reject()
          }
          // 通过commit('SET_TOKEN', data.token)来进行调用此函数并传参，
          // 才能在store存储成功
          commit('SET_TOKEN', data.token)
          commit('SET_CODE', code)
          commit('SET_ACCOUNT', account)
          commit('SET_USERID', response.id)
          setUserId(response.id)
          setToken(data.token)
          setCode(code)
          setAccount(account)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // 获取角色资源
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({ code: state.code, account: state.account })
        .then((response) => {
          const { data, tenantId } = response

          if (!data) {
            return reject('用户没有权限请联系管理员授权!')
          }

          const { name, avatar } = data

          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_TENANTID', tenantId)
          if (data.resourceVO === undefined || data.resourceVO === null) {
            commit('SET_RESOURCES', [])
          } else {
            // const resourceVOs = []
            data.resourceVO.map((item) => {
              if (item.api.includes('CENTRESYSTEM')) {
                commit('SET_RESOURCES', item.resourceVOs)
              }
            })
          }
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // 退出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({ id: getUserId })
        .then(() => {
          removeToken()
          removeUserId()
          resetRouter()
          commit('RESET_STATE')
          resolve()
        }).catch(error => {
          reject(error)
        })
    })
  },

  // 移除 token
  resetToken({ commit }) {
    return new Promise(resolve => {
      // 必须首先移除token
      removeToken()
      commit('RESET_STATE')
      resolve()
    })
  },
  resetCodeAndAccount({ commit }) {
    return new Promise((resolve) => {
      removeCode()
      removeAccount()
      commit('RESET_STATE')
      resolve
    })
  },
  resetUserId({ commit }) {
    return new Promise((resolve) => {
      removeUserId()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

