<template>
  <a-layout-footer class="tdd-footer">
    天钿Daily by
    <a href="https://www.bunnyxt.com" target="_blank">bunnyxt</a><br/>
    <a href="https://api.bunnyxt.com/tdd/doc" target="_blank">接口文档</a> |
    <a href="https://github.com/users/bunnyxt/projects/1" target="_blank">项目源码</a> |
    <a href="https://afdian.net/@bunnyxt" target="_blank">资助本站</a> |
    <router-link to="/about/contactus">联系我们</router-link>
    <br/>
    2017~2020 © All Rights Reserved<br/>
    <a href="http://www.beian.miit.gov.cn/publish/query/indexFirst.action" target="_blank">苏ICP备17067742号-1</a>
  </a-layout-footer>
</template>

<script>
export default {
  name: "TddFooter"
};
</script>

<style scoped>
.tdd-footer {
  text-align: center;
  height: 120px;
  font-size: 12px;
  padding: 24px 20px;
}
a {
  color: rgba(0, 0, 0, 0.65);
}
</style>
