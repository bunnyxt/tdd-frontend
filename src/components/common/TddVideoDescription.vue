<template>
  <div style="position: relative">
    <div ref="text" :style="textStyle">
      <span v-html="descriptionHtml"></span>
    </div>
    <div class="show-all" v-if="!showAll && textHeight > 100" @click="() => this.showAll = true">
      显示全部
    </div>
    <div class="show-all-mask" v-if="!showAll && textHeight > 100"></div>
  </div>
</template>

<script>
  export default {
    name: 'TddVideoDescription',
    props: {
      description: {
        type: String,
        required: true
      }
    },
    data: function () {
      return {
        textHeight: 0,
        showAll: false
      }
    },
    watch: {
      description: function () {
        this.textHeight = this.$refs.text.clientHeight;
        this.showAll = false;
      }
    },
    computed: {
      descriptionHtml: function () {
        let html = this.description.replace(/\n/g, '<br>');
        html = html.replace(/av([0-9]+)/g, '<a href="https://www.bilibili.com/video/av$1" target="_blank">av$1</a>');
        return html;
      },
      textStyle: function () {
        let style = {};
        style.overflow = 'hidden';
        if (this.textHeight > 100 && !this.showAll) {
          style.height = '100px';
        }
        return style;
      }
    },
    mounted() {
      let that = this;
      that.textHeight = that.$refs.text.clientHeight;
      // TODO bind textHeight to height of text
      // window.addEventListener('resize', () => {
      //   that.textHeight = that.$refs.text.clientHeight;
      // });
    }
  }
</script>

<style scoped>
  .show-all {
    z-index: 2;
    position: absolute;
    cursor: pointer;
    height: 50px;
    top: 50px;
    width: 100%;
    line-height: 70px;
    text-align: center;
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(232, 232, 232, 0.65));
  }
  .show-all-mask {
    z-index: 1;
    position: absolute;
    height: 50px;
    top: 50px;
    width: 100%;
    line-height: 70px;
    text-align: center;
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
  }
</style>