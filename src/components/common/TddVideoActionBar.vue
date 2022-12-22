<i18n>
{
  "zh": {
    "go_like": "点赞",
    "go_follow": "关注",
    "go_bilibili_watch": "去B站观看"
  },
  "en": {
    "go_like": "Like",
    "go_follow": "Follow",
    "go_bilibili_watch": "Watch On Bilibili"
  }
}
</i18n>

<template>
  <div class="video-action-bar" :style="actionBarStyle">
    <a-button
      :title="$t('go_like')"
      :style="videoLikeButtonStyle"
      :loading="isLoadingVideoLikeCount || isPostingVideoLike || isDeletingVideoLike"
      @click="videoLikeButtonClickHandler(aid)"
    >
      <span :style="videoLikeDisplayStyle"><like-outlined /> {{ videoLikeCount }}</span>
    </a-button>
    <a-button
      :title="$t('go_follow')"
      :style="videoFavoriteButtonStyle"
      :loading="isLoadingVideoFavoriteCount || isPostingVideoFavorite || isDeletingVideoFavorite"
      @click="videoFavoriteButtonClickHandler(aid)"
    >
      <span :style="videoFavoriteDisplayStyle"><plus-outlined /> {{ videoFavoriteCount }}</span>
    </a-button>
    <a-button
      class="bili-btn"
      :title="$t('go_bilibili_watch')"
      :style="videoPlayButtonStyle"
      @click="goToBiliAv(aid)"
    >
      <play-circle-outlined />
    </a-button>
  </div>
</template>

<script>
import { LikeOutlined, PlusOutlined, PlayCircleOutlined } from '@ant-design/icons-vue';

export default {
  name: 'TddVideoActionBar',
  components: {
    LikeOutlined,
    PlusOutlined,
    PlayCircleOutlined,
  },
  props: {
    aid: {
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
      isLoadingVideoLikeCount: false,
      videoLikeCount: 0,
      isLoadingVideoLikeUserStatus: false,
      isPostingVideoLike: false,
      isDeletingVideoLike: false,
      videoLikeUserStatus: false,

      isLoadingVideoFavoriteCount: false,
      videoFavoriteCount: 0,
      isLoadingVideoFavoriteUserStatus: false,
      isPostingVideoFavorite: false,
      isDeletingVideoFavorite: false,
      videoFavoriteUserStatus: false,
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
    videoLikeButtonStyle: function () {
      let style = { float: 'left' };
      if (this.small) {
        style.width = '48%';
      } else {
        style.width = '31%';
      }
      return style;
    },
    videoLikeDisplayStyle: function () {
      let style = {};
      if (this.$store.state.isUserLoggedIn && this.videoLikeUserStatus) {
        style.color = '#1890ff';
      }
      return style;
    },
    videoFavoriteButtonStyle: function () {
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
    videoFavoriteDisplayStyle: function () {
      let style = {};
      if (this.$store.state.isUserLoggedIn && this.videoFavoriteUserStatus) {
        style.color = '#1890ff';
      }
      return style;
    },
    videoPlayButtonStyle: function () {
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
    aid: function () {
      this.getVideoLikeCount(this.aid);
      this.getVideoFavoriteCount(this.aid);
      if (this.$store.state.isUserLoggedIn) {
        this.getVideoLikeUserStatus(this.aid);
        this.getVideoFavoriteUserStatus(this.aid);
      }
    },
    _isUserLoggedIn: function () {
      if (this.$store.state.isUserLoggedIn) {
        this.getVideoLikeUserStatus(this.aid);
        this.getVideoFavoriteUserStatus(this.aid);
      }
    }
  },
  methods: {
    videoLikeButtonClickHandler: function (aid) {
      if (this.$store.state.isUserLoggedIn) {
        if (this.videoLikeUserStatus) {
          this.deleteVideoLike(aid);
        } else {
          this.postVideoLike(aid);
        }
      } else {
        this.$message.warn('用户未登录，请登录后再操作~');
        this.$store.commit('setLoginSliderVisibility', true);
      }
    },
    videoFavoriteButtonClickHandler: function (aid) {
      if (this.$store.state.isUserLoggedIn) {
        if (this.videoFavoriteUserStatus) {
          this.deleteVideoFavorite(aid);
        } else {
          this.postVideoFavorite(aid);
        }
      } else {
        this.$message.warn('用户未登录，请登录后再操作~');
        this.$store.commit('setLoginSliderVisibility', true);
      }
    },
    postVideoLike: function (aid) {
      this.isPostingVideoLike = true;

      let that = this;
      this.$axios.post('user/like/video/' + aid)
        .then(function (response) {
          const resp = response.data;
          if (resp.status === 'success') {
            // that.$message.info('点赞成功！');
            that.videoLikeUserStatus = true;
            that.videoLikeCount++;
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
          that.isPostingVideoLike = false;
        });
    },
    deleteVideoLike: function (aid) {
      this.isDeletingVideoLike = true;

      let that = this;
      this.$axios.delete('user/like/video/' + aid)
        .then(function (response) {
          const resp = response.data;
          if (resp.status === 'success') {
            // that.$message.info('取消点赞成功！');
            that.videoLikeUserStatus = false;
            that.videoLikeCount--;
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
          that.isDeletingVideoLike = false;
        });
    },
    postVideoFavorite: function (aid) {
      this.isPostingVideoFavorite = true;

      let that = this;
      this.$axios.post('user/favorite/video/' + aid)
        .then(function (response) {
          const resp = response.data;
          if (resp.status === 'success') {
            that.$message.info('关注成功！');
            that.videoFavoriteUserStatus = true;
            that.videoFavoriteCount++;
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
          that.isPostingVideoFavorite = false;
        });
    },
    deleteVideoFavorite: function (aid) {
      this.isDeletingVideoFavorite = true;

      let that = this;
      this.$axios.delete('user/favorite/video/' + aid)
        .then(function (response) {
          const resp = response.data;
          if (resp.status === 'success') {
            that.$message.info('取消关注成功！');
            that.videoFavoriteUserStatus = false;
            that.videoFavoriteCount--;
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
          that.isDeletingVideoFavorite = false;
        });
    },
    goToBiliAv: function (aid) {
      this.$service.reportInteraction('video_action_bar_go_to_bili_video', JSON.stringify({ aid }));
      window.open('https://www.bilibili.com/video/av'+aid);
    },
    getVideoLikeCount: function (aid) {
      this.isLoadingVideoLikeCount = true;

      let that = this;
      this.$axios.get('video/' + aid + '/like')
        .then(function (response) {
          that.videoLikeCount = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingVideoLikeCount = false;
        });
    },
    getVideoLikeUserStatus: function (aid) {
      this.isLoadingVideoLikeUserStatus = true;

      let that = this;
      this.$axios.get('/user/like/video/' + aid)
        .then(function (response) {
          that.videoLikeUserStatus = Object.keys(response.data).length > 0;
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
          that.isLoadingVideoLikeUserStatus = false;
        });
    },
    getVideoFavoriteCount: function (aid) {
      this.isLoadingVideoFavoriteCount = true;

      let that = this;
      this.$axios.get('video/' + aid + '/favorite')
        .then(function (response) {
          that.videoFavoriteCount = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingVideoFavoriteCount = false;
        });
    },
    getVideoFavoriteUserStatus: function (aid) {
      this.isLoadingVideoFavoriteUserStatus = true;

      let that = this;
      this.$axios.get('/user/favorite/video/' + aid)
        .then(function (response) {
          that.videoFavoriteUserStatus = Object.keys(response.data).length > 0;
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
          that.isLoadingVideoFavoriteUserStatus = false;
        });
    }
  },
  created: function () {
    this.getVideoLikeCount(this.aid);
    this.getVideoFavoriteCount(this.aid);
    if (this.$store.state.isUserLoggedIn) {
      this.getVideoFavoriteUserStatus(this.aid);
      this.getVideoLikeUserStatus(this.aid);
    }
  },
}
</script>

<style scoped>
.video-action-bar {
  overflow: hidden;
  margin-top: 8px;
  margin-bottom: 12px;
}
</style>
