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
        <a-dropdown key="mobile">
          <a-avatar
              class="mobile-header-user-avatar"
              :src="avatarUrl"
          />
          <a-menu slot="overlay" style="margin-top: 4px">
            <a-menu-item>
              <router-link to="/me"><a-icon type="home" style="margin-right: 8px" />个人中心</router-link>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/me/setting"><a-icon type="setting" style="margin-right: 8px" />设置</router-link>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="handleLogoutClick"><a-icon type="logout" style="margin-right: 8px" />退出</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
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
      >
        <a-menu-item key="home"><router-link to="/">首页</router-link></a-menu-item>
        <a-menu-item key="video"><router-link to="/video">视频</router-link></a-menu-item>
        <a-menu-item key="member"><router-link to="/member">UP主</router-link></a-menu-item>
        <a-menu-item key="sprint"><router-link to="/sprint">传说助攻</router-link></a-menu-item>
        <a-menu-item key="tool"><router-link to="/tool">辅助工具</router-link></a-menu-item>
        <a-menu-item key="about"><router-link to="/about">关于</router-link></a-menu-item>
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
        <a-dropdown key="desktop">
          <a-avatar
              class="desktop-header-user-avatar"
              :src="avatarUrl"
          />
          <a-menu slot="overlay" style="margin-top: 4px">
            <a-menu-item>
              <router-link to="/me"><a-icon type="home" style="margin-right: 8px" />个人中心</router-link>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/me/setting"><a-icon type="setting" style="margin-right: 8px" />设置</router-link>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="handleLogoutClick"><a-icon type="logout" style="margin-right: 8px" />退出</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </a-layout-header>
  </div>
</template>

<script>
  import logo_small from '../../assets/img/logo_32S.png'
  import md5 from 'js-md5';

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
