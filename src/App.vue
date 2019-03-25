<template>
  <a-layout class="layout" style="min-height:100%">
    <Header :headerPadding="headerPadding"/>
    <a-layout-content :style="{padding: layoutPadding}">
      <router-view></router-view>
    </a-layout-content>
    <div class="fake-footer"></div>
    <Footer/>
  </a-layout>
</template>

<script>
import Header from "./components/Header.vue";
import Home from "./components/Home.vue";
import SprintHome from "./components/SprintHome.vue";
import SprintVideoDetail from "./components/SprintVideoDetail.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "app",
  components: {
    Header,
    Home,
    SprintHome,
    SprintVideoDetail,
    Footer
  },
  data: function() {
    return {
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
</style>
