<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>个人中心</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <div v-if="isLoadingUserInfo">
        <a-spin :spinning="true">
          正在获取用户详情
        </a-spin>
      </div>
      <div v-else>
        <div v-if="$store.getters.clientMode === 'MOBILE'">

        </div>
        <div v-else>
          <div style="overflow: hidden">
            <a-avatar
                :src="avatarUrl"
                :size="48"
                style="float: left"
            />
            <div style="float: left; margin-left: 12px">
              <div style="overflow: hidden">
                <div style="font-size: 1.17em; color: rgba(0, 0, 0, 0.85); font-weight: 500; float: left">{{ user.nickname }}</div>
                <div style="float: left">
                  <a-tag v-for="role in user.roles" :key="role.id" :color="getRoleTitleColor(role.title)" style="margin-left: 8px">
                    {{ role.title }}
                  </a-tag>
                </div>
              </div>
              <div style="margin-top: 4px">
                <a-icon type="pay-circle" style="margin-right: 4px" /> 积分：{{ user.point.toLocaleString() }}
                <a-icon type="rocket" style="margin-left: 12px; margin-right: 4px" /> 经验：{{ user.exp.toLocaleString() }}
              </div>
            </div>
            <div style="float: right">
              签到相关
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      关注的视频
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      关注的P主
    </div>
    <div class="section-separator"></div>
  </div>
</template>

<script>
  import md5 from 'js-md5';

  export default {
    name: 'MeHome',
    data: function () {
      return {
        isLoadingUserInfo: false,
        user: null
      }
    },
    computed: {
      avatarUrl: function () {
        if (this.$store.state.isUserLoggedIn === true) {
          const email = this.user.email;
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
      fetchUserInfo: function () {
        this.isLoadingUserInfo = true;

        let that = this;
        this.$axios.get('/user/me')
          .then(function (response) {
            that.user = response.data;

            // update store and local storage
            that.$store.commit('setUserDetail', that.user);
            localStorage.setItem('tddUserDetail', JSON.stringify(that.user));
          })
          .catch(function (error) {
            if (error.response) {
              if (error.response.data.code === 40102) {
                // user not logged in

                // clear local storage
                localStorage.removeItem('tddUserDetail');

                // set status
                that.$store.commit('setUserLoginStatus', false);
                that.$store.commit('setUserDetail', null);

                that.$message.warn('用户登录失效，请重新登录');

                // go to home page
                that.$router.push('/');
              }
            } else {
              console.log(error);
            }
          })
          .finally(function () {
            that.isLoadingUserInfo = false;
          });
      },
      getRoleTitleColor: function (title) {
        let color = '';
        switch (title) {
          case 'DBA':
            color = 'pink';
            break;
          case '管理员':
            color = 'red';
            break;
          case '普通用户':
            color = 'blue';
            break;
        }
        return color;
      }
    },
    created() {
      this.fetchUserInfo();
    }
  }
</script>