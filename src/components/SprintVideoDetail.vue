<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item>传说助攻</a-breadcrumb-item>
      <a-breadcrumb-item>{{ video.title }}</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="section-block" :style="sectionBlockStyle">
      <img :src="video.pic" width="200px"/>
    </div>
    <div class="section-seperator"></div>
    <div class="section-block" :style="sectionBlockStyle">
      <SprintVideoMainChart :aid="video.aid"/>
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
        title: "",
        aid: "-1",
        pic: ""
      }
    }
  },
  created: function() {
    fetch("http://api.bunnyxt.com/tdd/get_sprint_video.php?aid=" + this.$route.params.aid)
      .then(response => response.json())
      .then(json => this.video = json.data[0])
  }
}
</script>