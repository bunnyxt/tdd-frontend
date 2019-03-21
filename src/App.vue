<template>
  <a-layout class="layout">
    <Header/>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>首页</a-breadcrumb-item>
      </a-breadcrumb>
      <div
        class="section-block"
        :style="{ background: '#fff', padding: '24px', minHeight: '280px' }"
      >
        <h1>传送门</h1>
        <ul>
          <li>
            <a href="/sprint/">传说助攻</a>：VC传说冲刺曲目助攻计划
          </li>
          <li>开发中...</li>
        </ul>
      </div>
    </a-layout-content>
    <Footer/>
  </a-layout>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "app",
  components: {
    Header,
    Footer
  }
};
</script>

<style>
#components-layout-demo-top .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}
</style>
