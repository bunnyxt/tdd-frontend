<template>
  <div class="member-action-bar" :style="actionBarStyle">
    <a-button
      title="点赞"
      :style="memberLikeButtonStyle"
      :loading="isLoadingMemberLikeCount || isPostingMemberLike || isDeletingMemberLike"
      @click="memberLikeButtonClickHandler(mid)"
    >
      <span :style="memberLikeDisplayStyle"><a-icon type="like" /> {{ memberLikeCount }}</span>
    </a-button>
    <a-button
      title="关注"
      :style="memberFavoriteButtonStyle"
      :loading="isLoadingMemberFavoriteCount || isPostingMemberFavorite || isDeletingMemberFavorite"
      @click="memberFavoriteButtonClickHandler(mid)"
    >
      <span :style="memberFavoriteDisplayStyle"><a-icon type="plus" /> {{ memberFavoriteCount }}</span>
    </a-button>
    <a-button
      title="前往UP主B站个人空间"
      :style="memberHomeButtonStyle"
      @click="goToBiliSpace(mid)"
    >
      <a-icon type="home" />
    </a-button>
  </div>
</template>

<script>
export default {
  name: 'TddMemberActionBar',
  props: {
    mid: {
      type: Number,
      required: true
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      isLoadingMemberLikeCount: false,
      memberLikeCount: 0,
      isLoadingMemberLikeUserStatus: false,
      isPostingMemberLike: false,
      isDeletingMemberLike: false,
      memberLikeUserStatus: false,

      isLoadingMemberFavoriteCount: false,
      memberFavoriteCount: 0,
      isLoadingMemberFavoriteUserStatus: false,
      isPostingMemberFavorite: false,
      isDeletingMemberFavorite: false,
      memberFavoriteUserStatus: false,
    }
  },
  computed: {
    _isUserLoggedIn: function () {
      return this.$store.state.isUserLoggedIn;
    },
    actionBarStyle: function () {
      let style = {};
      if (this.$store.getters.clientMode !== 'MOBILE') {
        style['max-width'] = '320px';
      } else {
        style['width'] = '100%';
      }
      return style;
    },
    memberLikeButtonStyle: function () {
      let style = { float: 'left' };
      if (this.small) {
        style.width = '48%';
      } else {
        style.width = '31%';
      }
      return style;
    },
    memberLikeDisplayStyle: function () {
      let style = {};
      if (this.$store.state.isUserLoggedIn && this.memberLikeUserStatus) {
        style.color = '#1890ff';
      }
      return style;
    },
    memberFavoriteButtonStyle: function () {
      let style = { float: 'left' };
      if (this.small) {
        style.marginLeft = '4%';
        style.width = '48%';
      } else {
        style.width = '31%';
        style.marginLeft = '3.5%';
        style.marginRight = '3.5%';
      }
      return style;
    },
    memberFavoriteDisplayStyle: function () {
      let style = {};
      if (this.$store.state.isUserLoggedIn && this.memberFavoriteUserStatus) {
        style.color = '#1890ff';
      }
      return style;
    },
    memberHomeButtonStyle: function () {
      let style = { float: 'left' };
      if (this.small) {
        style.width = '100%';
        style.marginTop = '6px';
      } else {
        style.width = '31%';
      }
      return style;
    }
  },
  watch: {
    mid: function () {
      this.getMemberLikeCount(this.mid);
      this.getMemberFavoriteCount(this.mid);
      if (this.$store.state.isUserLoggedIn) {
        this.getMemberLikeUserStatus(this.mid);
        this.getMemberFavoriteUserStatus(this.mid);
      }
    },
    _isUserLoggedIn: function () {
      if (this.$store.state.isUserLoggedIn) {
        this.getMemberLikeUserStatus(this.mid);
        this.getMemberFavoriteUserStatus(this.mid);
      }
    }
  },
  methods: {
    memberLikeButtonClickHandler: function (mid) {
      if (this.$store.state.isUserLoggedIn) {
        if (this.memberLikeUserStatus) {
          this.deleteMemberLike(mid);
        } else {
          this.postMemberLike(mid);
        }
      } else {
        this.$message.warn('用户未登录，请登录后再操作~');
        this.$store.commit('setLoginSliderVisibility', true);
      }
    },
    memberFavoriteButtonClickHandler: function (mid) {
      if (this.$store.state.isUserLoggedIn) {
        if (this.memberFavoriteUserStatus) {
          this.deleteMemberFavorite(mid);
        } else {
          this.postMemberFavorite(mid);
        }
      } else {
        this.$message.warn('用户未登录，请登录后再操作~');
        this.$store.commit('setLoginSliderVisibility', true);
      }
    },
    postMemberLike: function (mid) {
      this.isPostingMemberLike = true;

      let that = this;
      this.$axios.post('user/like/member/' + mid)
        .then(function (response) {
          const resp = response.data;
          if (resp.status === 'success') {
            // that.$message.info('点赞成功！');
            that.memberLikeUserStatus = true;
            that.memberLikeCount++;
          } else {
            // that.$message.error('点赞失败！' + resp.message);
          }
        })
        .catch(function (error) {
          if (error.response) {
            if (error.response.data.code === 40102) {
              that.$util.tddErrorHandler40102(that, false);
            } else {
              console.log(error.response);
            }
          } else {
            console.log(error);
          }
        })
        .finally(function () {
          that.isPostingMemberLike = false;
        });
    },
    deleteMemberLike: function (mid) {
      this.isDeletingMemberLike = true;

      let that = this;
      this.$axios.delete('user/like/member/' + mid)
        .then(function (response) {
          const resp = response.data;
          if (resp.status === 'success') {
            // that.$message.info('取消点赞成功！');
            that.memberLikeUserStatus = false;
            that.memberLikeCount--;
          } else {
            // that.$message.error('取消点赞失败！' + resp.message);
          }
        })
        .catch(function (error) {
          if (error.response) {
            if (error.response.data.code === 40102) {
              that.$util.tddErrorHandler40102(that, false);
            } else {
              console.log(error.response);
            }
          } else {
            console.log(error);
          }
        })
        .finally(function () {
          that.isDeletingMemberLike = false;
        });
    },
    postMemberFavorite: function (mid) {
      this.isPostingMemberFavorite = true;

      let that = this;
      this.$axios.post('user/favorite/member/' + mid)
        .then(function (response) {
          const resp = response.data;
          if (resp.status === 'success') {
            that.$message.info('关注成功！');
            that.memberFavoriteUserStatus = true;
            that.memberFavoriteCount++;
          } else {
            that.$message.error('关注失败！' + resp.message);
          }
        })
        .catch(function (error) {
          if (error.response) {
            if (error.response.data.code === 40102) {
              that.$util.tddErrorHandler40102(that, false);
            } else {
              console.log(error.response);
            }
          } else {
            console.log(error);
          }
        })
        .finally(function () {
          that.isPostingMemberFavorite = false;
        });
    },
    deleteMemberFavorite: function (mid) {
      this.isDeletingMemberFavorite = true;

      let that = this;
      this.$axios.delete('user/favorite/member/' + mid)
        .then(function (response) {
          const resp = response.data;
          if (resp.status === 'success') {
            that.$message.info('取消关注成功！');
            that.memberFavoriteUserStatus = false;
            that.memberFavoriteCount--;
          } else {
            that.$message.error('取消关注失败！' + resp.message);
          }
        })
        .catch(function (error) {
          if (error.response) {
            if (error.response.data.code === 40102) {
              that.$util.tddErrorHandler40102(that, false);
            } else {
              console.log(error.response);
            }
          } else {
            console.log(error);
          }
        })
        .finally(function () {
          that.isDeletingMemberFavorite = false;
        });
    },
    goToBiliSpace: function (mid) {
      window.open('https://space.bilibili.com/'+mid);
    },
    getMemberLikeCount: function (mid) {
      this.isLoadingMemberLikeCount = true;

      let that = this;
      this.$axios.get('member/' + mid + '/like')
        .then(function (response) {
          that.memberLikeCount = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingMemberLikeCount = false;
        });
    },
    getMemberLikeUserStatus: function (mid) {
      this.isLoadingMemberLikeUserStatus = true;

      let that = this;
      this.$axios.get('/user/like/member/' + mid)
        .then(function (response) {
          that.memberLikeUserStatus = Object.keys(response.data).length > 0;
        })
        .catch(function (error) {
          if (error.response) {
            if (error.response.data.code === 40102) {
              that.$util.tddErrorHandler40102(that, false);
            } else {
              console.log(error.response);
            }
          } else {
            console.log(error);
          }
        })
        .finally(function () {
          that.isLoadingMemberLikeUserStatus = false;
        });
    },
    getMemberFavoriteCount: function (mid) {
      this.isLoadingMemberFavoriteCount = true;

      let that = this;
      this.$axios.get('member/' + mid + '/favorite')
        .then(function (response) {
          that.memberFavoriteCount = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingMemberFavoriteCount = false;
        });
    },
    getMemberFavoriteUserStatus: function (mid) {
      this.isLoadingMemberFavoriteUserStatus = true;

      let that = this;
      this.$axios.get('/user/favorite/member/' + mid)
        .then(function (response) {
          that.memberFavoriteUserStatus = Object.keys(response.data).length > 0;
        })
        .catch(function (error) {
          if (error.response) {
            if (error.response.data.code === 40102) {
              that.$util.tddErrorHandler40102(that, false);
            } else {
              console.log(error.response);
            }
          } else {
            console.log(error);
          }
        })
        .finally(function () {
          that.isLoadingMemberFavoriteUserStatus = false;
        });
    }
  },
  created: function () {
    this.getMemberLikeCount(this.mid);
    this.getMemberFavoriteCount(this.mid);
    if (this.$store.state.isUserLoggedIn) {
      this.getMemberFavoriteUserStatus(this.mid);
      this.getMemberLikeUserStatus(this.mid);
    }
  },
}
</script>

<style scoped>
.member-action-bar {
  overflow: hidden;
  margin-top: 8px;
  margin-bottom: 12px;
}
</style>
