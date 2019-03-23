<template>
  <a-card
    hoverable 
    style="margin: 0px 12px 12px 0px"
  >
    <img 
      :alt="video.title" 
      :src="video.pic" 
      slot="cover"
    >
    <a-card-meta 
      :title="video.title" 
      :description="'UP主：' + video.mid + '播放数：' + video.latestVideoRecord.view"
    />
    <template class="ant-card-actions" slot="actions">
      <a-icon type="play-circle" @click="handlePlayCircleClick"/>
      <a-icon type="line-chart" @click="handleLineChartClick"/>
    </template>
  </a-card>
</template>

<script>
export default {
  name: "SprintVideoBrief",
  props: {
    video: Object
  },
  data: function() {
      return {
        upName : ''
      }
  },
  methods: {
      handlePlayCircleClick: function() {
        window.open('https://www.bilibili.com/video/av' + this.video.aid);
      },
      handleLineChartClick: function() {
        // TODO link to chart page
        console.log("2")
      }
  },
  created: function() {
    // TODO create up info record table
    /*
    fetch("https://api.bilibili.com/x/space/acc/info?mid=" + this.video.mid)
      .then(response => response.json())
      .then(json => this.upName = json.data.name)
    */
  }
};
</script>

<style>
.ant-card-meta-title {
  word-wrap: break-word;
}
</style>

