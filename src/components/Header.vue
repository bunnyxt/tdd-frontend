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
          // todo
          break;
        case "2":
          // todo
          break;
        default:
          break;
      }
    }
  }
};
</script>
