<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/sprint">传说助攻</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>关于传说助攻</h1>
      <p>VC传说冲刺曲目助攻计划，收录B站接近<a href="https://zh.moegirl.org/Vocaloid中文传说曲" target="_blank">中文VOCALOID传说曲</a>要求的曲目视频，目前以<strong>80万</strong>播放数作为收录标准。</p>
      <p>移动端访问本站可能出现图表较小、查看不便等问题，可尝试将设备横过来，使用<strong>横屏浏览</strong>。</p>
      <p>曲目信息每10分钟更新一次，存在一定的延迟。BUG反馈、意见建议等请联系<a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a></p>
    </div>
    <div class="section-seperator"></div>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>助攻列表</h1>
      <a-list
        :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 }"
        :dataSource="sprintVideoList"
      >
        <a-list-item class="sprint-video-item" slot="renderItem" slot-scope="item">
          <SprintVideoBrief 
            :key="item.id"
            :video="item"
            :imgHeight="sprintVideoImgHeight"
          ></SprintVideoBrief>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script>
import SprintVideoBrief from "./SprintVideoBrief.vue";

export default {
  name: "SprintHome",
  components: {
    SprintVideoBrief
  },
  data: function() {
    return {
      sectionBlockStyle: {
        background: "#fff",
        padding: "24px"
      },
      sprintVideoList: [],
      sprintVideoImgHeight: '200px'
    };
  },
  created: function() {
    fetch("http://api.bunnyxt.com/tdd/get_sprint_video.php")
      .then(response => response.json())
      .then(json => this.sprintVideoList = json.data)
      .then(
        () => this.sprintVideoList.sort(
          (o1, o2) => o2.latestVideoRecord.view - o1.latestVideoRecord.view
        )
      );
  },
  mounted: function(){
    var that = this;
    window.addEventListener('resize',() => that.sprintVideoImgHeight = `${document.getElementsByClassName("sprint-video-card").item(0).clientWidth / 1.6}px`,false);
  }
};
</script>