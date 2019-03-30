<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/sprint">传说助攻</a></a-breadcrumb-item>
      <a-breadcrumb-item><a :href="'/sprint/av'+this.$route.params.aid">{{ video.title }}</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div v-if="video.aid != '-1'">
      <div class="section-block" :style="{background: '#fff'}">
        <a-row>
          <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8" :xxl="8" style="margin:24px">
            <img :src="video.pic" style="max-height:200px"/>
          </a-col>
          <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8" :xxl="8" style="margin:24px">
            <h3>{{ video.title }}</h3>
            <p>UP：{{ video.mid }}</p>
            <p>UP头像：{{ video.mid }}</p>
            <p>投稿时间：{{ formatDate(video.created) }}</p>
            <p>数据最后更新时间：{{ latestUpdateTimeString }}</p>
          </a-col>
          <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8" :xxl="8" style="margin:24px">
            <p>当前播放：{{ latestView }}</p>
            <p>昨日增速：{{ daySpeed }}</p>
            <p>已用时间：{{ passedTime }}日</p>
            <p>还需时间：{{ needTime }}日</p>
          </a-col>
        </a-row>
      </div>
      <div class="section-seperator"></div>
      <div class="section-block" :style="sectionBlockStyle">
        <SprintVideoMainChart :records="records"/>
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

export default {
  name: "SprintVideoDetail", 
  components: {
    SprintVideoMainChart
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
        pic: "",
        created: "0"
      },
      records: [{
        id: "-1",
        added: "0",
        view: "0"
      }]
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
      return parseInt((parseInt(this.latestUpdateTime) - parseInt(this.video.created)) / (60 * 60 * 24))
    },
    daySpeed: function() {
      var ts2 = parseInt(this.latestUpdateTime) - parseInt(this.latestUpdateTime) % (60 * 60 * 24)
      var ts1 = ts2 - (60 * 60 * 24)
      var v2 = 0
      var v1 = 0
      var flag = false
      for (var i = this.records.length - 1; i >= 0; i--){
        var added = parseInt(this.records[i].added)
        var view = parseInt(this.records[i].view)
        if (flag == false) {
          if (added < ts2) {
            v2 = view
            flag = true
          }
        } else {
          if (added < ts1) {
            v1 = view
            break;
          }
        }
      }
      return v2 - v1
    },
    needTime: function() {
      return parseInt((1000000 - parseInt(this.latestView)) / this.daySpeed)
    }
  },
  methods: {
    formatDate: function(ts) {
      var date = new Date(parseInt(ts) * 1000)
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
  }
}
</script>