<template>
  <a-drawer
      placement="right"
      :closable="true"
      :visible="this.$store.state.isLoginSliderVisible"
      :width="this.$store.state.clientWidth > 320 ? '320px' : this.$store.state.clientWidth + 'px'"
      @close="drawerCloseHandler"
  >
    <div>
      <a-menu v-model="currentKeys" mode="horizontal">
        <a-menu-item key="login">
          登录
        </a-menu-item>
        <a-menu-item key="register">
          注册
        </a-menu-item>
      </a-menu>
      <div v-show="currentKeys.indexOf('login') !== -1">
        <div style="margin-top: 16px">
          <div style="margin-bottom: 8px">用户名：</div>
          <a-input
              placeholder="用户名"
              v-model="loginUsername"
              style="margin-bottom: 8px"
              @blur="firstEnterLoginUsername = false"
          />
          <div style="margin-bottom: 8px">密码：</div>
          <a-input-password
              placeholder="密码"
              v-model="loginPassword"
              style="margin-bottom: 12px"
              @blur="firstEnterLoginPassword = false"
          />
          <div v-if="showLoginPrompt" style="margin-bottom: 12px">
            <span style="color: red">{{loginPrompt}}</span>
          </div>
          <div style="overflow: hidden">
            <a-button
                type="primary"
                style="float: left"
                :loading="isLoginIn"
                :disabled="!canGoLogin"
                @click="onLoginButtonClick"
            >登录</a-button>
<!--            <a-button style="float: left; margin-left: 12px">忘记密码</a-button>-->
          </div>
        </div>
      </div>
      <div v-show="currentKeys.indexOf('register') !== -1">
        其实...登录注册功能还没有做好Orz...<br>
        可以来QQ群：<a target="_blank" href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a>催更（跑
      </div>
    </div>
  </a-drawer>
</template>

<script>
  export default {
    name: 'TddLoginSlider',
    data: function () {
      return {
        currentKeys: ['login'],
        firstEnterLoginUsername: true,
        firstEnterLoginPassword: true,
        loginPrompt: '',
        loginUsername: '',
        loginPassword: '',
        isLoginIn: false
      }
    },
    computed: {
      loginUsernameString: function () {
        return String(this.loginUsername);
      },
      loginPasswordString: function () {
        return String(this.loginPassword);
      },
      loginUsernameValidity: function () {
        const username = this.loginUsernameString;
        if (username.length < 4 || username > 16) {
          return '用户名长度应大于等于4、小于等于16';
        }
        return 'ok';
      },
      loginPasswordValidity: function () {
        const password = this.loginPasswordString;
        if (password.length < 4 || password > 16) {
          return '密码长度应大于等于4、小于等于16';
        }
        return 'ok';
      },
      canGoLogin: function () {
        return this.loginUsernameValidity === 'ok' && this.loginPasswordValidity === 'ok';
      },
      showLoginPrompt: function () {
        if (!this.firstEnterLoginUsername || !this.firstEnterLoginPassword) {
          if (!this.canGoLogin) {
            let prompt = '';
            if (!this.firstEnterLoginUsername && this.loginUsernameValidity !== 'ok') {
              prompt += this.loginUsernameValidity + '，';
            }
            if (!this.firstEnterLoginPassword && this.loginPasswordValidity !== 'ok') {
              prompt += this.loginPasswordValidity + '，';
            }
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.loginPrompt = prompt.slice(0, prompt.length - 1);
            return true;
          }
        }
        return false;
      }
    },
    methods: {
      drawerCloseHandler: function() {
        this.$store.commit('changeLoginSliderVisibility');
      },
      onLoginButtonClick: function () {
        // go request
        this.isLoginIn = true;
        let that = this;
        this.$axios({
          method: 'post',
          url: '/login',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: this.$qs.stringify({
            username: this.loginUsernameString,
            password: this.loginPasswordString
          })
        })
          .then(function (response) {
            if (response.data.code === 20001) {
              let data = response.data;
              that.$message.info(`登录成功！欢迎回来，${data.detail.nickname}！`);

              // set local storage
              localStorage.setItem('tddUserDetail', JSON.stringify(data.detail));

              // set status
              that.$store.commit('setUserLoginStatus', true);
              that.$store.commit('setUserDetail', data.detail);

              // clear username and password
              that.loginUsername = '';
              that.loginPassword = '';

              // clear status
              that.firstEnterLoginUsername = true;
              that.firstEnterLoginPassword = true;

              // close slider
              that.$store.commit('changeLoginSliderVisibility');
            } else {
              that.$message.error('登录失败！');
              that.$message.error(response.data);
            }
          })
          .catch(function (error) {
            if (error.response) {
              if (error.response.data.code === 40101) {
                that.$message.error('登录失败！请检查用户名与密码是否正确！');
              } else {
                that.$message.error('登录失败！服务器返回出错');
                that.$message.error(error.response);
              }
            } else if (error.request) {
              that.$message.error('登录失败！客户端请求');
              that.$message.error(error.request);
            } else {
              that.$message.error('登录失败！');
              that.$message.error(error);
            }
          })
          .finally(function () {
            that.isLoginIn = false;
          });
      }
    }
  }
</script>