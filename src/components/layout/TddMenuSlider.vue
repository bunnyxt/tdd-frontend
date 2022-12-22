<i18n src="@/i18n/common.json"></i18n>

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
        <a-menu-item key="home">{{ $t('page_name.home') }}</a-menu-item>
        <a-menu-item key="video">{{ $t('page_name.video') }}</a-menu-item>
        <a-menu-item key="member">{{ $t('page_name.member') }}</a-menu-item>
        <a-menu-item key="rank">{{ $t('page_name.rank') }}</a-menu-item>
        <a-menu-item key="sprint">{{ $t('page_name.sprint') }}</a-menu-item>
        <a-menu-item key="tool">{{ $t('page_name.tool') }}</a-menu-item>
        <a-menu-item key="about">{{ $t('page_name.about') }}</a-menu-item>
      </a-menu>
    </div>
    <div class="bottom-wrapper">
      <global-outlined @click="handleLanguageButtonClick" />
    </div>
  </a-drawer>
</template>

<script>
import { GlobalOutlined } from '@ant-design/icons-vue';

export default {
  name: "TddMenuSlider",
  components: {
    GlobalOutlined,
  },
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
    },
    handleLanguageButtonClick: function () {
      this.$emit('toggle-language-banner-visibility');
    },
  }
};
</script>

<style scoped>
.ant-drawer-body {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.menu-wrapper {
  margin-left: -24px;
  flex-grow: 1;
}
.bottom-wrapper {
  height: 64px;
  line-height: 64px;
  margin-bottom: -24px;
}
</style>
