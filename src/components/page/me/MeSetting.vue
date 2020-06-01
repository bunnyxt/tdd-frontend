<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/me">个人中心</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>设置</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <div v-if="isLoadingUserInfo">
        <a-spin :spinning="true">
          正在获取用户详情
        </a-spin>
      </div>
      <div v-else>
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }" style="padding: 12px">
          <a-form-item label="用户id">
            {{ user.id }}
          </a-form-item>
          <a-form-item label="昵称">
            {{ user.nickname }}
            <a-button
                size="small"
                style="margin-left: 12px"
                @click="() => setNicknameModalVisibility = true"
                :type="user.nickname === 'tdduser'+user.id ? 'primary' : 'default'"
            >
              {{ user.nickname === 'tdduser'+user.id ? '首次设置(免费)' : '修改' }}
            </a-button>
            <a-modal title="设置昵称" v-model="setNicknameModalVisibility">
              <template slot="footer">
                <a-button type="primary" @click="() => bindEmailModalVisibility = false">完成</a-button>
              </template>
              <a-form :form="setNicknameForm">
                <a-form-item
                    label="昵称"
                >
                  <a-input
                      v-decorator="[
                          'nickname',
                          {
                            rules: [
                                { required: true, message: '请填写新昵称' },
                                { validator: nicknameValidator },
                              ]
                          },
                        ]"
                      placeholder="请填写新昵称"
                  />
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" @click="setNickname">
                    设置昵称
                  </a-button>
                </a-form-item>
              </a-form>
              <p>
                用户注册后有一次免费设置昵称的机会，之后每隔7日均可通过花费50积分修改一次昵称<br>
                昵称可以使用中文，长度在2~18之间，但不能与现有用户昵称相同<br>
                注意，请遵守法律法规，请勿在昵称内添加色情、血腥、暴力等敏感字眼，一旦发现，本站有权强制修改用户昵称，乃至封禁账号
              </p>
            </a-modal>
          </a-form-item>
          <a-form-item label="邮箱">
            <div v-if="user.email">
              {{ user.email }}
              <template v-if="user.phone">
                <a-popconfirm
                    placement="bottom"
                    okText="确认"
                    cancelText="取消"
                    @confirm="unbindEmail"
                >
                  <template slot="title">
                    取消绑定后，您将无法通过邮箱找回账号密码，<br/>
                    Gravatar头像也无法显示。确认取消绑定？
                  </template>
                  <a-button
                      size="small"
                      style="margin-left: 12px"
                      :loading="isUnbindingEmail"
                  >取消绑定</a-button>
                </a-popconfirm>
              </template>
              <template v-else>
                <a-tooltip>
                  <template slot="title">
                    用户至少留有邮箱/手机一项绑定
                  </template>
                  <a-button
                      size="small"
                      style="margin-left: 12px"
                      :disabled="true"
                  >取消绑定</a-button>
                </a-tooltip>
              </template>
            </div>
            <div v-else>
              未绑定
              <a-button
                  type="primary"
                  size="small"
                  style="margin-left: 12px"
                  @click="() => bindEmailModalVisibility = true"
              >绑定</a-button>
              <a-modal title="绑定邮箱" v-model="bindEmailModalVisibility">
                <template slot="footer">
                  <a-button type="primary" @click="() => bindEmailModalVisibility = false">完成</a-button>
                </template>
                <a-form :form="bindEmailForm">
                  <a-form-item
                      label="邮箱"
                  >
                    <a-input
                        v-decorator="[
                          'email',
                          {
                            rules: [
                                { required: true, message: '请填写邮箱地址' },
                                { validator: emailValidator },
                              ]
                          },
                        ]"
                        placeholder="请输入绑定邮箱"
                    />
                  </a-form-item>
                  <a-form-item
                      label="人机验证"
                  >
                    <div
                        v-decorator="[
                          'recaptcha',
                          {
                            rules: [
                              { required: true },
                            ]
                          },
                        ]"
                    >
                      <template v-if="bindEmailRecaptchaPassed">
                        <a-icon type="check-circle" style="margin-right: 8px" />已通过
                        <a-button
                            type="primary"
                            style="margin-left: 8px"
                            @click="bindEmailSendCode"
                            :loading="isSendingBindEmailCode"
                            :disabled="isSendingBindEmailCode || bindEmailCodeSendingCd > 0"
                        >发送验证码</a-button>
                        <span v-if="bindEmailCodeSendingCd > 0" style="margin-left: 8px">没收到验证码？{{ bindEmailCodeSendingCd }}秒后重新获取</span>
                      </template>
                      <vue-grecaptcha
                          v-else
                          ref="bindEmailRecaptcha"
                          @verify="bindEmailRecaptchaVerifyCallback"
                          @expired="bindEmailRecaptchaExpiredCallback"
                          :sitekey="recaptchaSiteKey"
                          style="margin-bottom: 12px"
                      ></vue-grecaptcha>
                    </div>
                  </a-form-item>
                  <a-form-item
                      label="验证码"
                  >
                    <a-input
                        v-decorator="[
                          'code',
                          {
                            rules: [
                                { required: true, message: '请填写验证码' },
                                { validator: codeValidator },
                              ]
                          },
                        ]"
                        placeholder="请输入验证码"
                    />
                  </a-form-item>
                  <a-form-item>
                    <a-button
                        type="primary"
                        @click="bindEmailSendValidation"
                        :loading="isSendingBindEmailValidation"
                        :disabled="isSendingBindEmailValidation"
                    >提交绑定</a-button>
                  </a-form-item>
                </a-form>
              </a-modal>
            </div>
          </a-form-item>
          <a-form-item label="手机">
            <div v-if="user.phone">
              {{ user.phone }}
              <template v-if="user.email">
                <a-popconfirm
                    placement="bottom"
                    okText="确认"
                    cancelText="取消"
                    @confirm="unbindPhone"
                >
                  <template slot="title">
                    取消绑定后，您将无法通过手机号找回账号密码。<br/>
                    确认取消绑定？
                  </template>
                  <a-button
                      size="small"
                      style="margin-left: 12px"
                  >取消绑定</a-button>
                </a-popconfirm>
              </template>
              <template v-else>
                <a-tooltip>
                  <template slot="title">
                    用户至少留有邮箱/手机一项绑定
                  </template>
                  <a-button
                      size="small"
                      style="margin-left: 12px"
                      :disabled="true"
                  >取消绑定</a-button>
                </a-tooltip>
              </template>
            </div>
            <div v-else>
              未绑定
              <a-button
                  type="primary"
                  size="small"
                  style="margin-left: 12px"
                  @click="() => bindPhoneModalVisibility = true"
              >绑定</a-button>
              <a-modal title="绑定手机" v-model="bindPhoneModalVisibility">
                <template slot="footer">
                  <a-button type="primary" @click="() => bindPhoneModalVisibility = false">完成</a-button>
                </template>
                <a-form :form="bindPhoneForm">
                  <a-form-item
                      label="手机"
                  >
                    <a-input
                        v-decorator="[
                          'phone',
                          {
                            rules: [
                                { required: true, message: '请填写手机号' },
                                { validator: phoneValidator },
                              ]
                          },
                        ]"
                        placeholder="请输入绑定手机号"
                    />
                  </a-form-item>
                  <a-form-item
                      label="人机验证"
                  >
                    <div
                        v-decorator="[
                          'recaptcha',
                          {
                            rules: [
                              { required: true },
                            ]
                          },
                        ]"
                    >
                      <template v-if="bindPhoneRecaptchaPassed">
                        <a-icon type="check-circle" style="margin-right: 8px" />已通过
                        <a-button
                            type="primary"
                            style="margin-left: 8px"
                            @click="bindPhoneSendCode"
                            :loading="isSendingBindPhoneCode"
                            :disabled="isSendingBindPhoneCode || bindPhoneCodeSendingCd > 0"
                        >发送验证码</a-button>
                        <span v-if="bindPhoneCodeSendingCd > 0" style="margin-left: 8px">没收到验证码？{{ bindPhoneCodeSendingCd }}秒后重新获取</span>
                      </template>
                      <vue-grecaptcha
                          v-else
                          ref="bindPhoneRecaptcha"
                          @verify="bindPhoneRecaptchaVerifyCallback"
                          @expired="bindPhoneRecaptchaExpiredCallback"
                          :sitekey="recaptchaSiteKey"
                          style="margin-bottom: 12px"
                      ></vue-grecaptcha>
                    </div>
                  </a-form-item>
                  <a-form-item
                      label="验证码"
                  >
                    <a-input
                        v-decorator="[
                          'code',
                          {
                            rules: [
                                { required: true, message: '请填写验证码' },
                                { validator: codeValidator },
                              ]
                          },
                        ]"
                        placeholder="请输入验证码"
                    />
                  </a-form-item>
                  <a-form-item>
                    <a-button
                        type="primary"
                        @click="bindPhoneSendValidation"
                        :loading="isSendingBindPhoneValidation"
                        :disabled="isSendingBindPhoneValidation"
                    >提交绑定</a-button>
                  </a-form-item>
                </a-form>
              </a-modal>
            </div>
          </a-form-item>
          <a-form-item label="密码">
            <a-button size="small" @click="() => changePasswordModalVisibility = true">修改密码</a-button>
            <a-modal title="修改密码" v-model="changePasswordModalVisibility">
              <template slot="footer">
                <a-button type="primary" @click="() => changePasswordModalVisibility = false">完成</a-button>
              </template>
              <a-form :form="changePasswordForm">
                <a-form-item
                    label="新密码"
                >
                  <a-input-password
                      v-decorator="[
                          'password',
                          {
                            rules: [
                                { required: true, message: '请填写新密码' },
                                { validator: passwordValidator },
                              ]
                          },
                        ]"
                      placeholder="请填写新密码"
                  />
                </a-form-item>
                <a-form-item
                    label="确认新密码"
                >
                  <a-input-password
                      v-decorator="[
                          'password2',
                          {
                            rules: [
                                { required: true, message: '请再输入一遍新密码' },
                              ]
                          },
                        ]"
                      placeholder="请再输入一遍新密码"
                  />
                </a-form-item>
                <a-form-item>
                  <a-button
                      type="primary"
                      @click="changePassword"
                      :loading="isChangingPassword"
                      :disabled="isChangingPassword"
                  >更改密码</a-button>
                </a-form-item>
              </a-form>
            </a-modal>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
  import VueGrecaptcha from 'vue-recaptcha'

  export default {
    name: 'MeSetting',
    data: function () {
      return {
        recaptchaSiteKey: this.$config.recaptchaSiteKey,
        isLoadingUserInfo: false,
        user: {},
        formLayout: 'horizontal',
        form: this.$form.createForm(this, { name: 'meSetting' }),
        // set nickname
        setNicknameModalVisibility: false,
        setNicknameForm: this.$form.createForm(this, { name: 'setNicknameForm' }),
        isSettingNickname: false,
        // bind email
        bindEmailModalVisibility: false,
        bindEmailForm: this.$form.createForm(this, { name: 'bindEmailForm' }),
        bindEmailRecaptchaPassed: false,
        bindEmailRecaptchaResponse: '',
        bindEmailBindKey: '',
        bindEmailExpired: 0,
        bindEmailCodeSendingCd: 0,
        bindEmailCodeSendRequested: false,
        isSendingBindEmailCode: false,
        isSendingBindEmailValidation: false,
        // unbind email
        isUnbindingEmail: false,
        // bind phone
        bindPhoneModalVisibility: false,
        bindPhoneForm: this.$form.createForm(this, { name: 'bindPhoneForm' }),
        bindPhoneRecaptchaPassed: false,
        bindPhoneRecaptchaResponse: '',
        bindPhoneBindKey: '',
        bindPhoneExpired: 0,
        bindPhoneCodeSendingCd: 0,
        bindPhoneCodeSendRequested: false,
        isSendingBindPhoneCode: false,
        isSendingBindPhoneValidation: false,
        // unbind phone
        isUnbindingPhone: false,
        // change password
        changePasswordModalVisibility: false,
        changePasswordForm: this.$form.createForm(this, { name: 'changePasswordForm' }),
        isChangingPassword: false,
      }
    },
    components: {
      VueGrecaptcha
    },
    watch: {

    },
    computed: {

    },
    methods: {
      fetchUserInfo: function () {
        let that = this;
        this.isLoadingUserInfo = true;

        return new Promise(function (resolve, reject) {
          that.$axios.get('/user/me')
            .then(function (response) {
              that.user = response.data;

              // update store and local storage
              that.$store.commit('setUserDetail', that.user);
              localStorage.setItem('tddUserDetail', JSON.stringify(that.user));

              // promise
              resolve();
            })
            .catch(function (error) {
              if (error.response) {
                if (error.response.data.code === 40102) {
                  that.$util.tddErrorHandler40102(that, true);
                } else {
                  console.log(error.response);
                }
              } else {
                console.log(error);
              }

              // promise
              reject(error);
            })
            .finally(function () {
              that.isLoadingUserInfo = false;
            });
        });
      },
      unbindEmail: function () {
        let that = this;
        this.isUnbindingEmail = true;

        that.$axios.delete('/user/bind/email')
          .then(function (response) {
            let data = response.data;
            if (data.status === 'success') {
              that.$message.success('取消绑定邮箱成功！');
              // update email
              that.user.email = null;
              // update store and local storage
              that.$store.commit('setUserDetail', that.user);
              localStorage.setItem('tddUserDetail', JSON.stringify(that.user));
            } else {
              that.$message.error('取消绑定邮箱失败！');
              switch (data.message) {
                case 'user have not bind email yet':
                  that.$message.error('用户还未绑定邮箱！');
                  break;
                case 'cannot unbind last only validation':
                  that.$message.error('用户至少留有邮箱/手机一项绑定！');
                  break;
                default:
                  that.$message.error(data.message);
              }
            }
          })
          .catch(function (error) {
            that.$message.error('取消绑定邮箱失败！');
            if (error.response) {
              if (error.response.data.code === 40102) {
                that.$util.tddErrorHandler40102(that, true);
              } else {
                console.log(error.response);
              }
            } else {
              console.log(error);
            }
          })
          .finally(function () {
            that.isUnbindingEmail = false;
          })
      },
      unbindPhone: function () {
        let that = this;
        this.isUnbindingPhone = true;

        that.$axios.delete('/user/bind/phone')
          .then(function (response) {
            let data = response.data;
            if (data.status === 'success') {
              that.$message.success('取消绑定手机成功！');
              // update phone
              that.user.phone = null;
              // update store and local storage
              that.$store.commit('setUserDetail', that.user);
              localStorage.setItem('tddUserDetail', JSON.stringify(that.user));
            } else {
              that.$message.error('取消绑定手机失败！');
              switch (data.message) {
                case 'user have not bind phone yet':
                  that.$message.error('用户还未绑定手机！');
                  break;
                case 'cannot unbind last only validation':
                  that.$message.error('用户至少留有邮箱/手机一项绑定！');
                  break;
                default:
                  that.$message.error(data.message);
              }
            }
          })
          .catch(function (error) {
            that.$message.error('取消绑定手机失败！');
            if (error.response) {
              if (error.response.data.code === 40102) {
                that.$util.tddErrorHandler40102(that, true);
              } else {
                console.log(error.response);
              }
            } else {
              console.log(error);
            }
          })
          .finally(function () {
            that.isUnbindingPhone = false;
          })
      },
      emailValidator: (rule, value, callback) => {
        let regex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
        if (!regex.test(value)) {
          callback('邮箱地址不合法');
        }
        if (value.length > 200) {
          callback('邮箱地址过长');
        }
        callback();
      },
      phoneValidator: (rule, value, callback) => {
        let regex = /^1[3456789]\d{9}$/;
        if (!regex.test(value)) {
          callback('手机号不合法');
        }
        callback();
      },
      codeValidator: (rule, value, callback) => {
        let regex = /^[0-9]+$/;
        if (!regex.test(value)) {
          callback('验证码只能包含数字');
        }
        if (value.length !== 6) {
          callback('验证码长度不符');
        }
        callback();
      },
      nicknameValidator: (rule, value, callback) => {
        if (value.length < 2) {
          callback('昵称太短');
        }
        if (value.length > 18) {
          callback('昵称太长');
        }
        if (value.startsWith('tdduser')) {
          callback('不能设置tdduser开头的昵称');
        }
        if (value === this.user.nickname) {
          callback('不能设置与之前相同的昵称');
        }
        callback();
      },
      passwordValidator: (rule, value, callback) => {
        if (!value) {
          callback();
        }
        if (value.length < 6) {
          callback('密码太短');
        }
        if (value.length > 16) {
          callback('密码太长');
        }
        let regex = /^[A-Za-z0-9!@#$%^&*()\-=_+[\]\\{}|;:'",./<>?`~]+$/g;
        if (!regex.test(value)) {
          callback('密码中包含不支持的字符');
        }
        // eslint-disable-next-line no-useless-escape
        const regexList = [
          /[A-Z]/g,
          /[a-z]/g,
          /[0-9]/g,
          /[!@#$%^&*()\-=_+[\]\\{}|;:'",./<>?`~]/g
        ];
        let strongValue = 0;
        for (let regex of regexList) {
          if (regex.test(value)) {
            strongValue++;
          }
        }
        if (value.length > 10) {
          strongValue++;
        }
        if (strongValue < 2) {
          callback('密码强度太弱');
        }
        callback();
      },
      // password2Validator: (rule, value, callback) => {
      //   callback();
      // },
      bindEmailRecaptchaVerifyCallback: function (response) {
        this.bindEmailRecaptchaPassed = true;
        this.bindEmailRecaptchaResponse = response;
      },
      bindEmailRecaptchaExpiredCallback: function () {
        this.bindEmailRecaptchaPassed = false;
        this.bindEmailRecaptchaResponse = '';
      },
      bindEmailSendCode: function () {
        const { getFieldValue, getFieldError } = this.bindEmailForm;
        if (!(
          getFieldValue('email') !== undefined &&
          getFieldError('email') === undefined &&
          this.bindEmailRecaptchaPassed
        )) {
          this.$message.warn('请先正确填写参数');
          return;
        } // TODO refactor, if these not satisfied, button should not be able to click

        // need do recaptcha again
        if (this.bindEmailCodeSendRequested) {
          this.$message.warn('请重新进行人机验证');
          this.bindEmailRecaptchaPassed = false;
          this.bindEmailCodeSendRequested = false;
          return;
        }

        this.isSendingBindEmailCode = true;
        let that = this;

        this.$axios({
          method: 'post',
          url: '/user/bind/email/code',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            email: getFieldValue('email'),
            recaptcha: this.bindEmailRecaptchaResponse
          }
        })
          .then(function (response) {
            let data = response.data;
            if (data.status === 'success') {
              that.$message.success('验证码发送成功！请检查邮箱');
              that.bindEmailBindKey = data.detail.bindkey;
              that.bindEmailExpired = data.detail.expired;
              // cd start
              that.bindEmailCodeSendingCd = 60;
              let cdInterval = setInterval(function () {
                that.bindEmailCodeSendingCd--;
                if (that.bindEmailCodeSendingCd === 0) {
                  clearInterval(cdInterval);
                }
              }, 1000);
            } else {
              that.$message.error('验证码发送失败！');
              switch (data.message) {
                case 'fail to validate recaptcha':
                  that.$message.error('人机验证未通过！');
                  that.$message.error(JSON.stringify(data.detail));
                  break;
                case 'user have already bind email':
                  that.$message.error('用户已经绑定过邮箱了！');
                  break;
                case 'email already used':
                  that.$message.error('该邮箱已被绑定！');
                  break;
                case 'fail to sent bind code to email':
                  that.$message.error('发送邮件失败！');
                  break;
                default:
                  that.$message.error(data.message);
              }
            }
          })
          .catch(function (error) {
            that.$message.error('验证码发送失败！');
            if (error.response) {
              if (error.response.data.code === 40102) {
                that.$util.tddErrorHandler40102(that, true);
              } else {
                console.log(error.response);
              }
            } else {
              console.log(error);
            }
          })
          .finally(function () {
            that.isSendingBindEmailCode = false;
            that.bindEmailCodeSendRequested = true;
          })
      },
      bindEmailSendValidation: function () {
        const { getFieldValue, getFieldError } = this.bindEmailForm;
        if (!(
          getFieldValue('code') !== undefined &&
          getFieldError('code') === undefined &&
          this.bindEmailBindKey.length > 0
        )) {
          this.$message.warn('请先正确填写参数');
          return;
        } // TODO refactor, if these not satisfied, button should not be able to click

        // check expired
        if ((new Date()).valueOf() > this.bindEmailExpired * 1000) {
          this.$message.warn('验证码过期，请重新获取');
          this.bindEmailRecaptchaPassed = false;
          this.bindEmailRecaptchaResponse = '';
          if (this.$refs.bindEmailRecaptcha) {
            this.$refs.bindEmailRecaptcha.reset();
          }
          return
        }

        this.isSendingBindEmailValidation = true;
        let that = this;

        this.$axios({
          method: 'post',
          url: '/user/bind/email/validation',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            bindkey: this.bindEmailBindKey,
            code: getFieldValue('code'),
          }
        })
          .then(function (response) {
            let data = response.data;
            if (data.status === 'success') {
              that.$message.success('绑定邮箱成功！');
              // reset
              that.bindEmailRecaptchaPassed = false;
              that.bindEmailRecaptchaResponse = '';
              that.bindEmailBindKey = '';
              that.bindEmailExpired = 0;
              if (that.$refs.bindEmailRecaptcha) {
                that.$refs.bindEmailRecaptcha.reset();
              }
              // update email
              that.user.email = data.detail.email;
              // update store and local storage
              that.$store.commit('setUserDetail', that.user);
              localStorage.setItem('tddUserDetail', JSON.stringify(that.user));
              // close modal
              that.bindEmailModalVisibility = false;
            } else {
              that.$message.error('绑定邮箱失败！');
              switch (data.message) {
                case 'code expired':
                  that.$message.error('验证码已过期！请重新获取');
                  that.bindEmailRecaptchaPassed = false;
                  that.bindEmailRecaptchaResponse = '';
                  if (that.$refs.bindEmailRecaptcha) {
                    that.$refs.bindEmailRecaptcha.reset();
                  }
                  break;
                case 'wrong code':
                  that.$message.error('验证码错误！');
                  break;
                default:
                  that.$message.error(data.message);
              }
            }
          })
          .catch(function (error) {
            that.$message.error('绑定邮箱失败！');
            if (error.response) {
              if (error.response.data.code === 40102) {
                that.$util.tddErrorHandler40102(that, true);
              } else {
                console.log(error.response);
              }
            } else {
              console.log(error);
            }
          })
          .finally(function () {
            that.isSendingBindEmailValidation = false;
          })
      },
      bindPhoneRecaptchaVerifyCallback: function (response) {
        this.bindPhoneRecaptchaPassed = true;
        this.bindPhoneRecaptchaResponse = response;
      },
      bindPhoneRecaptchaExpiredCallback: function () {
        this.bindPhoneRecaptchaPassed = false;
        this.bindPhoneRecaptchaResponse = '';
      },
      bindPhoneSendCode: function () {
        const { getFieldValue, getFieldError } = this.bindPhoneForm;
        if (!(
          getFieldValue('phone') !== undefined &&
          getFieldError('phone') === undefined &&
          this.bindPhoneRecaptchaPassed
        )) {
          this.$message.warn('请先正确填写参数');
          return;
        } // TODO refactor, if these not satisfied, button should not be able to click

        // need do recaptcha again
        if (this.bindPhoneCodeSendRequested) {
          this.$message.warn('请重新进行人机验证');
          this.bindPhoneRecaptchaPassed = false;
          this.bindPhoneCodeSendRequested = false;
          return;
        }

        this.isSendingBindPhoneCode = true;
        let that = this;

        this.$axios({
          method: 'post',
          url: '/user/bind/phone/code',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            phone: getFieldValue('phone'),
            recaptcha: this.bindPhoneRecaptchaResponse
          }
        })
          .then(function (response) {
            let data = response.data;
            if (data.status === 'success') {
              that.$message.success('验证码发送成功！请检查手机短信');
              that.bindPhoneBindKey = data.detail.bindkey;
              that.bindPhoneExpired = data.detail.expired;
              // cd start
              that.bindPhoneCodeSendingCd = 60;
              let cdInterval = setInterval(function () {
                that.bindPhoneCodeSendingCd--;
                if (that.bindPhoneCodeSendingCd === 0) {
                  clearInterval(cdInterval);
                }
              }, 1000);
            } else {
              that.$message.error('验证码发送失败！');
              switch (data.message) {
                case 'fail to validate recaptcha':
                  that.$message.error('人机验证未通过！');
                  that.$message.error(JSON.stringify(data.detail));
                  break;
                case 'user have already bind phone':
                  that.$message.error('用户已经绑定过手机了！');
                  break;
                case 'phone already used':
                  that.$message.error('该手机号已被绑定！');
                  break;
                case 'fail to sent bind code to phone':
                  that.$message.error('发送短信失败！');
                  break;
                default:
                  that.$message.error(data.message);
              }
            }
          })
          .catch(function (error) {
            that.$message.error('验证码发送失败！');
            if (error.response) {
              if (error.response.data.code === 40102) {
                that.$util.tddErrorHandler40102(that, true);
              } else {
                console.log(error.response);
              }
            } else {
              console.log(error);
            }
          })
          .finally(function () {
            that.isSendingBindPhoneCode = false;
            that.bindPhoneCodeSendRequested = true;
          })
      },
      bindPhoneSendValidation: function () {
        const { getFieldValue, getFieldError } = this.bindPhoneForm;
        if (!(
          getFieldValue('code') !== undefined &&
          getFieldError('code') === undefined &&
          this.bindPhoneBindKey.length > 0
        )) {
          this.$message.warn('请先正确填写参数');
          return;
        } // TODO refactor, if these not satisfied, button should not be able to click

        // check expired
        if ((new Date()).valueOf() > this.bindPhoneExpired * 1000) {
          this.$message.warn('验证码过期，请重新获取');
          this.bindPhoneRecaptchaPassed = false;
          this.bindPhoneRecaptchaResponse = '';
          if (this.$refs.bindPhoneRecaptcha) {
            this.$refs.bindPhoneRecaptcha.reset();
          }
          return
        }

        this.isSendingBindPhoneValidation = true;
        let that = this;

        this.$axios({
          method: 'post',
          url: '/user/bind/phone/validation',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            bindkey: this.bindPhoneBindKey,
            code: getFieldValue('code'),
          }
        })
          .then(function (response) {
            let data = response.data;
            if (data.status === 'success') {
              that.$message.success('绑定手机成功！');
              // reset
              that.bindPhoneRecaptchaPassed = false;
              that.bindPhoneRecaptchaResponse = '';
              that.bindPhoneBindKey = '';
              that.bindPhoneExpired = 0;
              if (that.$refs.bindPhoneRecaptcha) {
                that.$refs.bindPhoneRecaptcha.reset();
              }
              // update phone
              that.user.phone = data.detail.phone;
              // update store and local storage
              that.$store.commit('setUserDetail', that.user);
              localStorage.setItem('tddUserDetail', JSON.stringify(that.user));
              // close modal
              that.bindPhoneModalVisibility = false;
            } else {
              that.$message.error('绑定手机失败！');
              switch (data.message) {
                case 'code expired':
                  that.$message.error('验证码已过期！请重新获取');
                  that.bindPhoneRecaptchaPassed = false;
                  that.bindPhoneRecaptchaResponse = '';
                  if (that.$refs.bindPhoneRecaptcha) {
                    that.$refs.bindPhoneRecaptcha.reset();
                  }
                  break;
                case 'wrong code':
                  that.$message.error('验证码错误！');
                  break;
                default:
                  that.$message.error(data.message);
              }
            }
          })
          .catch(function (error) {
            that.$message.error('绑定手机失败！');
            if (error.response) {
              if (error.response.data.code === 40102) {
                that.$util.tddErrorHandler40102(that, true);
              } else {
                console.log(error.response);
              }
            } else {
              console.log(error);
            }
          })
          .finally(function () {
            that.isSendingBindPhoneValidation = false;
          })
      },
      setNickname: function () {
        const { getFieldValue, getFieldError } = this.setNicknameForm;
        if (!(
          getFieldValue('nickname') !== undefined &&
          getFieldError('nickname') === undefined
        )) {
          this.$message.warn('请先正确填写参数');
          return;
        } // TODO refactor, if these not satisfied, button should not be able to click

        this.isSettingNickname = true;
        let that = this;

        this.$axios({
          method: 'post',
          url: '/user/set/nickname',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            nickname: getFieldValue('nickname'),
          }
        })
          .then(function (response) {
            let data = response.data;
            if (data.status === 'success') {
              that.$message.success('设置昵称成功！');
              // update nickname
              that.user.nickname = data.detail.nickname;
              // update store and local storage
              that.$store.commit('setUserDetail', that.user);
              localStorage.setItem('tddUserDetail', JSON.stringify(that.user));
              // close modal
              that.setNicknameModalVisibility = false;
            } else {
              that.$message.error('设置昵称失败！');
              switch (data.message) {
                case 'nickname same with before':
                  that.$message.error('新旧昵称相同！');
                  break;
                case 'nickname already used':
                  that.$message.error('昵称已被使用！');
                  break;
                case 'nickname changed in 7 days':
                  that.$message.error('过去7日内修改过昵称！');
                  that.$message.info('下次可修改时间：' + that.$util.tsToDateString(data.detail.last + 7 * 24 * 60 * 60));
                  break;
                case 'point not enough':
                  that.$message.error('积分不足！');
                  that.$message.info('该操作需要'+data.detail.require+'积分，当前仅剩'+data.detail.left+'积分')
                  break;
                default:
                  that.$message.error(data.message);
              }
            }
          })
          .catch(function (error) {
            that.$message.error('设置昵称失败！');
            if (error.response) {
              if (error.response.data.code === 40102) {
                that.$util.tddErrorHandler40102(that, true);
              } else if (error.response.data.code === 40001) {
                that.$message.error('参数错误！');
                that.$message.error(error.response.data.message);
              } else {
                console.log(error.response);
              }
            } else {
              console.log(error);
            }
          })
          .finally(function () {
            that.isSettingNickname = false;
          })
      },
      changePassword: function () {
        const { getFieldValue, getFieldError } = this.changePasswordForm;
        if (getFieldValue('password') !== getFieldValue('password2')) {
          this.$message.warn('两次填写的密码不一致');
          return;
        }

        if (!(
          getFieldValue('password') !== undefined &&
          getFieldError('password') === undefined &&
          getFieldValue('password2') !== undefined &&
          getFieldError('password2') === undefined
        )) {
          this.$message.warn('请先正确填写参数');
          return;
        } // TODO refactor, if these not satisfied, button should not be able to click

        this.isChangingPassword = true;
        let that = this;

        this.$axios({
          method: 'post',
          url: '/user/change/password',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            password: getFieldValue('password'),
          }
        })
          .then(function (response) {
            let data = response.data;
            if (data.status === 'success') {
              that.$message.success('修改密码成功！');
              that.changePasswordModalVisibility = false;

              // clear local storage
              localStorage.removeItem('tddUserDetail');

              // set status
              that.$store.commit('setUserLoginStatus', false);
              that.$store.commit('setUserDetail', null);

              that.$message.info('请使用新密码重新登录！');

              // go to home page
              that.$router.push('/');
            } else {
              that.$message.error('修改密码失败！');
              that.$message.error(data.message);
            }
          })
          .catch(function (error) {
            that.$message.error('修改密码失败！');
            if (error.response) {
              if (error.response.data.code === 40102) {
                that.$util.tddErrorHandler40102(that, true);
              } else if (error.response.data.code === 40001) {
                that.$message.error('参数错误！');
                that.$message.error(error.response.data.message);
              } else {
                console.log(error.response);
              }
            } else {
              console.log(error);
            }
          })
          .finally(function () {
            that.isChangingPassword = false;
          })
      }
    },
    created() {
      this.fetchUserInfo();
    }
  }
</script>

<style scoped>
  .ant-form-item {
    margin-bottom: 8px;
  }
  @media (max-width: 575px)  {
    .ant-form-item-label {
      padding: 0;
    }
  }
</style>
