<i18n src="@/i18n/common.json"></i18n>

<template>
  <div>
    <template v-if="this.$store.getters.clientMode === 'MOBILE'">
      <div :style="{ position: 'fixed', zIndex: 30, width: '100%' }">
        <tdd-language-select-banner ref="banner" /><!-- bug: will lead to cover some content -->
        <a-layout-header class="mobile-header">
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
          <button
            class="mobile-header-user-avatar"
            type="button"
            :aria-label="$t('login')"
            @click="showUserNotice = true"
          ><a-icon type="user" /></button>
        </a-layout-header>
      </div>
    </template>
    <template v-else>
      <tdd-language-select-banner ref="banner" />
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
        >
          <a-menu-item key="home">
            <router-link to="/">{{ $t('page_name.home') }}</router-link>
          </a-menu-item>
          <a-menu-item key="video">
            <router-link to="/video">{{ $t('page_name.video') }}</router-link>
          </a-menu-item>
          <a-menu-item key="member">
            <router-link to="/member">{{ $t('page_name.member') }}</router-link>
          </a-menu-item>
          <a-menu-item key="sprint">
            <router-link to="/sprint">{{ $t('page_name.sprint') }}</router-link>
          </a-menu-item>
          <a-menu-item key="tool">
            <router-link to="/tool">{{ $t('page_name.tool') }}</router-link>
          </a-menu-item>
          <a-menu-item key="about">
            <router-link to="/about">{{ $t('page_name.about') }}</router-link>
          </a-menu-item>
          <a-menu-item key="language" @click="handleLanguageButtonClick">
            <a-icon type="global" />
          </a-menu-item>
        </a-menu>
        <a-button
          class="desktop-header-login-button"
          ghost
          @click="showUserNotice = true"
        >
          {{ $t('login') }}
        </a-button>
      </a-layout-header>
    </template>
    <a-modal
      v-model="showUserNotice"
      :title="$t('user_system_notice_title')"
      :footer="null"
    >
      <p>{{ $t('user_system_notice_body') }}</p>
      <p>{{ $t('user_system_notice_contact') }}</p>
    </a-modal>
  </div>
</template>

<script>
import logo_small from '../../assets/img/logo_32S.png'
import TddLanguageSelectBanner from "@/components/layout/TddLanguageSelectBanner";

export default {
  name: 'TddHeader',
  components: {
    TddLanguageSelectBanner,
  },
  data: function () {
    return {
      logo_small: logo_small,
      showUserNotice: false
    }
  },
  computed: {
    layoutPadding: function () {
      return this.$util.calcLayoutPadding(this.$store.state.clientWidth);
    },
    selectedKeys: function () {
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
    },
  },
  methods: {
    handleLanguageButtonClick: function () {
      this.$refs.banner.showI18nLocaleSelect = !this.$refs.banner.showI18nLocaleSelect;  // bad design
    },
  },
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
  padding: 0;
  border: 0;
  background: transparent;
  float: right;
  color: #fff;
  width: 24px;
  height: 24px;
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
