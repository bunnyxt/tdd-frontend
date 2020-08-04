<template>
  <a-drawer
      placement="left"
      :closable="false"
      :visible="this.$store.state.isMenuSliderVisible"
      width="200px"
      @close="drawerCloseHandler"
  >
    <div class="menu-wrapper">
      <a-menu
          theme="light"
          mode="inline"
          :style="{ lineHeight: '64px' }"
          :selectedKeys="selectedKeys"
          @click="handleMenuClick"
      >
        <a-menu-item key="home">首页</a-menu-item>
        <a-menu-item key="video">视频</a-menu-item>
        <a-menu-item key="member">UP主</a-menu-item>
        <a-menu-item key="rank">排行</a-menu-item>
        <a-menu-item key="sprint">传说助攻</a-menu-item>
        <a-menu-item key="tool">辅助工具</a-menu-item>
        <a-menu-item key="about">关于</a-menu-item>
      </a-menu>
    </div>
  </a-drawer>
</template>

<script>
export default {
  name: "TddMenuSlider",
  computed: {
    selectedKeys: function() {
      let path = this.$route.fullPath;
      let keys = [];
      if (path === '/') {
        keys = ['home'];
      } else if (path.startsWith('/video')) {
        keys = ['video'];
      } else if (path.startsWith('/member')) {
        keys = ['member'];
      } else if (path.startsWith('/rank')) {
        keys = ['rank'];
      } else if (path.startsWith('/sprint')) {
        keys = ['sprint'];
      } else if (path.startsWith('/tool')) {
        keys = ['tool'];
      } else if (path.startsWith('/about')) {
        keys = ['about'];
      }
      return keys;
    }
  },
  methods: {
    drawerCloseHandler: function() {
      this.$store.commit('changeMenuSliderVisibility');
    },
    handleMenuClick(e) {
      switch (e.key) {
        case "home":
          this.$router.push("/");
          break;
        case "video":
          this.$router.push("/video");
          break;
        case "member":
          this.$router.push("/member");
          break;
        case "rank":
          this.$router.push("/rank");
          break;
        case "sprint":
          this.$router.push("/sprint");
          break;
        case "tool":
          this.$router.push("/tool");
          break;
        case "about":
          this.$router.push("/about");
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style>
.menu-wrapper {
  margin-left: -24px;
}
</style>
