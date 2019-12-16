<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
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
            <p><a-icon type="calendar" style="margin-right: 12px"/>{{ tsToStr(video.pubdate) }}</p>
            <p><a-icon type="database" style="margin-right: 12px"/>{{ video.tname }}</p>
            <p><a-icon type="play-circle" style="margin-right: 12px"/><a :href="'https://www.bilibili.com/video/av'+video.aid" target="_blank">去B站观看</a></p>
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
            *{{ tsToStr(video.laststat.added) }}更新
          </div>
          <div v-else>
            <a-alert type="error" message="暂无数据" />
          </div>
          <a-divider orientation="left">其他</a-divider>
          <div v-if="video.isvc == 1">
            <a-tag color="pink">VC</a-tag>
          </div>
        </div>
        <div class="section-separator"></div>
        <div class="section-block">
          <a-divider orientation="left">历史数据</a-divider>
          <video-detail-history-line-chart :videoRecords="videoRecords" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoDetailHistoryLineChart from "./VideoDetailHistoryLineChart";

export default {
  name: 'VideoDetail',
  components: {
    VideoDetailHistoryLineChart
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
        let clientWidth = this.$store.state.clientWidth;
        if (clientWidth < 768) {
          style['width'] = (clientWidth - 250 - 24*2 - 20*2 - 12) + 'px';  // layoutPadding: '0 20px'
        } else {
          style['width'] = (clientWidth - 250 - 24*2 - 50*2 - 24 - 6) + 'px';  // layoutPadding: '0 50px'
        }
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
    addZero: function(value) {
      return value < 10 ? "0" + value : "" + value;
    },
    tsToStr: function (ts) {
      let date = new Date(ts * 1000);
      let dateString = "";
      dateString += date.getFullYear() + "-";
      dateString += this.addZero(date.getMonth() + 1) + "-";
      dateString += this.addZero(date.getDate()) + " ";
      dateString += this.addZero(date.getHours()) + ":";
      dateString += this.addZero(date.getMinutes()) + ":";
      dateString += this.addZero(date.getSeconds());
      return dateString;
    },
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