<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "register_agreement": "点击注册，代表你已阅读并同意本站的用户协议与隐私政策"
  },
  "en": {
    "register_agreement": "by click Register, it means that you have read and agree to the user agreement and privacy policy of this site"
  }
}
</i18n>

<template>
  <a-drawer
    placement="right"
    :closable="true"
    :visible="this.$store.state.isLoginSliderVisible"
    :width="this.$store.state.clientWidth > 352 ? '352px' : this.$store.state.clientWidth + 'px'"
    @close="drawerCloseHandler"
  >
    <div>
      <a-menu v-model="currentKeys" mode="horizontal">
        <a-menu-item key="login">
          {{ $t('login') }}
        </a-menu-item>
        <a-menu-item key="register">
          {{ $t('register') }}
        </a-menu-item>
      </a-menu>
      <div v-show="currentKeys.indexOf('login') !== -1">
        <div style="margin-top: 16px">
          <div style="margin-bottom: 8px">{{ $t('username') }}</div>
          <a-input
            :placeholder="$t('username')"
            v-model="loginUsername"
            allowClear
            style="margin-bottom: 8px"
            @blur="firstEnterLoginUsername = false"
          />
          <div style="margin-bottom: 8px">{{ $t('password') }}</div>
          <a-input-password
            :placeholder="$t('password')"
            v-model="loginPassword"
            allowClear
            style="margin-bottom: 12px"
            @blur="firstEnterLoginPassword = false"
          />
          <div v-if="loginPrompt.length > 0" style="margin-bottom: 12px">
            <span style="color: red">{{ loginPrompt }}</span>
          </div>
          <vue-recaptcha
            ref="loginRecaptcha"
            :sitekey="recaptchaSiteKey"
            style="margin-bottom: 12px"
            @verify="loginRecaptchaVerifyCallback"
            @expired="loginRecaptchaExpiredCallback"
          />
          <div style="overflow: hidden">
            <a-button
              type="primary"
              style="float: left"
              :loading="isLoginIn"
              :disabled="!canGoLogin"
              @click="onLoginButtonClick"
            >{{ $t('login') }}</a-button>
<!--            <a-button style="float: left; margin-left: 12px">忘记密码</a-button>-->
          </div>
        </div>
      </div>
      <div v-show="currentKeys.indexOf('register') !== -1">
        <div style="margin-top: 16px">
          <div style="margin-bottom: 8px">{{ $t('username') }}</div>
          <a-input
            :placeholder="$t('username')"
            v-model="registerUsername"
            allowClear
            style="margin-bottom: 8px"
            @blur="firstEnterRegisterUsername = false"
          />
          <div style="margin-bottom: 8px; overflow: hidden">
            <div style="float: left">
              {{ $t('password') }}
            </div>
            <div style="float: right">
              {{ $t('password_complexity_level') }}{{ $t('colon') }}<span :style="registerPasswordStrongLevelStyle">{{ registerPasswordStrongLevelName }}</span>
            </div>
          </div>
          <a-input-password
            :placeholder="$t('password')"
            v-model="registerPassword"
            allowClear
            style="margin-bottom: 8px"
            @blur="firstEnterRegisterPassword = false"
          />
          <div style="margin-bottom: 8px">{{ $t('validation_method') }}</div>
          <a-input-group compact style="margin-bottom: 12px">
            <a-select defaultValue="email" v-model="registerValidationMethod" style="width: 80px">
              <a-select-option value="email">{{ $t('email') }}</a-select-option>
              <a-select-option value="phone">{{ $t('phone') }}</a-select-option>
            </a-select>
            <a-input
              :placeholder="registerValidationMethodName"
              v-model="registerValidation"
              allowClear
              style="width: calc(100% - 80px)"
              @blur="firstEnterRegisterValidation = false"
            />
          </a-input-group>
          <div v-if="registerPrompt.length > 0" style="margin-bottom: 12px">
            <span style="color: red">{{ registerPrompt }}</span>
          </div>
          <vue-recaptcha
            ref="registerRecaptcha"
            :sitekey="recaptchaSiteKey"
            style="margin-bottom: 12px"
            @verify="registerRecaptchaVerifyCallback"
            @expired="registerRecaptchaExpiredCallback"
          />
          <a-button
            type="primary"
            :disabled="!(canGoSendCodeButton && codeSendingCd === 0)"
            :loading="isSendingCode"
            @click="onRegisterSendCodeButtonClick"
          >{{ registerSendCodeButtonString }}</a-button>
          <div v-if="codeSendingCd > 0" style="margin-top: 12px">{{ $t('validation_code_resend_prompt', { seconds: codeSendingCd }) }}</div>
          <div style="margin-bottom: 8px; margin-top: 12px">{{ $t('validation_code') }}</div>
          <a-input
            :placeholder="$t('validation_code')"
            v-model="registerCode"
            allowClear
            style="margin-bottom: 12px"
            @blur="firstEnterRegisterCode = false"
          />
          <a-button
            type="primary"
            :disabled="!canGoSendRegButton"
            @click="onRegisterSendRegButtonClick"
          >{{ $t('register') }}</a-button>
          <div>
            <div style="font-size: 10px; line-height: 10px; margin-top: 12px">*{{ $t('register_agreement') }}</div>
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { VueRecaptcha } from 'vue-recaptcha';

export default {
  name: 'TddLoginSlider',
  data: function () {
    return {
      recaptchaSiteKey: this.$config.recaptchaSiteKey,
      currentKeys: ['login'],
      firstEnterLoginUsername: true,
      firstEnterLoginPassword: true,
      loginUsername: '',
      loginPassword: '',
      loginRecaptchaStatus: false,
      loginRecaptchaResponse: '',
      isLoginIn: false,
      firstEnterRegisterUsername: true,
      firstEnterRegisterPassword: true,
      firstEnterRegisterValidation: true,
      firstEnterRegisterCode: true,
      registerValidationMethod: 'email',
      registerUsername: '',
      registerPassword: '',
      registerValidation: '',
      registerCode: '',
      registerRecaptchaStatus: false,
      registerRecaptchaResponse: '',
      isSendingCode: false,
      codeSendingCd: 0,
      regkey: '',
      regExpired: 0,
      isSendingReg: false
    }
  },
  components: {
    VueRecaptcha
  },
  watch: {
    // registerRecaptchaResponse: function () {
    //   console.log(this.registerRecaptchaResponse);
    // }
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
      if (username.length < 4 || username.length > 16) {
        return '用户名长度应大于等于4、小于等于16';
      }
      // eslint-disable-next-line no-useless-escape
      let regex = /^[A-Za-z0-9_\-]+$/ig;
      if (!regex.test(username)) {
        return '用户名只能包含大小写字母、数字、下划线(_)和连字符(-)';
      }
      return 'ok';
    },
    loginPasswordValidity: function () {
      const password = this.loginPasswordString;
      if (password.length < 6 || password.length > 16) {
        return '密码长度应大于等于6、小于等于16';
      }
      // eslint-disable-next-line no-useless-escape
      let regex = /^[A-Za-z0-9!@#$%^&*()\-=_+[\]\\{}|;:'",./<>?`~]+$/g;
      if (!regex.test(password)) {
        return '密码中包含不支持的字符';
      }
      return 'ok';
    },
    canGoLogin: function () {
      return this.loginUsernameValidity === 'ok' && this.loginPasswordValidity === 'ok' && this.loginRecaptchaStatus;
    },
    loginPrompt: function () {
      let prompt = '';
      if (!this.firstEnterLoginUsername && this.loginUsernameValidity !== 'ok') {
        prompt += this.loginUsernameValidity + '，';
      }
      if (!this.firstEnterLoginPassword && this.loginPasswordValidity !== 'ok') {
        prompt += this.loginPasswordValidity + '，';
      }
      return prompt.slice(0, prompt.length - 1);
    },
    registerValidationMethodName: function () {
      const nameDict = {
        'email': this.$t('email'),
        'phone': this.$t('phone'),
      };
      return nameDict[this.registerValidationMethod];
    },
    registerUsernameString: function () {
      return String(this.registerUsername);
    },
    registerPasswordString: function () {
      return String(this.registerPassword);
    },
    registerValidationString: function () {
      return String(this.registerValidation);
    },
    registerUsernameValidity: function () {
      const username = this.registerUsernameString;
      if (username.length < 4 || username.length > 16) {
        return '用户名长度应大于等于4、小于等于16';
      }
      // eslint-disable-next-line no-useless-escape
      let regex = /^[A-Za-z0-9_\-]+$/ig;
      if (!regex.test(username)) {
        return '用户名只能包含大小写字母、数字、下划线(_)和连字符(-)';
      }
      return 'ok';
    },
    registerPasswordValidity: function () {
      const password = this.registerPasswordString;
      if (password.length < 6 || password.length > 16) {
        return '密码长度应大于等于6、小于等于16';
      }
      // eslint-disable-next-line no-useless-escape
      let regex = /^[A-Za-z0-9!@#$%^&*()\-=_+[\]\\{}|;:'",./<>?`~]+$/g;
      if (!regex.test(password)) {
        return '密码中包含不支持的字符';
      }
      if (this.registerPasswordStrongLevel === 0) {
        return '密码强度太弱';
      }
      return 'ok';
    },
    registerPasswordStrongLevel: function () {
      const password = this.registerPasswordString;
      // eslint-disable-next-line no-useless-escape
      const regexList = [
        /[A-Z]/g,
        /[a-z]/g,
        /[0-9]/g,
        /[!@#$%^&*()\-=_+[\]\\{}|;:'",./<>?`~]/g
      ];
      let level = 0;
      for (let regex of regexList) {
        if (regex.test(password)) {
          level++;
        }
      }
      if (password.length > 10) {
        level++;
      }
      return level;
    },
    registerPasswordStrongLevelName: function () {
      return [
        this.$t('password_complexity_level_low'),
        this.$t('password_complexity_level_low'),
        this.$t('password_complexity_level_medium'),
        this.$t('password_complexity_level_high'),
        this.$t('password_complexity_level_very_high'),
      ][this.registerPasswordStrongLevel];
    },
    registerPasswordStrongLevelStyle: function () {
      let style = {};
      switch (this.registerPasswordStrongLevel) {
        case 0:
        case 1:
          style.color = 'red';
          break;
        case 2:
          style.color = 'orange';
          break;
        case 3:
          style.color = 'mediumseagreen';
          break;
        case 4:
          style.color = 'seagreen';
          break;
        default:
          break;
      }
      return style;
    },
    registerValidationValidity: function () {
      if (this.registerValidationMethod === 'phone') {
        const phone = this.registerValidationString;
        let regex = /^1[3456789]\d{9}$/;
        if (!regex.test(phone)) {
          return '手机号不合法，只支持中国大陆11位手机号';
        }
        return 'ok';
      } else if (this.registerValidationMethod === 'email') {
        const email = this.registerValidationString;
        // eslint-disable-next-line no-useless-escape
        let regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!regex.test(email)) {
          return '邮箱地址不合法，请检查输入';
        }
        if (email.length > 200) {
          return '邮箱地址过长，请检查输入';
        }
        return 'ok';
      } else {
        return '未知验证方式';
      }
    },
    canGoSendCodeButton: function () {
      return this.registerValidationValidity === 'ok' && this.registerRecaptchaStatus;
    },
    registerPrompt: function () {
      let prompt = '';
      if (!this.firstEnterRegisterUsername && this.registerUsernameValidity !== 'ok') {
        prompt += this.registerUsernameValidity + '，';
      }
      if (!this.firstEnterRegisterPassword && this.registerPasswordValidity !== 'ok') {
        prompt += this.registerPasswordValidity + '，';
      }
      if (!this.firstEnterRegisterValidation && this.registerValidationValidity !== 'ok') {
        prompt += this.registerValidationValidity + '，';
      }
      return prompt.slice(0, prompt.length - 1);
    },
    registerSendCodeButtonString: function () {
      if (this.codeSendingCd === 0) {
        return this.$t('validation_code_send');
      } else {
        return this.$t('validation_code_sent');
      }
    },
    canGoSendRegButton: function () {
      return this.regkey.length > 0 && this.registerCode.length === 6;
    }
  },
  methods: {
    drawerCloseHandler: function() {
      this.$store.commit('changeLoginSliderVisibility');
    },
    loginRecaptchaVerifyCallback: function (response) {
      this.loginRecaptchaStatus = true;
      this.loginRecaptchaResponse = response;
    },
    loginRecaptchaExpiredCallback: function () {
      this.loginRecaptchaStatus = false;
      this.loginRecaptchaResponse = '';
    },
    registerRecaptchaVerifyCallback: function (response) {
      this.registerRecaptchaStatus = true;
      this.registerRecaptchaResponse = response;
    },
    registerRecaptchaExpiredCallback: function () {
      this.registerRecaptchaStatus = false;
      this.registerRecaptchaResponse = '';
    },
    onLoginButtonClick: function () {
      // go request
      this.isLoginIn = true;
      let that = this;
      this.$axios({
        method: 'post',
        url: '/login',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          username: this.loginUsernameString,
          password: this.loginPasswordString,
          recaptcha: this.loginRecaptchaResponse
        }
      })
        .then(function (response) {
          if (response.data.code === 20001) {
            let data = response.data;
            that.$message.info(`登录成功！欢迎回来，${data.detail.nickname ? data.detail.nickname : 'tdduser'+data.detail.id}！`);

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
            that.loginRecaptchaStatus = false;
            that.loginRecaptchaResponse = '';

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
              if (JSON.stringify(error.response.data.detail).length > 0) {
                that.$message.error(JSON.stringify(error.response.data.detail));
              }
            } else {
              that.$message.error('登录失败！服务器返回出错');
              console.log(JSON.stringify(error.response));
            }
          } else if (error.request) {
            that.$message.error('登录失败！客户端请求出错');
            console.log(JSON.stringify(error.request));
          } else {
            that.$message.error('登录失败！');
            console.log(JSON.stringify(error));
          }
        })
        .finally(function () {
          that.isLoginIn = false;
          that.$refs.loginRecaptcha.reset();
        });
    },
    onRegisterSendCodeButtonClick: function () {
      this.isSendingCode = true;
      let that = this;
      this.$axios({
        method: 'post',
        url: '/register/code',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          method: this.registerValidationMethod,
          validation: this.registerValidation,
          username: this.registerUsernameString,
          password: this.registerPasswordString,
          recaptcha: this.registerRecaptchaResponse
        }
      })
        .then(function (response) {
          if (response.data.status === 'success') {
            let data = response.data;

            that.regkey = data.detail.regkey;
            that.regExpired = data.detail.expired;

            that.$message.info('已发送验证码！请查收并填写');

            that.codeSendingCd = 60;
            let cdInterval = setInterval(function () {
              that.codeSendingCd--;
              if (that.codeSendingCd === 0) {
                clearInterval(cdInterval);
              }
            }, 1000);

          } else {
            that.$message.error('获取验证码失败！');
            switch (response.data.message) {
              case 'fail to validate recaptcha':
                that.$message.error('recaptcha人机身份验证未通过');
                break;
              case 'username already used':
                that.$message.error('用户名已被占用');
                break;
              case 'email already used':
                that.$message.error('邮箱已被绑定');
                break;
              case 'phone already used':
                that.$message.error('手机号已被绑定');
                break;
              default:
                that.$message.error(response.data.message);
            }
            that.$message.error(JSON.stringify(response.data.detail));
          }
        })
        .catch(function (error) {
          if (error.response) {
            if (error.response.data.code === 40001) {
              that.$message.error('获取验证码失败！请检查参数是否正确');
              if (JSON.stringify(error.response.data.detail).length > 0) {
                that.$message.error(JSON.stringify(error.response.data.detail));
              }
            } else {
              that.$message.error('获取验证码失败！服务器返回出错');
              console.log(JSON.stringify(error.response));
            }
          } else if (error.request) {
            that.$message.error('获取验证码失败！客户端请求出错');
            console.log(JSON.stringify(error.request));
          } else {
            that.$message.error('获取验证码失败！');
            console.log(JSON.stringify(error));
          }
        })
        .finally(function () {
          that.isSendingCode = false;
          that.$refs.registerRecaptcha.reset();
        });
    },
    onRegisterSendRegButtonClick: function () {
      if ((new Date()).valueOf() > this.regExpired * 1000) {
        this.$message.error('验证码已过期，请重新获取');
        this.registerCode = '';
        return
      }
      this.isSendingReg = true;
      let that = this;
      this.$axios({
        method: 'post',
        url: '/register/reg',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          code: this.registerCode,
          regkey: this.regkey
        }
      })
        .then(function (response) {
          if (response.data.status === 'success') {
            that.$message.success('注册成功！请使用该账号登录');

            // clear register input
            that.registerUsername = '';
            that.registerPassword = '';
            that.registerValidation = '';
            that.registerValidationMethod = 'email';
            that.registerCode = '';
            that.regkey = '';
            that.regExpired = 0;

            // change to login panel
            that.currentKeys = ['login'];
          } else {
            that.$message.error('注册失败！');
            switch (response.data.message) {
              case 'no register task found':
                that.$message.error('未找到相应的注册任务！');
                break;
              case 'fail to validate recaptcha':
                that.$message.error('recaptcha人机身份验证未通过！');
                break;
              case 'username already used':
                that.$message.error('用户名已被占用！');
                break;
              case 'email already used':
                that.$message.error('邮箱已被绑定！');
                break;
              case 'phone already used':
                that.$message.error('手机号已被绑定！');
                break;
              default:
                that.$message.error(response.data.message);
            }
            that.$message.error(JSON.stringify(response.data.detail));
          }
        })
        .catch(function (error) {
          if (error.response) {
            if (error.response.data.code === 40001) {
              that.$message.error('注册失败！请检查参数是否正确');
              if (JSON.stringify(error.response.data.detail).length > 0) {
                that.$message.error(JSON.stringify(error.response.data.detail));
              }
            } else {
              that.$message.error('注册失败！服务器返回出错');
              console.log(JSON.stringify(error.response));
            }
          } else if (error.request) {
            that.$message.error('注册失败！客户端请求出错');
            console.log(JSON.stringify(error.request));
          } else {
            that.$message.error('注册失败！');
            console.log(JSON.stringify(error));
          }
        })
        .finally(function () {
          that.isSendingReg = false;
        });
    }
  }
}
</script>
