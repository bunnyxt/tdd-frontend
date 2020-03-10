<template>
  <div>
    <div v-wechat-title="$route.meta.title='av'+aid+' - 视频详情 - 天钿Daily'"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/video">视频</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>av{{ aid }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div v-if="isLoadingVideo">
      <div class="section-block">
        <a-spin :spinning="true">
          正在获取<a :href="'https://www.bilibili.com/video/av' + this.$route.params.aid" target="_blank">av{{ this.$route.params.aid }}</a>的视频信息
        </a-spin>
      </div>
    </div>
    <div v-else>
      <div v-if="!video || Object.keys(video).length === 0">
        <div class="section-block">
          <p>没有找到<a :href="'https://www.bilibili.com/video/av' + this.$route.params.aid" target="_blank">av{{ this.$route.params.aid }}</a>的视频信息</p>
          <p>可能是因为该视频不在本站收录范围内</p>
          <a @click="$router.go(-1)">返回上一页</a>
        </div>
      </div>
      <div v-else>
        <div v-wechat-title="$route.meta.title=video.title+' - 视频详情 - 天钿Daily'"></div>
        <div class="section-block">
          <div v-if="$store.getters.clientMode === 'MOBILE'">
            <img :src="video.pic" alt="pic" width="100%" style="margin-bottom: 8px"/>
          </div>
          <div v-else>
            <img :src="video.pic" alt="pic" width="250px" style="float: right"/>
          </div>
          <div :style="titleDivStyle">
            <h3 style="margin-bottom: 14px">{{ video.title }}</h3>
            <div style="overflow: hidden">
              <div style="float: left; margin-right: 20px; margin-bottom: 12px">
                <a-avatar
                    size="small"
                    :src="video.member
                      ? video.member.face
                      : 'https://static.hdslb.com/images/member/noface.gif'"
                    style="margin-right:12px"
                />
                <a @click="videoMemberNameClickHandler(video.mid)">
                  {{ video.member ? video.member.name : 'mid_'+video.mid}}
                </a>
              </div>
              <div v-if="video.hasstaff === 1" style="float: left; margin-bottom: 12px">
                <a-dropdown :trigger="['click']" placement="bottomCenter">
                  <a class="ant-dropdown-link" href="#">创作团队 ({{ video.staff.length }}) <a-icon type="down" /> </a>
                  <a-menu slot="overlay">
                    <template v-for="staff in video.staff.filter( s => s.title === 'UP主')">
                      <a-menu-item :key="staff.mid">
                        <a @click="videoMemberNameClickHandler(staff.mid)">
                          <a-avatar size="small" :src="staff.face" style="margin-right: 8px" />
                          {{ staff.name }}<a-tag :color="getStaffTitleColor(staff.title)" style="margin-left: 8px">{{ staff.title }}</a-tag>
                        </a>
                      </a-menu-item>
                    </template>
                    <template v-for="staff in video.staff.filter( s => s.title !== 'UP主')">
                      <a-menu-item :key="staff.mid">
                        <a @click="videoMemberNameClickHandler(staff.mid)">
                          <a-avatar size="small" :src="staff.face" style="margin-right: 8px" />
                          {{ staff.name }}<a-tag :color="getStaffTitleColor(staff.title)" style="margin-left: 8px">{{ staff.title }}</a-tag>
                        </a>
                      </a-menu-item>
                    </template>
                  </a-menu>
                </a-dropdown>
              </div>
            </div>
            <p><a-icon type="calendar" style="margin-right: 12px"/>{{ $util.tsToDateString(video.pubdate) }}</p>
            <p><a-icon type="database" style="margin-right: 12px"/>{{ video.tname }}</p>
            <div :style="actionBarStyle">
              <a-button
                  style="float: left; width: 31%"
                  :loading="isPostingVideoLike || isDeletingVideoLike"
                  @click="videoLikeButtonClickHandler(video.aid)"
              >
                <span :style="videoLikeDisplayStyle"><a-icon type="like" /> {{ videoLikeCount }}</span>
              </a-button>
              <a-button
                  style="float: left; width: 31%; margin: 0 8px"
                  :loading="isPostingVideoFavorite || isDeletingVideoFavorite"
                  @click="videoFavoriteButtonClickHandler(video.aid)"
              >
                <span :style="videoFavoriteDisplayStyle"><a-icon type="plus" /> {{ videoFavoriteCount }}</span>
              </a-button>
              <a-button
                  style="float: left; width: 31%"
                  @click="goToBiliAv(video.aid)"
              >
                <a-icon type="play-circle" />
              </a-button>
            </div>
            <div style="margin-bottom: 12px">
              <a-tag v-for="tag in $util.getTagList(video)" :key="tag.title" :color="tag.color" style="margin-bottom: 4px">{{ tag.title }}</a-tag>
            </div>
          </div>
          <a-divider orientation="left">简介</a-divider>
          <tdd-video-description :description="video.desc" />
          <a-divider orientation="left">标签</a-divider>
          <a-tag
              v-for="tag in video.tags
                  ? video.tags.split(';').slice(0, -1)
                  : []"
              :key="tag"
              style="margin-bottom: 4px"
          >
            {{ tag }}
          </a-tag>
          <a-divider orientation="left">数据</a-divider>
          <div v-if="video.laststat">
            <tdd-video-stat-bar :stat="video.laststat" :show-name="true" :mode="'vertical'"></tdd-video-stat-bar>
            *{{ $util.tsToDateString(video.laststat.added) }}更新
          </div>
          <div v-else>
            <a-alert type="error" message="暂无数据" />
          </div>
        </div>
        <div class="section-separator"></div>
        <div class="section-block">
          <div v-if="isLoadingVideoRecords">
            <a-spin :spinning="true">
              正在获取<a :href="'https://www.bilibili.com/video/av' + this.$route.params.aid" target="_blank">av{{ this.$route.params.aid }}</a>的历史数据
            </a-spin>
          </div>
          <div v-else>
            <div v-if="videoRecords.length === 0">
              <a-alert banner>
                没有找到<a :href="'https://www.bilibili.com/video/av' + this.$route.params.aid" target="_blank">av{{ this.$route.params.aid }}</a>的历史数据
              </a-alert>
            </div>
            <div v-else>
              <a-menu v-model="currentDataCategory" mode="horizontal" style="margin-bottom: 16px">
                <a-menu-item key="recordChart"> <a-icon type="line-chart" />历史趋势 </a-menu-item>
                <a-menu-item key="recordTable"> <a-icon type="table" />详细数据 </a-menu-item>
                <a-menu-item key="zkCalc"> <a-icon type="calculator" />周刊算分 </a-menu-item>
                <a-menu-item key="recordSaver"> <a-icon type="download" />数据下载 </a-menu-item>
              </a-menu>
              <div v-show="currentDataCategory.indexOf('recordChart') !== -1">
                <template v-if="recordChartEnterCount">
                  <video-detail-history-line-chart :videoRecords="videoRecords" />
                </template>
              </div>
              <div v-show="currentDataCategory.indexOf('recordTable') !== -1">
                <video-detail-history-table :video-records="videoRecords" />
              </div>
              <div v-show="currentDataCategory.indexOf('zkCalc') !== -1">
                <tdd-video-record-zk-calc :video-records="videoRecords" :page="video ? video.videos : 1" :pubdate="video ? video.pubdate : null" />
              </div>
              <div v-show="currentDataCategory.indexOf('recordSaver') !== -1">
                <tdd-video-record-saver :video-records="videoRecords" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoDetailHistoryLineChart from "./VideoDetailHistoryLineChart";
import VideoDetailHistoryTable from "./VideoDetailHistoryTable";
import TddVideoRecordSaver from "../../common/TddVideoRecordSaver";
import TddVideoRecordZkCalc from "../../common/TddVideoRecordZkCalc";
import TddVideoDescription from "../../common/TddVideoDescription";
import TddVideoStatBar from "../../common/TddVideoStatBar";

export default {
  name: 'VideoDetail',
  components: {
    VideoDetailHistoryLineChart,
    VideoDetailHistoryTable,
    TddVideoRecordSaver,
    TddVideoRecordZkCalc,
    TddVideoDescription,
    TddVideoStatBar
  },
  data: function() {
    return {
      video: null,
      videoRecords: null,
      isLoadingVideo: false,
      isLoadingVideoRecords: false,
      currentDataCategory: ['recordChart'],
      recordChartEnterCount: 1,

      isLoadingVideoFavoriteCount: false,
      videoFavoriteCount: 0,
      isLoadingVideoFavoriteUserStatus: false,
      isPostingVideoFavorite: false,
      isDeletingVideoFavorite: false,
      videoFavoriteUserStatus: false,

      isLoadingVideoLikeCount: false,
      videoLikeCount: 0,
      isLoadingVideoLikeUserStatus: false,
      isPostingVideoLike: false,
      isDeletingVideoLike: false,
      videoLikeUserStatus: false
    }
  },
  computed: {
    aid: function() {
     return this.$route.params.aid;
    },
    titleDivStyle: function () {
      let style = {};
      if (this.$store.getters.clientMode !== 'MOBILE') {
        style['float'] = 'left';
        style['width'] = 'calc(100% - 250px - 12px)';
      }
      return style;
    },
    _clientMode: function () {
      return this.$store.getters.clientMode;
    },
    _isUserLoggedIn: function () {
      return this.$store.state.isUserLoggedIn;
    },
    actionBarStyle: function () {
      let style = {overflow: 'hidden', ['margin-top']: '8px', ['margin-bottom']: '12px'};
      if (this.$store.getters.clientMode !== 'MOBILE') {
        style['max-width'] = '320px';
      } else {
        style['width'] = '100%';
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
    videoFavoriteDisplayStyle: function () {
      let style = {};
      if (this.$store.state.isUserLoggedIn && this.videoFavoriteUserStatus) {
        style.color = '#1890ff';
      }
      return style;
    }
  },
  watch: {
    aid: function(newAid) {
      this.getVideoInfo(newAid);
      this.getVideoLikeCount(newAid);
      this.getVideoFavoriteCount(newAid);
      if (this.$store.state.isUserLoggedIn) {
        this.getVideoLikeUserStatus(newAid);
        this.getVideoFavoriteUserStatus(newAid);
      }
    },
    videoRecords: function() {

    },
    currentDataCategory: function () {
      if (this.currentDataCategory.indexOf('recordChart') !== -1) {
        this.recordChartEnterCount++;
      }
    },
    _clientMode: function () {
      this.recordChartEnterCount = 0;
      if (this.currentDataCategory.indexOf('recordChart') !== -1) {
        this.recordChartEnterCount++;
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
    getVideoInfo: function(aid, checkVideoFromStore=false) {
      this.isLoadingVideo = true;
      this.isLoadingVideoRecords = true;

      // check video from store
      let videoLoadedFromStore = false;
      if (checkVideoFromStore) {
        let video = this.$store.state.videoDetailVideo;
        if (video && video.aid === aid) {
          this.video = video;
          // this.$store.commit('setVideoDetailVideo', null);
          videoLoadedFromStore = true;
          this.isLoadingVideo = false;
        }
      }

      let that = this;
      if (!videoLoadedFromStore) {
        this.$axios.get('video/' + aid)
          .then(function (response) {
            that.video = response.data;
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            that.isLoadingVideo = false;
          });
      }

      this.$axios.get('video/' + aid + '/record')
        .then(function (response) {
          that.videoRecords = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingVideoRecords = false;
        });
    },
    getStaffTitleColor: function (title) {
      let color = '';
      switch (title) {
        case 'UP主':
          color = 'red';
          break;
        case '作词':
        case '填词':
          color = 'pink';
          break;
        case '作曲':
        case '编曲':
          color = 'orange';
          break;
        case '调校':
        case '调教':
        case '调音':
          color = 'green';
          break;
        case '曲绘':
          color = 'cyan';
          break;
        case '策划':
          color = 'blue';
          break;
        case '视频制作':
        case '剪辑':
        case '字幕':
          color = 'purple';
          break;
      }
      return color;
    },
    videoMemberNameClickHandler: function (mid) {
      this.$router.push('/member/' + mid);
    },
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
  created: function() {
    this.getVideoInfo(this.aid, true);
    this.getVideoLikeCount(this.aid);
    this.getVideoFavoriteCount(this.aid);
    if (this.$store.state.isUserLoggedIn) {
      this.getVideoFavoriteUserStatus(this.aid);
      this.getVideoLikeUserStatus(this.aid);
    }
  },
  mounted: function () {

  }
}
</script>

<style scoped>
  .stat-item {
    white-space: nowrap;
  }
  .stat-item-icon {
    margin-right: 8px;
  }
</style>