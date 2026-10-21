<i18n src="@/i18n/common.json"></i18n>

<template>
  <div>
    <a-alert v-if="legacyError" :message="legacyError" type="error" show-icon style="margin-bottom: 12px" />
    <div v-wechat-title="$route.meta.title=$t('page_title.sprint_detail', { title: `av${this.$route.params.aid}` })"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/sprint">{{ $t('page_name.sprint') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ video.title }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div v-if="isLoadingVideo">
      <div class="section-block">
        <a-spin :spinning="isLoadingVideo">
          正在查找<a :href="'https://www.bilibili.com/video/av' + this.$route.params.aid" target="_blank">av{{ this.$route.params.aid }}</a>的冲刺记录
        </a-spin>
      </div>
    </div>
    <div v-else>
      <div v-if="video.aid != '-1'">
        <div v-wechat-title="$route.meta.title=$t('page_title.sprint_detail', { title: video.title })"></div>
        <div class="section-block">
          <a-spin :spinning="isLoadingRecords">
            <SprintVideoInfo :video="video" :records="records"/>
          </a-spin>
        </div>
        <transition name="fade">
          <div v-if="isLoadAllRecordsShow">
            <div class="section-separator"></div>
            <a-spin :spinning="isLoadingRecords">
              <div class="section-block">
                <a-alert message="提示" type="info">
                  <div slot="description">
                    <p>
                      为提高响应速度，当前仅加载最近一周内的数据。如需查看全部数据，请点击"获取全部数据"。<br>
                      注意：这将耗费一定的时间以及流量。由于数据量可能会很大，加载完成时可能会出现卡顿，请耐心等待。
                    </p>
                    <p>
                      <a-button type="primary" :disabled="hasLoadAllRecords" @click="loadAddRecords">
                        {{ loadAllRecordsButtonText }}
                      </a-button>
                      <a-spin :spinning="isLoadingAllRecords" style="margin-left: 12px"></a-spin>
                      <a-button @click="closeAllRecordsInfo" style="margin-left: 12px">
                        关闭提示
                      </a-button>
                    </p>
                  </div>
                </a-alert>
              </div>
            </a-spin>
          </div>
        </transition>
        <div class="section-separator"></div>
        <div class="section-block">
          <a-spin :spinning="isLoadingRecords">
            <p v-if="!isLoadingRecords && !records.length">暂无历史记录</p>
            <tdd-sprint-video-view-history-line-chart v-else :records="records" />
          </a-spin>
        </div>
        <div class="section-separator"></div>
        <div class="section-block">
          <a-spin :spinning="isLoadingRecords">
            <tdd-sprint-video-view-history-heat-map-chart v-if="records.length" :records="records" />
          </a-spin>
        </div>
      </div>
      <div v-else>
        <div class="section-block">
          <p>没有找到<a :href="'https://www.bilibili.com/video/av' + this.$route.params.aid" target="_blank">av{{ this.$route.params.aid }}</a>的冲刺记录</p>
          <router-link to="/sprint">返回传说助攻</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { legacyPage } from '@/api/legacy';
import SprintVideoInfo from './SprintVideoInfo.vue';
import TddSprintVideoViewHistoryLineChart from "@/components/chart/TddSprintVideoViewHistoryLineChart";
import TddSprintVideoViewHistoryHeatMapChart from "@/components/chart/TddSprintVideoViewHistoryHeatMapChart";

export default {
  mixins: [legacyPage],
  name: "SprintVideoDetail",
  components: {
    SprintVideoInfo,
    TddSprintVideoViewHistoryLineChart,
    TddSprintVideoViewHistoryHeatMapChart,
  },
  data: function() {
    return {
      video: {
        title: "av"+this.$route.params.aid,
        aid: "-1",
        mid: "-1",
        pic: "",
        created: "0",
        status: "processing",
        last_record: {
          view: 0,
          added: 0
        }
      },
      records: [],
      member: {
        mid: 1,
        name: "",
        face: ""
      },
      isLoadingVideo: false,
      isLoadingRecords: false,
      hasLoadAllRecords: false,
      isLoadingAllRecords: false,
      isLoadAllRecordsShow: true
    }
  },
  computed: {
    loadAllRecordsButtonText: function() {
      let f1 = this.hasLoadAllRecords
      let f2 = this.isLoadingAllRecords
      if (f1 == false && f2 == false) {
        return "获取全部数据"
      } else if (f1 == false && f2 == true) {
        return "正在获取全部数据...请稍后"
      } else {
        return "已获取全部数据"
      }
    }
  },
  methods: {
    loadOneWeekRecords: function(startTs){
      if (this.isLoadingRecords) {
        return
      }
      this.isLoadingRecords = true
      this.$legacy("sprint_video_record?aid=" + this.$route.params.aid + "&start=" + startTs)
        .then(json => this.records = json.data)
        .catch(() => {})
        .finally(() => this.isLoadingRecords = false)
    },
    loadAddRecords: function() {
      if (this.isLoadingAllRecords == true || this.hasLoadAllRecords == true) {
        return
      }
      this.isLoadingAllRecords = true
      this.$legacy("sprint_video_record?aid=" + this.$route.params.aid)
        .then(json => this.records = json.data)
        .then(() => this.hasLoadAllRecords = true)
        .catch(() => {})
        .finally(() => this.isLoadingAllRecords = false)
    },
    closeAllRecordsInfo: function() {
      this.isLoadAllRecordsShow = false
    }
  },
  created: function() {
    this.isLoadingVideo = true
    this.$legacy("sprint_video?aid=" + this.$route.params.aid)
      .then(json => {
        if (json.data.length > 0){
          this.video = json.data[0]
          const end = this.video.status === "finished" && this.video.last_record
            ? this.video.last_record.added : Date.now() / 1000
          this.loadOneWeekRecords(end - 7 * 86400)
        }
      })
      .catch(() => {})
      .finally(() => this.isLoadingVideo = false)

    this.hasLoadAllRecords = false
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
