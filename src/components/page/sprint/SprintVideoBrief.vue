<template>
  <a-card
    hoverable
    style="margin: 0px 0px 12px 0px"
    class="sprint-video-card"
  >
    <template #cover>
      <img
        :id="'video-pic-'+video.id"
        :alt="video.title"
        :src="$util.httpS(video.pic)"
        :height="imgHeight"
        @load="initImg"
        @click="handleLineChartClick"
      >
    </template>
    <a-card-meta>
      <template #title>
        <a-tooltip placement="topLeft" >
          <template #title>
            <span>{{ video.title }}</span>
          </template>
          {{ video.title }}
        </a-tooltip>
      </template>
      <template #description>
        UP主：{{ member.name }}<br/>
        播放数：{{ video.last_record.view }}
      </template>
    </a-card-meta>
    <template #actions>
      <div class="ant-card-actions">
        <a-icon type="play-circle" title="立刻助攻" @click="handlePlayCircleClick"/>
        <a-icon type="line-chart" title="查看详情" @click="handleLineChartClick"/>
      </div>
    </template>
  </a-card>
</template>

<script>
export default {
  name: "SprintVideoBrief",
  props: {
    video: Object,
    imgHeight: String
  },
  data: function() {
    return {
      member: {
        mid: 1,
        name: "",
      }
    }
  },
  methods: {
    initImg: function() {
      let img = document.getElementById("video-pic-" + this.video.id)
      let width = img.clientWidth
      img.setAttribute('height', width / 1.6 + "px")
    },
    handlePlayCircleClick: function() {
      window.open('https://www.bilibili.com/video/av' + this.video.aid);
    },
    handleLineChartClick: function() {
      this.$router.push("/sprint/av" + this.video.aid);
    }
  },
  created: function() {
    fetch(this.$store.state.apiBase + "member.php?mid=" + this.video.mid)
      .then(response => response.json())
      .then(json => this.member = json.data[0])
  }
};
</script>

<style>
</style>

