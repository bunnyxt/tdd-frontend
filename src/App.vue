<template>
  <a-locale-provider :locale="locale">
    <a-layout class="layout" style="min-height:100%">
      <Slider/>
      <a-layout>
        <a-layout-content :style="{padding: layoutPadding}">
          <router-view></router-view>
        </a-layout-content>
        <div class="fake-footer"></div>
        <Footer/>
      </a-layout>
    </a-layout>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import Slider from "./components/Slider.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "app",
  components: {
    Slider,
    Footer
  },
  data: function() {
    return {
      locale: zhCN,
      headerPadding: '0 30px',
      layoutPadding: '0 50px'
    }
  },
  mounted: function(){
    if (document.body.clientWidth <= 768){
      this.headerPadding = '0'
      this.layoutPadding = '0 20px'
    } else {
      this.headerPadding = '0 30px'
      this.layoutPadding = '0 50px'
    }
    var that = this;
    window.addEventListener('resize',() => {
      if (document.body.clientWidth <= 768){
        that.headerPadding = '0'
        that.layoutPadding = '0 20px'
      } else {
        that.headerPadding = '0 30px'
        that.layoutPadding = '0 50px'
      }
    },false);
  }
};
</script>

<style>
.fake-footer{
  height: 120px
}
.section-seperator {
  height: 24px;
}
.section-block {
  background: #fff;
  padding: 24px
}
</style>
