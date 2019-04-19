<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/sprint">传说助攻</a></a-breadcrumb-item>
      <a-breadcrumb-item><a :href="'/sprint/av'+this.$route.params.aid">{{ video.title }}</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div v-if="video.aid != '-1'">
      <div class="section-block" :style="sectionBlockStyle">
        <p><img :src="video.pic" width="200px"/></p>
        <h3>{{ video.title }}</h3>
        <p>UP：<a :href="'https://space.bilibili.com/' + member.mid" target="_blank">{{ member.name }}</a></p>
        <p>UP头像：<img :src="member.face" width="24"/></p>
        <p>投稿时间：{{ formatDate(video.created) }}</p>
        <a-spin :spinning="isLoading">
          <p>数据最后更新时间：{{ latestUpdateTimeString }}</p>
          <p>当前播放：{{ latestView }}</p>
          <p>昨日增速：{{ daySpeed }}</p>
          <p>已用时间：{{ passedTime }}日</p>
          <p>还需时间：{{ needTime }}日</p>
        </a-spin>
      </div>
      <div class="section-seperator"></div>
      <div class="section-block" :style="sectionBlockStyle">
        <a-spin :spinning="isLoading">
          <SprintVideoMainChart :records="records"/>
        </a-spin>
      </div>
      <div class="section-seperator"></div>
      <div class="section-block" :style="sectionBlockStyle">
        <a-spin :spinning="isLoading">
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
</template>

<script>
import SprintVideoMainChart from "./SprintVideoMainChart.vue";
import SprintVideoHeatMapChart from "./SprintVideoHeatMapChart.vue";

export default {
  name: "SprintVideoDetail", 
  components: {
    SprintVideoMainChart,
    SprintVideoHeatMapChart
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
      isLoading: false
    }
  },
  computed: {
    latestUpdateTime: function() {
      return this.records[this.records.length - 1].added
    },
    latestUpdateTimeString: function() {
      return this.formatDate(this.latestUpdateTime)
    },
    latestView: function() {
      return this.records[this.records.length - 1].view
    },
    passedTime: function() {
      return parseInt((this.latestUpdateTime - this.video.created) / (60 * 60 * 24))
    },
    daySpeed: function() {
      var ts2 = this.latestUpdateTime - this.latestUpdateTime % (60 * 60 * 24) - (60 * 60 * 8) // UTC+8
      if ((this.latestUpdateTime - (60 * 60 * 8) % (60 * 60 * 24)) > (60 * 60 * 6)) { // UTC+8
        ts2 += (60 * 60 * 6)
      } else {
        ts2 -= (60 * 60 * 18)
      }
      var ts1 = ts2 - (60 * 60 * 24)
      var v2 = 0
      var v1 = this.records[0].view
      var flag = false
      for (var i = this.records.length - 1; i >= 0; i--){
        var added = this.records[i].added
        var view = this.records[i].view
        if (flag == false) {
          if (added < ts2) {
            flag = true
          } else {
            v2 = view
          }
        } else {
          if (added < ts1) {
            break;
          } else {
            v1 = view
          }
        }
      }
      return v2 - v1
    },
    needTime: function() {
      return parseInt((1000000 - this.latestView) / this.daySpeed)
    }
  },
  watch: {
    video: function (newVideo, oldVideo) {
      fetch("http://api.bunnyxt.com/tdd/get_member.php?mid=" + newVideo.mid)
        .then(response => response.json())
        .then(json => this.member = json.data[0])
    }
  },
  methods: {
    formatDate: function(ts) {
      var date = new Date(ts * 1000)
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
    this.isLoading = true
    fetch("http://api.bunnyxt.com/tdd/get_sprint_video.php?aid=" + this.$route.params.aid)
      .then(response => response.json())
      .then(json => {
        if (json.data.length > 0){
          this.video = json.data[0]
        }
      })
    fetch("http://api.bunnyxt.com/tdd/get_sprint_video_record.php?aid=" + this.$route.params.aid)
      .then(response => response.json())
      .then(json => this.records = json.data)
      .then(() => this.isLoading = false)
  }
}
</script>