<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/sprint">传说助攻</a></a-breadcrumb-item>
      <a-breadcrumb-item><a :href="'/sprint/av'+this.$route.params.aid">{{ video.title }}</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div v-if="isLoadingVideo">
      <div class="section-block">
        <a-spin :spinning="isLoadingRecords">
          正在查找<a :href="'https://www.bilibili.com/video/av' + this.$route.params.aid" target="_blank">av{{ this.$route.params.aid }}</a>的冲刺记录
        </a-spin>
      </div>
    </div>
    <div v-else>
      <div v-if="video.aid != '-1'">
        <div class="section-block">
          <a-spin :spinning="isLoadingRecords">
            <SprintVideoInfo :video="video" :records="records"/>
          </a-spin>
        </div>
        <transition name="fade">
        <div v-if="isLoadAllRecordsShow">
          <div class="section-seperator"></div>
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
        <div class="section-seperator"></div>
        <div class="section-block">
          <a-spin :spinning="isLoadingRecords">
            <SprintVideoMainChart :records="records"/>
          </a-spin>
        </div>
        <div class="section-seperator"></div>
        <div class="section-block">
          <a-spin :spinning="isLoadingRecords">
            <SprintVideoHeatMapChart :records="records"/>
          </a-spin>
        </div>
      </div>
      <div v-else>
        <div class="section-block">
          <p>没有找到<a :href="'https://www.bilibili.com/video/av' + this.$route.params.aid" target="_blank">av{{ this.$route.params.aid }}</a>的冲刺记录</p>
          <a href="/sprint">返回传说助攻</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SprintVideoMainChart from "./SprintVideoMainChart.vue";
import SprintVideoHeatMapChart from "./SprintVideoHeatMapChart.vue";
import SprintVideoInfo from './SprintVideoInfo.vue';

export default {
  name: "SprintVideoDetail", 
  components: {
    SprintVideoMainChart,
    SprintVideoHeatMapChart,
    SprintVideoInfo
  },
  data: function() {
    return {
      video: {
        title: "av"+this.$route.params.aid,
        aid: "-1",
        mid: "-1",
        pic: "",
        created: "0"
      },
      records: [{
        id: "-1",
        added: "0",
        view: "0"
      }],
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
    formatDate: function(ts) {
      let date = new Date(ts * 1000)
      return (
        date.getFullYear() + "-" + 
        (date.getMonth()+1) + "-" + 
        date.getDate() + " " + 
        (date.getHours()<10?"0"+date.getHours():date.getHours()) + ":" + 
        (date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes()) + ":" + 
        (date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds())
      )
    },
    loadAddRecords: function() {
      if (this.isLoadingAllRecords == true || this.hasLoadAllRecords == true) {
        return
      }
      this.isLoadingAllRecords = true
      fetch(this.$store.state.apiBase + "sprint_video_record.php?aid=" + this.$route.params.aid)
        .then(response => response.json())
        .then(json => this.records = json.data)
        .then(() => this.isLoadingAllRecords = false)
        .then(() => this.hasLoadAllRecords = true)
    },
    closeAllRecordsInfo: function() {
      this.isLoadAllRecordsShow = false
    }
  },
  created: function() {
    this.isLoadingVideo = true
    this.isLoadingRecords = true
    fetch(this.$store.state.apiBase + "sprint_video.php?aid=" + this.$route.params.aid)
      .then(response => response.json())
      .then(json => {
        if (json.data.length > 0){
          this.video = json.data[0]
        }
        this.isLoadingVideo = false
      })

    // load only 1 week data first
    let nowDate = new Date()
    let endTs = nowDate.valueOf() / 1000
    let startTs = endTs - 60 * 60 * 24 * 7
    fetch(this.$store.state.apiBase + "sprint_video_record.php?aid=" + this.$route.params.aid + "&start=" + startTs + "&end=" + endTs)
      .then(response => response.json())
      .then(json => this.records = json.data)
      .then(() => this.isLoadingRecords = false)
    this.hasLoadAllRecords = false

    this.$message.success("已加载全部数据")
  }
}
</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>