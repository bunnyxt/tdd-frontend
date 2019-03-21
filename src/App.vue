<template>
  <a-layout class="layout" style="min-height:100%">
    <Header/>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>首页</a-breadcrumb-item>
      </a-breadcrumb>
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
import Footer from "./components/Footer.vue";

export default {
  name: "app",
  components: {
    Header,
    Home,
    SprintHome,
    Footer
  }
};
</script>

<style>
.fake-footer{
  height: 120px
}
</style>
