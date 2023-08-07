import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import { MessageBox } from 'element-ui'

import store from '@/store'
import { getToken } from '@/utils/auth'

const BUSINESS_CODE_SUCCESS = '0'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // debugger
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['accessToken'] = getToken()
    }

    // 判断请求的类型：如果是post请求就把默认参数拼到data里面；
    if (config.method === 'post') {
      try {
        // 这里租户、机构、公司id全都是写死的
        config.data.tenantId = '1337940702788714496'
        config.data.orgId = '1337955940401545216'
        config.data.companyId = '1337960193258029056'
        // config.data.administrativeId = '1337960193258029076'
        config.data.createdBy = 1
        // console.log(config.data)
      } catch (e) {
        console.log('自动注入字段错误')
        console.log(e)
      }
    }
    // 如果是get请求就拼到params里面
    if (config.method === 'get') {
      try {
        // 这里租户、机构、公司id全都是写死的
        config.params.tenantId = '1337940702788714496'
        config.params.orgId = '1337955940401545216'
        config.params.companyId = '1337960193258029056'
        // config.data.administrativeId = '1337960193258029076'
        config.params.createdBy = 1
        // console.log(config.data)
      } catch (e) {
        console.log('自动注入字段错误')
        console.log(e)
      }
    }

    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    /** 取得后端统一应答CommonResponse 其中包含Head 和  body ,head包含code,message body就是具体的业务数据
     *  CommonResponse{head:{code,mesage,flag,version},body:{controller返回的数据}}
     *  以登录为例
     *  CommonResponse{head:{默认填写 },body:{UserVO:{code,mesage,其他字段数据}}}
     *  提示:commonResponse 定义在项目基础包 公共报文中
     **/

    const commonResponse = response.data // response.data 就是CommonResponse
    console.debug(commonResponse)
    // if the custom code is not 20000, it is judged as an error.
    if (commonResponse.head.code !== BUSINESS_CODE_SUCCESS) {
      // Message({
      //   message:
      //     commonResponse.head.message ||
      //     '   error code :' ||
      //     commonResponse.head.code,
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (
        commonResponse.head.code &&
        (commonResponse.head.code === '50008' ||
          commonResponse.head.code === '50012' ||
          commonResponse.head.code === '50014')
      ) {
        // to re-login
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(
        new Error(
          commonResponse.head.message || '   Error ' || commonResponse.head.code
        )
      )
    } else {
      console.log('response', commonResponse.body)
      return commonResponse.body
    }
  },
  (error) => {
    console.log('err', error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
