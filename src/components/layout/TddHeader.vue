<i18n>
{
  "zh": {
    "page_home_name": "首页",
    "page_video_name": "视频",
    "page_member_name": "UP主",
    "page_rank_name": "排行",
    "page_sprint_name": "传说助攻",
    "page_tool_name": "辅助工具",
    "page_about_name": "关于",
    "page_me_name": "个人中心",
    "page_me_setting_name": "设置",
    "login": "登录",
    "logout": "退出"
  },
  "en": {
    "page_home_name": "Home",
    "page_video_name": "Video",
    "page_member_name": "Uploader",
    "page_rank_name": "Rank",
    "page_sprint_name": "1M Sprint",
    "page_tool_name": "Tool",
    "page_about_name": "About",
    "page_me_name": "My Zone",
    "page_me_setting_name": "Setting",
    "login": "Login",
    "logout": "Logout"
  }
}
</i18n>

<template>
  <div>
    <template v-if="this.$store.getters.clientMode === 'MOBILE'">
      <div :style="{ position: 'fixed', zIndex: 30, width: '100%' }">
        <tdd-language-select-banner /><!-- bug: will lead to cover some content -->
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
          <div v-if="!this.$store.state.isUserLoggedIn">
            <a-icon
              class="mobile-header-user-avatar"
              type="user"
              @click="() => this.$store.commit('changeLoginSliderVisibility')"
            />
          </div>
          <div v-else>
            <a-dropdown key="mobile">
              <a-avatar
                class="mobile-header-user-avatar"
                :src="$util.httpS(avatarUrl)"
              />
              <a-menu slot="overlay" style="margin-top: 4px">
                <a-menu-item>
                  <router-link to="/me">
                    <a-icon type="home" style="margin-right: 8px"/>
                    {{ $t('page_me_name') }}
                  </router-link>
                </a-menu-item>
                <a-menu-item>
                  <router-link to="/me/setting">
                    <a-icon type="setting" style="margin-right: 8px"/>
                    {{ $t('page_me_setting_name') }}
                  </router-link>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="handleLogoutClick">
                    <a-icon type="logout" style="margin-right: 8px"/>
                    {{ $t('logout') }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </a-layout-header>
      </div>
    </template>
    <template v-else>
      <tdd-language-select-banner />
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
            <router-link to="/">{{ $t('page_home_name') }}</router-link>
          </a-menu-item>
          <a-menu-item key="video">
            <router-link to="/video">{{ $t('page_video_name') }}</router-link>
          </a-menu-item>
          <a-menu-item key="member">
            <router-link to="/member">{{ $t('page_member_name') }}</router-link>
          </a-menu-item>
          <a-menu-item key="rank">
            <router-link to="/rank">{{ $t('page_rank_name') }}</router-link>
          </a-menu-item>
          <a-menu-item key="sprint">
            <router-link to="/sprint">{{ $t('page_sprint_name') }}</router-link>
          </a-menu-item>
          <a-menu-item key="tool">
            <router-link to="/tool">{{ $t('page_tool_name') }}</router-link>
          </a-menu-item>
          <a-menu-item key="about">
            <router-link to="/about">{{ $t('page_about_name') }}</router-link>
          </a-menu-item>
        </a-menu>
        <div v-if="!this.$store.state.isUserLoggedIn">
          <a-button
            class="desktop-header-login-button"
            ghost
            @click="() => this.$store.commit('changeLoginSliderVisibility')"
          >
            {{ $t('login') }}
          </a-button>
        </div>
        <div v-else>
          <a-dropdown key="desktop">
            <a-avatar
              class="desktop-header-user-avatar"
              :src="$util.httpS(avatarUrl)"
            />
            <a-menu slot="overlay" style="margin-top: 4px">
              <a-menu-item>
                <router-link to="/me">
                  <a-icon type="home" style="margin-right: 8px"/>
                  {{ $t('page_me_name') }}
                </router-link>
              </a-menu-item>
              <a-menu-item>
                <router-link to="/me/setting">
                  <a-icon type="setting" style="margin-right: 8px"/>
                  {{ $t('page_me_setting_name') }}
                </router-link>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" @click="handleLogoutClick">
                  <a-icon type="logout" style="margin-right: 8px"/>
                  {{ $t('logout') }}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>
    </template>
  </div>
</template>

<script>
import logo_small from '../../assets/img/logo_32S.png'
import md5 from 'js-md5';
import TddLanguageSelectBanner from "@/components/layout/TddLanguageSelectBanner";

export default {
  name: 'TddHeader',
  components: {
    TddLanguageSelectBanner,
  },
  data: function () {
    return {
      logo_small: logo_small
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
    },
    avatarUrl: function () {
      if (this.$store.state.isUserLoggedIn === true) {
        const email = this.$store.state.userDetail.email;
        if (email) {
          return 'https://www.gravatar.com/avatar/' + md5(email) + '?d=identicon';
        } else {
          return 'https://www.gravatar.com/avatar/' + md5('tdduser' + this.$store.state.userDetail.id + '@tdd.bunnyxt.com') + '?d=identicon';
        }
      } else {
        return 'https://www.gravatar.com/avatar/' + md5('anonymous@tdd.bunnyxt.com') + '?d=identicon';
      }
    }
  },
  methods: {
    handleLogoutClick: function () {
      let that = this;
      this.$axios({
        method: 'post',
        url: '/logout'
      })
        .then(function (response) {
          if (response.data.code === 20002) {
            // clear local storage
            localStorage.removeItem('tddUserDetail');

            // set status
            that.$store.commit('setUserLoginStatus', false);
            that.$store.commit('setUserDetail', null);

            that.$message.info('您已成功退出登录！');

            // go to home page
            that.$router.push('/');
          } else {
            console.log(response.data);
          }
        })
        .catch(function (error) {
          that.$message.error(error.response.data);
        })
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

.desktop-header-user-avatar {
  float: right;
  color: #fff;
  width: 32px;
  height: 32px;
  font-size: 32px;
  margin-top: 16px;
  cursor: pointer;
}

.ant-menu-item {
  padding: 0 12px;
}
</style>
