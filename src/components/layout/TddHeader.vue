<template>
  <div v-if="this.$store.getters.clientMode === 'MOBILE'">
    <a-layout-header
        class="mobile-header"
        :style="{ position: 'fixed', zIndex: 30, width: '100%' }"
    >
      <a-icon
          class="trigger mobile-header-menu-icon"
          :type="this.$store.state.isMenuSliderVisible ? 'menu-fold' : 'menu-unfold'"
          @click="() => this.$store.commit('changeMenuSliderVisibility')"
      />
      <img
          class="mobile-header-logo"
          :src="logo_small"
          @click="() => this.$router.push('/')"
      />
      <div v-if="!this.$store.state.isUserLoggedIn">
        <a-icon
            class="mobile-header-user-avatar"
            type="user"
            @click="() => this.$store.commit('changeLoginSliderVisibility')"
        />
      </div>
      <div v-else>
        <a-avatar
            class="mobile-header-user-avatar"
            :size="24"
            icon="user"
            @click="openUserPanel()"
        />
      </div>
    </a-layout-header>
  </div>
  <div v-else>
    <a-layout-header :style="{padding: layoutPadding}">
      <img
          class="desktop-header-logo"
          :src="logo_small"
          @click="() => this.$router.push('/')"
      />
      <a-menu
          theme="dark"
          mode="horizontal"
          :selectedKeys="selectedKeys"
          :style="{ lineHeight: '64px', float: 'left' }"
          @click="handleMenuClick"
      >
        <a-menu-item key="home">首页</a-menu-item>
        <a-menu-item key="video">视频</a-menu-item>
        <a-menu-item key="member">UP主</a-menu-item>
        <a-menu-item key="sprint">传说助攻</a-menu-item>
        <a-menu-item key="tool">辅助工具</a-menu-item>
        <a-menu-item key="about">关于</a-menu-item>
      </a-menu>
      <div v-if="!this.$store.state.isUserLoggedIn">
        <a-button
            class="desktop-header-login-button"
            ghost
            @click="() => this.$store.commit('changeLoginSliderVisibility')"
        >
          登录
        </a-button>
      </div>
      <div v-else>
        <a-avatar
            class="mobile-header-user-avatar"
            :size="24"
            icon="user"
            @click="openUserPanel()"
        />
      </div>
    </a-layout-header>
  </div>
</template>

<script>
  import logo_small from '../../assets/img/logo_32S.png'
  export default {
    name: 'TddHeader',
    data: function () {
      return {
        logo_small: logo_small
      }
    },
    computed: {
      layoutPadding: function() {
        return this.$util.calcLayoutPadding(this.$store.state.clientWidth);
      },
      selectedKeys: function() {
        let path = this.$route.fullPath;
        let keys = [];
        if (path === '/') {
          keys = ['home'];
        } else if (path.startsWith('/video')) {
          keys = ['video'];
        } else if (path.startsWith('/member')) {
          keys = ['member'];
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
      openUserPanel: function () {
        // TODO
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
  }
</script>

<style scoped>
  .mobile-header {
    padding: 0;
  }
  .mobile-header-menu-icon {
    float: left;
    color: #fff;
    font-size: 24px;
    margin-left: 20px;
    margin-top: 20px;
    cursor: pointer;
  }
  .mobile-header-logo {
    position: absolute;
    left: calc(50% - 32px / 2);
    margin-top: 16px;
    cursor: pointer;
  }
  .mobile-header-user-avatar {
    float: right;
    color: #fff;
    font-size: 24px;
    margin-right: 20px;
    margin-top: 20px;
    cursor: pointer;
  }

  .desktop-header-logo {
    float: left;
    margin-top: 16px;
    margin-right: 12px;
    cursor: pointer;
  }
  .desktop-header-login-button {
    float: right;
    margin-top: 16px;
    color: rgba(255, 255, 255, 0.65);
    border-color: rgba(255, 255, 255, 0.65);
  }
  .ant-menu-item {
    padding: 0 12px;
  }
</style>
