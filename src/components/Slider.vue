<template>
  <a-layout-sider
      breakpoint="xl"
      collapsedWidth="0"
      width="180px"
  >
    <div style="margin: 24px 0px 12px 24px">
      <a href="/">
        <img src="/logo_32S.png">
      </a>
      <span class="logo-name">
        天钿Daily
      </span>
    </div>
    <a-menu
      theme="dark"
      mode="inline"
      :style="{ lineHeight: '64px' }"
      @click="handleMenuClick"
    >
      <a-menu-item key="1">首页</a-menu-item>
      <a-menu-item key="2">所有视频</a-menu-item>
      <a-menu-item key="3">传说助攻</a-menu-item>
      <a-menu-item key="4">辅助工具</a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
export default {
  name: "Slider",
  props: {

  },
  methods: {
    handleMenuClick(e) {
      switch (e.key) {
        case "1":
          this.$router.push("/");
          break;
        case "2":
          this.$router.push("/video");
          break;
        case "3":
          this.$router.push("/sprint");
          break;
        case "4":
          this.$router.push("/tool");
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style>
  .ant-menu.ant-menu-dark .ant-menu-item-selected {
     background-color: #001529;
   }
  .logo-name {
    color: rgba(255, 255, 255, 0.65);
    margin-left: 12px;
    font-size: 18px
  }
</style>