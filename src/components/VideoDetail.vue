<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <div v-wechat-title="$route.meta.title='av'+aid+' - 视频详情 - 天钿Daily'"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/video">所有视频</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>av{{ aid }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div v-if="isLoading">
      <div class="section-block">
        <a-spin :spinning="isLoading">
          正在获取<a :href="'https://www.bilibili.com/video/av' + this.$route.params.aid" target="_blank">av{{ this.$route.params.aid }}</a>的详细数据
        </a-spin>
      </div>
    </div>
    <div v-else>
      <div v-if="Object.keys(video).length === 0">
        <div class="section-block">
          <p>没有找到<a :href="'https://www.bilibili.com/video/av' + this.$route.params.aid" target="_blank">av{{ this.$route.params.aid }}</a>的详细数据</p>
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
            <p>
              <a-avatar
                  size="small"
                  :src="video.member
                    ? video.member.face
                    : 'https://static.hdslb.com/images/member/noface.gif'"
                  style="margin-right:12px"
              />
              <a :href="'https://space.bilibili.com/'+video.mid" target="_blank">
                {{ video.member ? video.member.name : 'mid'+video.mid}}
              </a>
            </p>
            <div v-if="video.hasstaff === 1">
              <p>
                <a-collapse>
                  <a-collapse-panel :header="'创作团队 ('+video.staff.length+')'">
                    <table cellpadding="4px">
                      <tr v-for="staff in video.staff" :key="staff.mid">
                        <td>
                          <a-avatar
                              size="small"
                              :src="staff.face"
                          />
                        </td>
                        <td>
                          <a :href="'https://space.bilibili.com/'+staff.mid" target="_blank">
                            {{ staff.name }}
                          </a>
                        </td>
                        <td>
                          {{ staff.title }}
                        </td>
                      </tr>
                    </table>
                  </a-collapse-panel>
                </a-collapse>
              </p>
            </div>
            <p><a-icon type="calendar" style="margin-right: 12px"/>{{ $util.tsToDateString(video.pubdate) }}</p>
            <p><a-icon type="database" style="margin-right: 12px"/>{{ video.tname }}</p>
            <p><a-icon type="play-circle" style="margin-right: 12px"/><a :href="'https://www.bilibili.com/video/av'+video.aid" target="_blank">去B站观看</a></p>
            <div style="margin-bottom: 12px">
              <a-tag v-for="tag in $util.getTagList(video)" :key="tag.title" :color="tag.color">{{ tag.title }}</a-tag>
            </div>
          </div>
          <a-divider orientation="left">简介</a-divider>
          {{ video.desc }}
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
            <ul style="padding-left: 20px">
              <li><a-icon type="play-circle" class="stat-item-icon" />播放：{{ video.laststat.view }}</li>
              <li><a-icon type="profile" class="stat-item-icon" />弹幕：{{ video.laststat.danmaku }}</li>
              <li><a-icon type="message" class="stat-item-icon" />评论：{{ video.laststat.reply }}</li>
              <li><a-icon type="star" class="stat-item-icon" />收藏：{{ video.laststat.favorite }}</li>
              <li><a-icon type="dollar" class="stat-item-icon" />硬币：{{ video.laststat.coin }}</li>
              <li><a-icon type="share-alt" class="stat-item-icon" />分享：{{ video.laststat.share }}</li>
              <li><a-icon type="like" class="stat-item-icon" />点赞：{{ video.laststat.like }}</li>
            </ul>
            *{{ $util.tsToDateString(video.laststat.added) }}更新
          </div>
          <div v-else>
            <a-alert type="error" message="暂无数据" />
          </div>
        </div>
        <div class="section-separator"></div>
        <div class="section-block">
          <a-divider orientation="left">历史趋势</a-divider>
          <video-detail-history-line-chart :videoRecords="videoRecords" />
          <a-divider orientation="left">详细数据</a-divider>
          <video-detail-history-table :video-records="videoRecords" />
          <a-divider orientation="left" style="margin-top: -16px">周刊算分</a-divider>
          <tdd-video-record-zk-calc :video-records="videoRecords" :page="video ? video.videos : 1" :pubdate="video ? video.pubdate : null" />
          <a-divider orientation="left">数据下载</a-divider>
          <tdd-video-record-saver :video-records="videoRecords" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoDetailHistoryLineChart from "./VideoDetailHistoryLineChart";
import VideoDetailHistoryTable from "./VideoDetailHistoryTable";
import TddVideoRecordSaver from "./common/TddVideoRecordSaver";
import TddVideoRecordZkCalc from "./common/TddVideoRecordZkCalc";

export default {
  name: 'VideoDetail',
  components: {
    VideoDetailHistoryLineChart,
    VideoDetailHistoryTable,
    TddVideoRecordSaver,
    TddVideoRecordZkCalc
  },
  data: function() {
    return {
      video: null,
      videoRecords: null,
      isLoading: false
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
    }
  },
  watch: {
    aid: function(newAid) {
      this.getVideoInfo(newAid);
    },
    videoRecords: function() {

    }
  },
  methods: {
    getVideoInfo: function(aid) {
      this.isLoading = true;

      let axios = this.$axios;
      function getVideo() {
        return axios.get('video/' + aid);
      }

      function getVideoRecords() {
        return axios.get('video/' + aid + '/record');
      }

      let that = this;
      this.$axios.all([getVideo(), getVideoRecords()])
        .then(this.$axios.spread(function (video, videoRecords) {
          // video
          that.video = video.data;

          // video records
          that.videoRecords = videoRecords.data;
        }))
        .finally(function () {
          that.isLoading = false;
        });
    }
  },
  created: function() {
    this.getVideoInfo(this.aid);
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