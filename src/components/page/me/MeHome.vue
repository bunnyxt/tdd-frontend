<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>个人中心</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div v-if="!isLoadingUserInfo && !isPremiumUser">
      <a-alert banner closable>
        <a-popover placement="bottom" slot="message">
          <div slot="content">
            您可以通过<b>累计<a href="https://afdian.net/@bunnyxt" target="_blank">资助本站</a>达到50RMB</b>解锁永久高级用户权限！<br>
            作为高级用户，您将得到以下特权：<br>
            <ul style="margin-bottom: 0px">
              <li>
                独特的<span style="color: #722ED1">紫色</span>昵称显示
              </li>
              <li>
                更多的积分与经验收益
              </li>
              <li>
                更多的积分花销折扣
              </li>
              <li>
                在未来可能还会有实体小礼品哦
              </li>
            </ul>
            资助后请及时<router-link to="/about/contactus">联系我们</router-link>，我们将在第一时间为您解锁高级用户权限~
          </div>
          资助本站成为<a>高级会员</a>
        </a-popover>
      </a-alert>
    </div>
    <div class="section-block">
      <div v-if="isLoadingUserInfo">
        <a-spin :spinning="true">
          正在获取用户详情
        </a-spin>
      </div>
      <div v-else>
        <div>
          <div style="overflow: hidden">
            <a-avatar
                :src="avatarUrl"
                :size="48"
                class="me-header-avatar"
                @click="() => avatarSettingPrompt = true"
            />
            <a-modal title="设置头像" v-model="avatarSettingPrompt">
              <template slot="footer">
                <a-button type="primary" @click="() => avatarSettingPrompt = false">了解</a-button>
              </template>
              <a-avatar
                  :src="avatarUrl"
                  :size="64"
                  style="float: right; margin: 0 8px 16px 16px"
              />
              <p>天钿Daily用户头像用Gravatar头像服务，在Gravatar里使用同一个邮箱注册账号，上传头像，这里就能看到自定义头像了~</p>
              <p>第一步：前往<router-link to="/me/setting">设置</router-link>，绑定邮箱</p>
              <p>第二步：前往<a href="http://cn.gravatar.com" target="_blank">Gravatar</a>，使用第一步绑定的邮箱注册账号，上传头像</p>
              <p>第三步：刷新网页，即可显示自定义头像。如果没有显示的话请清空浏览器缓存重试</p>
            </a-modal>
            <div style="float: left; margin-left: 12px">
              <div style="overflow: hidden">
                <div style="font-size: 1.17em; color: rgba(0, 0, 0, 0.85); font-weight: 500; float: left">
                  <span v-if="isPremiumUser" style="color: #722ED1">{{ user.nickname }}</span>
                  <span v-else>{{ user.nickname }}</span>
                </div>
                <div style="float: left; margin-left: 8px">
                  <a-tag v-for="role in user.roles" :key="role.id" :color="getRoleTitleColor(role.title)">
                    <a-popover placement="bottom">
                      <div slot="content">
                        {{ getRoleTitleDescription(role.title) }}
                      </div>
                      {{ role.title }}
                    </a-popover>
                  </a-tag>
                </div>
              </div>
              <div style="margin-top: 4px">
                <a-icon type="pay-circle" style="margin-right: 4px" /> 积分：{{ user.point.toLocaleString() }}
                <a-icon type="rocket" style="margin-left: 12px; margin-right: 4px" /> 经验：{{ user.exp.toLocaleString() }}
              </div>
            </div>
            <div v-if="$store.getters.clientMode !== 'MOBILE'" style="float: right">
              <a-button @click="() => $router.push('me/setting')" style="margin-right: 8px">设置</a-button>
              <a-tooltip placement="bottomRight">
                <template slot="title">
<!--                  <span>TODO 加个日历  可以查</span>-->
                  <div v-if="isLoadingUserSignInOverview || isLoadingUserSignInList">
                    <a-spin />
                  </div>
                  <div v-else>
                    {{ '历史签到' + userSignInOverview.total + '天' }}<br>
                    {{ tmpSignInTooltipStr }}
                  </div>
                </template>
                <a-button
                    type="primary"
                    @click="goSignIn"
                    :disabled="userSignInStatusToday"
                >{{ userSignInStatusToday ? '已签到' : '签到' }}</a-button>
              </a-tooltip>
            </div>
          </div>
        </div>
        <div v-if="$store.getters.clientMode === 'MOBILE'" style="width: 100%; margin-top: 8px; overflow: hidden">
          <div style="float: left; width: 47%; margin-right: 6%">
            <a-button @click="() => $router.push('me/setting')" block>设置</a-button>
          </div>
          <div style="float: left; width: 47%">
            <a-tooltip placement="bottomRight" style="width: 100%">
              <template slot="title">
                <!--                  <span>TODO 加个日历  可以查</span>-->
                <div v-if="isLoadingUserSignInOverview || isLoadingUserSignInList">
                  <a-spin />
                </div>
                <div v-else>
                  {{ '历史签到' + userSignInOverview.total + '天' }}<br>
                  {{ tmpSignInTooltipStr }}
                </div>
              </template>
              <a-button
                  type="primary"
                  @click="goSignIn"
                  :disabled="userSignInStatusToday"
                  block
              >{{ userSignInStatusToday ? '已签到' : '签到' }}</a-button>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <div style="display: flex">
        <a-menu
            class="me-favorite-menu"
            v-model="favoriteCurrent"
            mode="horizontal"
            :style="meFavoriteMenuStyle"
        >
          <a-menu-item key="video"><a-icon type="video-camera" />关注视频</a-menu-item>
          <a-menu-item key="member"><a-icon type="user" />关注UP主</a-menu-item>
        </a-menu>
        <div style="margin-top: 8px">
          <a-button
              size="small"
              @click="() => this.$router.push('/me/favorite/' + this.favoriteCurrent[0])"
              style="margin-top: 4px"
          >{{ moreString }}<a-icon type="arrow-right" /></a-button>
        </div>
      </div>
      <template v-if="favoriteCurrent.includes('video')">
        <a-spin v-if="isLoadingUserFavoriteVideoList" :spinning="true">
          正在获取用户关注视频列表
        </a-spin>
        <tdd-video-list
            v-else
            :video-list="userFavoriteVideoList.slice(0, listColNum)"
            :mode="'grid'"
            @item-clicked="userFavoriteVideoListItemClickedHandler"
        />
      </template>
      <template v-if="favoriteCurrent.includes('member')">
        <a-spin v-if="isLoadingUserFavoriteMemberList" :spinning="true">
          正在获取用户关注P主列表
        </a-spin>
        <tdd-member-list
            v-else
            :member-list="userFavoriteMemberList.slice(0, listColNum)"
            @item-clicked="userFavoriteMemberListItemClickedHandler"
        />
      </template>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      什么什么什么
    </div>
    <div class="section-separator"></div>
  </div>
</template>

<script>
import md5 from 'js-md5';
  import moment from 'moment';
  import TddVideoList from "../../common/TddVideoList";
  import TddMemberList from "../../common/TddMemberList";

export default {
  name: 'MeHome',
  components: {
    TddVideoList,
    TddMemberList
  },
  data: function () {
    return {
      isLoadingUserInfo: false,
      user: {},
      isLoadingUserSignInList: false,
      userSignInList: [],
      isLoadingUserSignInOverview: false,
      userSignInOverview: {},
      isLoadingUserFavoriteVideoList: false,
      userFavoriteVideoList: [],
      isLoadingUserFavoriteMemberList: false,
      userFavoriteMemberList: [],
      isGoingSignIn: false,
      favoriteCurrent: ['video'],
      avatarSettingPrompt: false,
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
    },
    userSignInStatusToday: function () {
      if (this.userSignInOverview) {
        if (this.userSignInOverview.last_added >= Math.floor(moment().startOf('day').valueOf() / 1000)) {
          return true;
        }
      }
      return false;
    },
    tmpSignInTooltipStr: function () {
      let str = '';
      if (this.userSignInStatusToday) {
        let totaySignIn = this.userSignInList[this.userSignInList.length - 1];
        str += '今日已签到，第' + totaySignIn.rank + '名';
      } else {
        str += '今日未签到';
      }
      return str;
    },
    moreString: function () {
      if (this.$store.getters.clientMode === 'MOBILE') {
        return '';
      } else {
        return '更多';
      }
    },
    listColNum: function () {
      let width = this.$store.state.clientWidth; // TODO bug here, in chrome this will cut scrollbar width, about 15px
      if (width < 576) {
        // return 1;
        return 3;
      } else if (width < 768) {
        return 2;
      } else if (width < 992) {
        return 3;
      } else if (width < 1200) {
        return 3;
      } else if (width < 1600) {
        return 4;
      } else {
        return 6;
      }
    },
    meFavoriteMenuStyle: function () {
      let style = {};
      if (this.$store.getters.clientMode !== 'MOBILE') {
        style['margin-bottom'] = '12px';
      }
      return style;
    },
    isPremiumUser: function () {
      if (!this.user) {
        return false;
      }
      for (let role of this.user.roles) {
        if (role.title === '高级用户') {
          return true;
        }
      }
      return false;
    }
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
    fetchUserSignInList: function () {
      this.isLoadingUserSignInList = true;

      let that = this;
      this.$axios.get('/user/signin/me')
          .then(function (response) {
            that.userSignInList = response.data;
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
          })
          .finally(function () {
            that.isLoadingUserSignInList = false;
          });
    },
    fetchUserSignInOverview: function () {
      this.isLoadingUserSignInOverview = true;

      let that = this;
      this.$axios.get('/user/signin/overview/me')
          .then(function (response) {
            that.userSignInOverview = response.data;
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
          })
          .finally(function () {
            that.isLoadingUserSignInOverview = false;
          });
    },
    fetchUserFavoriteVideoList: function () {
      this.isLoadingUserFavoriteVideoList = true;

      let that = this;
      this.$axios.get('/user/favorite/video/me')
          .then(function (response) {
            that.userFavoriteVideoList = [];
            let oriList = response.data;
            for (let item of oriList) {
              let obj = item.video;
              obj.favorite_added = item.added;
              that.userFavoriteVideoList.push(obj);
            }
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
          })
          .finally(function () {
            that.isLoadingUserFavoriteVideoList = false;
          });
    },
    fetchUserFavoriteMemberList: function () {
      this.isLoadingUserFavoriteMemberList = true;

      let that = this;
      this.$axios.get('/user/favorite/member/me')
          .then(function (response) {
            that.userFavoriteMemberList = [];
            let oriList = response.data;
            for (let item of oriList) {
              let obj = item.member;
              obj.favorite_added = item.added;
              that.userFavoriteMemberList.push(obj);
            }
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
          })
          .finally(function () {
            that.isLoadingUserFavoriteMemberList = false;
          });
    },
    goSignIn: function () {
      this.isGoingSignIn = true;
      let that = this;
      this.$axios.post('/user/signin')
          .then(function (response) {
            const resp = response.data;
            if (resp.status === 'success') {
              that.$message.info(`签到成功！今日第${resp.detail.rank}名`);
              that.$message.info(`连续签到${resp.detail.consecutive_days}天，积分+${resp.detail.point}，经验+${resp.detail.exp}`);

              // update info
              that.user.point += resp.detail.point;
              that.user.exp += resp.detail.exp;
              that.fetchUserSignInList();
              that.fetchUserSignInOverview();
            } else if (resp.status === 'fail') {
              if (resp.message === 'user have already signed in today') {
                that.$message.warn('今天已经签过到了——');
              } else {
                that.$message.error('签到失败');
                that.$message.error(resp);
              }
            } else {
              that.$message.error('签到失败');
              that.$message.error(resp);
            }
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
          })
          .finally(function () {
            that.isGoingSignIn = false;
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
        case '高级用户':
          color = 'purple';
          break;
      }
      return color;
    },
    getRoleTitleDescription: function (title) {
      let description = '';
      switch (title) {
        case 'DBA':
          description = '作为数据库管理员，您拥有系统的全部权限，请谨慎使用';
          break;
        case '管理员':
          description = '作为管理员，您可以进入后台管理系统，查看系统数据';
          break;
        case '普通用户':
          description = '作为普通用户，您可以关注视频/UP主，参与视频标签修改矫正，甚至自定义监测视频数据';
          break;
        case '高级用户':
          description = '感谢您对本平台的资助！作为高级用户，您将拥有更多的积分与经验收益，更多的积分花销折扣，在未来可能还会有实体小礼品哦~';
          break;
      }
      return description;
    },
    userFavoriteVideoListItemClickedHandler: function (item) {
      this.$store.commit('setVideoDetailDrawerVideo', item);
      this.$store.commit('setVideoDetailDrawerVisibility', true);
    },
    userFavoriteMemberListItemClickedHandler: function (item) {
      this.$store.commit('setMemberDetailMember', item);
      this.$router.push('member/' + item.mid);
    }
  },
  created() {
    let that = this;
    this.fetchUserInfo()
        .then(function () {
          that.fetchUserSignInList();
          that.fetchUserSignInOverview();
          that.fetchUserFavoriteVideoList();
          that.fetchUserFavoriteMemberList();
        });
  }
}
</script>

<style scoped>
.me-favorite-menu {
  flex-grow: 1;
}
.me-header-avatar {
  float: left;
  cursor: pointer;
  /* TODO why transition not works? */
  /*transition: all .2s ease-out;*/
  /*-moz-transition: all .2s ease-out;*/
  /*-webkit-transition: all .2s ease-out;*/
  /*-o-transition: all .2s ease-out;*/
}
.me-header-avatar :hover {
  opacity: 0.6;
}
</style>
