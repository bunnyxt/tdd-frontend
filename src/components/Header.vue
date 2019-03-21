<template>
  <a-layout-header>
    <div class="logo"/>
    <a-menu
      theme="dark"
      mode="horizontal"
      :defaultSelectedKeys="['1']"
      :style="{ lineHeight: '64px' }"
      @click="handleMenuClick"
    >
      <a-menu-item key="1">首页</a-menu-item>
      <a-menu-item key="2">传说助攻</a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script>
export default {
  name: "Header",
  methods: {
    handleMenuClick(e) {
      switch (e.key) {
        case "1":
          this.$router.push("/");
          break;
        case "2":
          this.$router.push("/sprint");
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style>
.logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}
</style>