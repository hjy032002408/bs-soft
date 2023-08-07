<!-- 先请求login，并在permission中请求用户资源 -->
<!-- 用户登录 -->
<template>
  <div class="container">
    <div class="titleInfo">
      <img
        class="sdLogo"
        src="../../assets/404_images/sdLogo.png"
        width="300"
        alt=""
      >
      <div class="titleName">{{ systemName }}</div>
      <div class="operation">
        <a class="operaInfo">设为首页</a> |
        <a
          class="operaInfo"
          @click="CreateShortcut"
        >收藏</a>
      </div>
    </div>
    <div class="login-container">
      <!-- 滑块验证 -->
      <!-- 绑定事件 -->
      <!-- 1. 验证成功 -->
      <!-- 2. 关闭验证 -->
      <Slider
        v-if="isShowSlider"
        @sliderSuccess="sliderSuccess"
        @closerSlider="closerSlider"
      />
      <el-form class="companyInfo-container">
        <!-- <img src="../../assets/404_image/sybg.jpg" alt=""> -->
      </el-form>
      <el-form
        ref="loginForm"
        :rules="loginRules"
        :model="loginForm"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="chooseLoginItem">账号登录</div>
        <el-form-item prop="code">
          <el-input
            ref="code"
            v-model="loginForm.code"
            placeholder="请输入工号"
            name="code"
            type="text"
            tabindex="1"
            auto-complete="on"
            prefix-icon="el-icon-user-solid"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            ref="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            name="password"
            type="password"
            tabindex="2"
            auto-complete="on"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>
        <el-form-item prop="account">
          <el-input
            ref="account"
            v-model="loginForm.account"
            placeholder="租户id"
            name="account"
            type="text"
            tabindex="3"
            auto-complete="on"
            prefix-icon="el-icon-user-solid"
          />
        </el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="isShowSliderChange"
        >登录</el-button>
      </el-form>
    </div>
    <div class="webInfo">
      <div class="info-container">
        <div class="beian">博思软件（股票代码：300525）</div>
        <div class="support">CopyRight &copy; 2021-2031 博思软件股份有限公司</div>
        <div class="suggest">浏览器：
          <a
            target="_blank"
            href="https://www.google.cn/intl/zh-CN/chrome/"
          > chrome90/</a>
          <a
            target="_blank"
            href="https://www.microsoft.com/en-us/edge"
          > IE10 </a>以上 | 分辨率建议1024*1960
        </div>
      </div>
      <img
        src="../../assets/404_images/sd365Code.png"
        alt="sdCode"
        class="sdCode"
        width="80px"
      >
    </div>
  </div>
</template>

<script>
// 引入滑块验证子组件
import Slider from '@/views/login/Slide.vue'
// 局部引入弹窗
import { Message } from 'element-ui'
export default {
  name: 'Login',
  components: {
    Slider
  },
  data() {
    return {
      // 登录界面输入内容
      loginForm: {
        code: '',
        password: '',
        account: ''
      },
      // 登录界面表单校验规则
      loginRules: {
        code: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入密码'
          },
          {
            min: 6,
            message: '密码不能少于6位',
            trigger: 'blur'
          }
        ],
        account: [{ required: true, message: '租户id不能为空', trigger: 'blur' }]
      },
      systemName: '用户中心用户身份验证 v1.1.0-optimize', // 系统名称
      loading: false,
      redirect: undefined,
      isShowSlider: false
    }
  },
  methods: {
    /**
     * 点击收藏
     */
    CreateShortcut() {
      // alert用于显示带有一条指定消息和一个“确认”按钮的警告框；
      var fav_url = window.location.host
      var fav_title = document.title
      if (document.all && window.external) {
        window.external.AddFavorite(fav_url, fav_title)
      } else if (window.sidebar) {
        window.sidebar.addPanel(fav_title, fav_url, '')
      } else {
        alert('浏览器不支持，请按：快捷键Ctrl+D收藏为书签')
      }
      // 读取前端所用端口号
      // url=window.location.host;
      // this.$notify({
      //     title: url+"显示",
      //     message:"快捷键Ctrl+D收藏为书签",
      //     showClose: false,
      //   });
    },
    /**
     * 显示滑块验证
     */
    isShowSliderChange() {
      this.isShowSlider = true
      // console.log(this.isShowSlider);
    },
    /**
     * 关闭验证
     */
    closerSlider() {
      this.isShowSlider = false
    },
    /**
     * 验证成功
     */
    sliderSuccess() {
      var that = this
      /**
       * 定时器
       * setTimeout(function() {
			 *      // 需要执行的代码
       * }, 500); // 定时时间
       */
      // 验证结果传到后端失败
      setTimeout(function() {
        that.isShowSlider = false
      }, 1000)
      this.handleLogin()
    },
    /**
     * 请求后端登录接口并验证
     */
    handleLogin() {
      // Vue.validate()是Vue.js 提供的表单验证方法
      // 高级用法：规则自定义、多规则使用
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          // 调取store里的user.js的login方法，从而要更新
          this.$store
            .dispatch('user/login', this.loginForm)
            .then((res) => {
              if (res.code === 200) {
                Message({
                  // 消息文字
                  message: res.msg,
                  type: 'success',
                  // 显示时间, 毫秒
                  duration: 5 * 1000
                })
                // 跳转到首页
                this.$router.push({ path: this.redirect || '/' })
              } else {
                Message({
                  message: res.msg || 'error code : ;' || res.code,
                  type: 'error',
                  duration: 5 * 1000
                })
              }
              this.loading = false
            })
            .catch(() => {
              Message({
                message: '信息错误',
                type: 'error',
                duration: 5 * 1000
              })
              this.loading = false
            })
        } else {
          Message({
            message: '表单字段违反校验规则为空或者不满足格式等',
            type: 'error',
            duration: 5 * 1000
          })
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.el-input__inner {
  height: 58px;
}
.el-button {
  width: 100%;
}
body {
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  overflow: hidden;
}
.hide {
  opacity: 0;
}
</style>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  .titleInfo {
    width: 100%;
    height: 8%;
    margin-top: 10px;
    .sdLogo {
      vertical-align: middle;
    }
    .titleName {
      font-size: 20px;
      font-weight:bold;
      display: inline-block;
      margin-top: 20px;
      margin-left: 15px;
    }
    .operation {
      position: absolute;
      right: 10px;
      top: 20px;
      .operaInfo:hover {
        color: #409eff;
      }
    }
  }
  .login-container {
    width: 100%;
    height: 81%;
    background-size: 100% 100%;
    background: url('../../assets/404_images/bsbg.jpg');
    .login-form {
      background-color: #ffff;
      position: absolute;
      width: 520px;
      height: 400px;
      box-sizing: border-box;
      padding: 20px 35px 0;
      top: 0;
      bottom: 0;
      left: -75px;
      right: 0;
      margin: auto;
      border-radius: 1em;
      .chooseLoginItem {
        height: 10%;
      }
    }
  }
  .webInfo {
    background-color: #e4e7ed;
    height: 18%;
    .info-container {
      width: 100%;
      height: 15%;
      position: relative;
      text-align: center;
      font-size: 13px;
      a {
        color: #fd1112;
        text-decoration: none;
      }
      .beian {
        color: #687f7f;
        padding: 5px;
      }

      .support {
        color: #687f7f;
        padding: 5px;
      }
      .suggest {
        font-size: 14px;
        color: #fd1112;
        padding: 5px;
      }
    }
    .sdCode {
      position: absolute;
      bottom: 15px;
      right: 30px;
    }
  }
}
</style>
