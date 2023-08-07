<!-- eslint-disable vue/multi-word-component-names -->
<!-- 滑块验证 -->
<template>
  <div class="Slider">
    <div class="Slider-item">
      <i
        class="el-icon-close"
        @click="closerSlider"
      />
      <slide-verify
        ref="slider"
        :l="42"
        :r="10"
        :w="310"
        :h="155"
        :imgs="picArray"
        slider-text="向右滑动完成验证"
        @success="onSuccess"
        @fail="onFail"
        @refresh="onRefresh"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Slider',
  data() {
    return {
      msg: '',
      // 在data中引入`assets`中的图片可以通过`require`的方式来引入
      // 窗口每关闭一次就刷新一次
      // math.random()返回0~1的数字,不包含1
      // math.round()返回一个四舍五入的数字
      // math.floor()向下取整
      // 两种随机获取图片的方法
      // picArray:[require('../../assets/SliderImages/slider (' + Math.round(Math.random() * 72) + ').jpg')]
      picArray: [require('../../assets/SliderImages/slider (' + Math.floor(Math.random() * (72 - 1 + 1) + 1) + ').jpg')]
    }
  },
  methods: {
    /**
     * 调用父组件传递过来的验证通过的回调函数
     */
    onSuccess() {
      this.$emit('sliderSuccess')
    },
    onFail() {
      this.msg = ''
    },
    /**
     * 重置图片验证组件
     */
    onReset() {
      this.$refs.slider.reset()
    },
    /**
     * 点击了刷新小图标
     */
    onRefresh() {
      // console.log('点击了刷新小图标')
      this.msg = ''
    },
    /**
     * 点击关闭图标
     */
    closerSlider() {
      // 子组件调用父组件函数
      // 1.@closerSlider="closerSlider"
      // 2. 子组件中调用 this.$emit('closerSlider')
      this.$emit('closerSlider')
    }
  }
}
</script>
<style lang="scss" scoped>
.Slider {
  position: absolute;
  width: 100%;
  height: 100vh;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.1);
  color: white;
  z-index: 1;
}
.Slider-item {
  position: relative;
  z-index: 999; /* 设置元素的z-index值为999，越大越靠上 */
  width: 310px;
  height: 240px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 20px 20px 20px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  i {
    display: inline-block;
    position: relative;
    left: 300px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
</style>
