<!-- 仪表盘 -->
<template>
  <div class="dashboard-container">
    <div class="dashboard-text" />
  </div>
</template>

<script>
import { getUserId, removeUserId, removeToken, removeCode, removeAccount } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      socket: undefined,
      MAX_CONNECT: 10 * 1000,
      wsHeartflag: false,
      reconnectTime: 0
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    // treeQueryDepartment().then(res => {
    //   debugger
    // })
  },
  created() {
    // 创建组件的时候调用
    this.newWebSocket()
  },
  methods: {
    newWebSocket() {
      if ('WebSocket' in window) {
        if (getUserId()) {
          const url = `${process.env.VUE_APP_WEBSOCKET_API}/v1/websocket/${getUserId()}`
          //  给socket赋值
          this.socket = new WebSocket(url)
          // 保存他的4个方法
          this.socket.onmessage = this.onMessage
          this.socket.onopen = this.onOpen
          this.socket.onerror = this.onError
          this.socket.onclose = this.onClose
        }
      }
    },
    onOpen() {
      if (this.socket.readyState === 1) {
        // - readyState 等于1 的时候建立链接成功
        this.wsHeartflag = true
        this.reconnectTime = 0
      }
    },
    timingHeart() {
      // 心跳检测
      if (this.wsHeartflag) {
        this.socket.send('ping')
      }
      this.wsHeart = setTimeout(() => {
        this.timingHeart()
      }, 100 * 1000) // 100s心跳
    },
    onMessage(evt) {
      // console.log(evt)
      if (evt.data) {
        var serverMessage = JSON.parse(evt.data)
        if (serverMessage.code === 0) {
          this.$alert(serverMessage.message, '提示', {
            type: 'warning',
            confirmButtonText: '确定'
          }).then(() => {
            removeUserId()
            removeAccount()
            removeToken()
            removeCode()
            location.reload()
          })
        }
      }
    },
    onError() {
      // 链接失败，进行重连
      clearTimeout(this.wsHeart)
      this.wsHeartflag = false
      if (this.reconnectTime <= this.MAX_CONNECT) {
        setTimeout(() => {
          this.onOpen()
          this.reconnectTime += 1
        }, 10 * 1000)
      } else {
        this.$message.error('抱歉，暂时无法连接到服务器，请稍后再试')
        this.onClose()
      }
    },
    onClose() {
      this.wsHeartflag = false
      this.socket && this.socket.close && this.socket.close()
    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    //背景图片
    // no-repeat:背景图不被重复
    background: url('../../assets/404_images/0123.jpg') no-repeat;
    background-position: 100%;
    width: 100%;
    height: 100vh;
    background-size: 100%;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
