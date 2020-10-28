<template>
  <div>
    <div v-wechat-title="$route.meta.title='av'+aid+' - 视频详情 - 天钿Daily'"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/video">视频</router-link></a-breadcrumb-item>
        <a-breadcrumb-item v-if="fromBvid">BV{{ bvid }} - av{{ aid }}</a-breadcrumb-item>
        <a-breadcrumb-item v-else>av{{ aid }} - BV{{ bvid }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div v-if="isLoadingVideo">
      <div class="section-block">
        <a-spin :spinning="true">
          正在获取
          <a v-if="fromBvid" :href="'https://www.bilibili.com/video/BV' + bvid" target="_blank">BV{{ bvid }}</a>
          <a v-else :href="'https://www.bilibili.com/video/av' + aid" target="_blank">av{{ aid }}</a>
          的视频信息
        </a-spin>
      </div>
    </div>
    <div v-else>
      <div v-if="!video || Object.keys(video).length === 0">
        <div class="section-block">
          <p>
            没有找到
            <a v-if="fromBvid" :href="'https://www.bilibili.com/video/BV' + bvid" target="_blank">BV{{ bvid }}</a>
            <a v-else :href="'https://www.bilibili.com/video/av' + aid" target="_blank">av{{ aid }}</a>
            的视频信息
          </p>
          <p>可能是因为该视频不在本站收录范围内</p>
          <a @click="$router.go(-1)">返回上一页</a>
        </div>
      </div>
      <div v-else>
        <div v-wechat-title="$route.meta.title=video.title+' - 视频详情 - 天钿Daily'"></div>
        <div class="section-block">
          <a-alert
            v-if="video.code !== 0 && video.code !== -403"
            type="error"
            :message='`本视频已无法正常观看，错误代码：${video.code}，提示信息：${$util.getVideoCodeMessage(video.code)}`'
            style="margin-bottom: 12px;"
            banner
          />
          <a-alert
            v-if="video.code === -403"
            type="warning"
            :message='`本视频仅会员可见，登录B站后方可观看；由于B站限制，本站无法获取精确播放数`'
            style="margin-bottom: 12px;"
            banner
          />
          <div v-if="$store.getters.clientMode === 'MOBILE'">
            <img :src="$util.httpS(video.pic)" alt="pic" width="100%" style="margin-bottom: 8px"/>
          </div>
          <div v-else>
            <img :src="$util.httpS(video.pic)" alt="pic" width="250px" style="float: right"/>
          </div>
          <div :style="titleDivStyle">
            <h3 style="margin-bottom: 14px">{{ video.title }}</h3>
            <div style="overflow: hidden">
              <div style="float: left; margin-right: 20px; margin-bottom: 12px">
                <a-avatar
                  size="small"
                  :src="video.member
                        ? $util.httpS(video.member.face)
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
                          <a-avatar size="small" :src="$util.httpS(staff.face)" style="margin-right: 8px" />
                          {{ staff.name }}<a-tag :color="getStaffTitleColor(staff.title)" style="margin-left: 8px">{{ staff.title }}</a-tag>
                        </a>
                      </a-menu-item>
                    </template>
                    <template v-for="staff in video.staff.filter( s => s.title !== 'UP主')">
                      <a-menu-item :key="staff.mid">
                        <a @click="videoMemberNameClickHandler(staff.mid)">
                          <a-avatar size="small" :src="$util.httpS(staff.face)" style="margin-right: 8px" />
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
            <template v-if="videoAttributeFlags.length > 0 && $store.state.isUserLoggedIn">
              <p>
                <a-icon type="flag" style="margin-right: 12px" />
                <a-tag
                  v-for="flag in videoAttributeFlags"
                  :key="flag.name"
                  :title="flag.message"
                  color="red"
                  style="margin-bottom: 4px; cursor: pointer"
                >
                  <a-popover>
                    <template slot="content">
                      {{ flag.message }}
                    </template>
                    {{ flag.name }}
                  </a-popover>
                </a-tag>
                <a-tag
                  color="red"
                  style="margin-bottom: 4px; cursor: pointer"
                >
                  <a-popover>
                    <template slot="content">
                      对B站API提供的视频"attribute"属性的解释，仅供参考。<br/>详见<a href="https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/video/info.md#获取视频详细信息web端" target="_blank">此处</a>。
                    </template>
                    <a-icon type="question-circle" />
                  </a-popover>
                </a-tag>
              </p>
            </template>
            <tdd-video-action-bar :aid="aid" />
            <tdd-moe-girl-wiki-widget v-if="$config.enableMoegirlWikiWidget" type="video" url="https://zh.moegirl.org.cn/普通DISCO" style="margin-bottom: 12px" />
            <div style="margin-bottom: 12px">
              <a-tag v-for="tag in $util.getTagList(video)" :key="tag.title" :color="tag.color" style="margin-bottom: 4px">{{ tag.title }}</a-tag>
              <a-tag>{{ video.videos }}P</a-tag>
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
          <tdd-video-data-block
            v-if="video.laststat"
            :stat="video.laststat"
            :size="this.$store.getters.clientMode === 'MOBILE' ? 'middle' : 'large'"
            :bvid="bvid"
          />
          <a-alert v-else type="error" message="暂无数据" />
        </div>
        <div class="section-separator"></div>
        <div class="section-block">
          <div v-if="isLoadingVideoRecords">
            <a-spin :spinning="true">
              正在获取
              <a v-if="fromBvid" :href="'https://www.bilibili.com/video/BV' + bvid" target="_blank">BV{{ bvid }}</a>
              <a v-else :href="'https://www.bilibili.com/video/av' + aid" target="_blank">av{{ aid }}</a>
              的历史数据
            </a-spin>
          </div>
          <div v-else>
            <div v-if="videoRecords.length === 0">
              <a-alert banner>
                没有找到
                <a v-if="fromBvid" :href="'https://www.bilibili.com/video/BV' + bvid" target="_blank">BV{{ bvid }}</a>
                <a v-else :href="'https://www.bilibili.com/video/av' + aid" target="_blank">av{{ aid }}</a>
                的历史数据
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
                  <a-alert type="info" banner style="margin-bottom: 12px" closable>
                    <template slot="message">
                      新功能！想对比多个视频的历史趋势？将此视频<a-popover placement="bottom">
                      <template slot="content">
                        <template v-if="inVideoCompareList">
                          已添加，点此<a @click="removeFromVideoCompareListHandler">移除</a>
                        </template>
                        <template v-else>
                          点此<a @click="addToVideoCompareListHandler">添加</a>
                        </template>
                      </template>
                      <a>添加到对比列表</a>
                    </a-popover>，前往<router-link to="/tool/compare">视频对比工具</router-link>进行比较
                    </template>
                  </a-alert>
                  <tdd-video-history-line-chart :videoRecords="videoRecords" :pubdate="video ? video.pubdate : 0" />
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
import VideoDetailHistoryTable from "./VideoDetailHistoryTable";
import TddVideoRecordSaver from "../../common/TddVideoRecordSaver";
import TddVideoRecordZkCalc from "../../common/TddVideoRecordZkCalc";
import TddVideoDescription from "../../common/TddVideoDescription";
import TddVideoActionBar from "../../common/TddVideoActionBar";
import TddVideoDataBlock from "@/components/common/TddVideoDataBlock";
import TddVideoHistoryLineChart from "@/components/chart/TddVideoHistoryLineChart";
import TddMoeGirlWikiWidget from "@/components/common/TddMoeGirlWikiWidget";

export default {
  name: 'VideoDetail',
  components: {
    VideoDetailHistoryTable,
    TddVideoRecordSaver,
    TddVideoRecordZkCalc,
    TddVideoDescription,
    TddVideoActionBar,
    TddVideoDataBlock,
    TddVideoHistoryLineChart,
    TddMoeGirlWikiWidget,
  },
  data: function() {
    return {
      video: null,
      videoRecords: null,
      isLoadingVideo: false,
      isLoadingVideoRecords: false,
      currentDataCategory: ['recordChart'],
      recordChartEnterCount: 1,
      // video compare list related
      inVideoCompareList: false,
    }
  },
  computed: {
    fromBvid: function () {
      return !!this.$route.params.bvid;
    },
    aid: function() {
      if (this.fromBvid) {
        return parseInt(this.$util.b2a(this.$route.params.bvid));
      } else {
        return parseInt(this.$route.params.aid);
      }
    },
    bvid: function () {
      return this.$util.a2b(this.aid);
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
    videoAttributeFlags: function () {
      if (this.video && this.video.attribute) {
        return this.$util.getVideoAttributeFlags(this.video.attribute);
      } else {
        return [];
      }
    },
  },
  watch: {
    aid: function(newAid) {
      this.getVideoInfo(newAid);
      this.addVisitHistoryVideo(newAid);
      this.initVideoCompareListRelated(newAid);
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
    }
  },
  methods: {
    addVisitHistoryVideo: function (bvid) {
      // TODO make bvid version
      // let that = this;
      console.log(bvid);
      // this.$axios.post('/visit/history/video/BV' + bvid)
      //   .then(function (response) {
      //     if (!response) {
      //       console.log(response);
      //     }
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   })
      //   .finally(function () {
      //
      //   });
    },
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
    addToVideoCompareListHandler: function () {
      const videoCompareListString = localStorage.getItem('videoCompareList') || '[]';
      const videoCompareList = JSON.parse(videoCompareListString);
      const newVideo = {
        aid: this.aid,
        video: this.video,
        // records: [],
        records: this.videoRecords.slice(-200),
        config: {
          title: `av${this.aid}`,
          props: ['view'],
        },
      }
      const newVideoCompareList = [...videoCompareList.filter(video => video.aid !== newVideo.aid), newVideo];
      localStorage.setItem('videoCompareList', JSON.stringify(newVideoCompareList));
      this.inVideoCompareList = true;
    },
    removeFromVideoCompareListHandler: function () {
      const videoCompareListString = localStorage.getItem('videoCompareList') || '[]';
      const videoCompareList = JSON.parse(videoCompareListString);
      const newVideoCompareList = videoCompareList.filter(video => video.aid !== this.aid);
      localStorage.setItem('videoCompareList', JSON.stringify(newVideoCompareList));
      this.inVideoCompareList = false;
    },
    initVideoCompareListRelated: function (aid) {
      const videoCompareListString = localStorage.getItem('videoCompareList');
      if (videoCompareListString) {
        const videoCompareList = JSON.parse(videoCompareListString);
        this.inVideoCompareList = !!videoCompareList.find(x => x.aid === aid);
      } else {
        localStorage.setItem('videoCompareList', '[]');
        this.inVideoCompareList = false;
      }
    },
  },
  created: function() {
    this.getVideoInfo(this.aid, true);
    this.addVisitHistoryVideo(this.aid);
    this.initVideoCompareListRelated(this.aid);
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
