<template>
  <a-layout-header>
    <div style="float:left; margin: 0px 20px">
      <a @click="handleLogoClick">
        <img src="logo_32S.png">
      </a>
    </div>
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
    handleLogoClick() {
      this.$router.push("/");
    },
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
</style>