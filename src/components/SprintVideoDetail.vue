<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/sprint">传说助攻</a></a-breadcrumb-item>
      <a-breadcrumb-item><a :href="'/sprint/av'+this.$route.params.aid">{{ video.title }}</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div v-if="isLoadingVideo">
      <div class="section-block" :style="sectionBlockStyle">
        <a-spin :spinning="isLoadingRecords">
          正在查找<a :href="'https://www.bilibili.com/video/av' + this.$route.params.aid" target="_blank">av{{ this.$route.params.aid }}</a>的冲刺记录
        </a-spin>
      </div>
    </div>
    <div v-else>
      <div v-if="video.aid != '-1'">
        <div class="section-block" :style="sectionBlockStyle">
          <a-spin :spinning="isLoadingRecords">
            <SprintVideoInfo :video="video" :records="records"/>
          </a-spin>
        </div>
        <div class="section-seperator"></div>
        <div class="section-block" :style="sectionBlockStyle">
          <a-spin :spinning="isLoadingRecords">
            <SprintVideoMainChart :records="records"/>
          </a-spin>
        </div>
        <div class="section-seperator"></div>
        <div class="section-block" :style="sectionBlockStyle">
          <a-spin :spinning="isLoadingRecords">
            <SprintVideoHeatMapChart :records="records"/>
          </a-spin>
        </div>
      </div>
      <div v-else>
        <div class="section-block" :style="sectionBlockStyle">
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
      sectionBlockStyle: {
        background: "#fff",
        padding: "24px"
      },
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
      isLoadingRecords: false
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
    fetch(this.$store.state.apiBase + "sprint_video_record.php?aid=" + this.$route.params.aid)
      .then(response => response.json())
      .then(json => this.records = json.data)
      .then(() => this.isLoadingRecords = false)
  }
}
</script>