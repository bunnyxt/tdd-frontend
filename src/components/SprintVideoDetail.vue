<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/sprint">传说助攻</a></a-breadcrumb-item>
      <a-breadcrumb-item><a :href="'/sprint/av'+this.$route.params.aid">{{ video.title }}</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div v-if="video.aid != '-1'">
      <div class="section-block" :style="sectionBlockStyle">
        <img :src="video.pic" width="200px"/>
      </div>
      <div class="section-seperator"></div>
      <div class="section-block" :style="sectionBlockStyle">
        <SprintVideoMainChart :aid="video.aid"/>
      </div>
    </div>
    <div v-else>
      <div class="section-block" :style="sectionBlockStyle">
        <p>没有找到<a :href="'https://www.bilibili.com/video/av' + this.$route.params.aid" target="_blank">av{{ this.$route.params.aid }}</a>的冲刺记录</p>
        <a href="/sprint">返回传说冲刺</a>
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
        pic: ""
      }
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
  }
}
</script>