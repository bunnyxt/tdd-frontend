<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item>传说助攻</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>关于传说助攻</h1>
      <p>VC传说冲刺曲目助攻计划，收录B站接近<a href="https://zh.moegirl.org/Vocaloid中文传说曲" target="_blank">中文VOCALOID传说曲</a>要求的曲目视频，目前以<strong>80万</strong>播放数作为收录标准。</p>
      <p>所有处于传说冲刺状态的曲目信息每10分钟更新一次，因此您在这里看到的播放数等信息有可能与在B站内看到的信息不同，存在一定的延迟。</p>
      <p>由于目前冲刺曲目完全由人工手动添加，因此难免出现更新不及时现象。另外，本站在建设初期难免存在各种问题。有任何问题欢迎通过邮件与我取得联系。<a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a></p>
    </div>
    <div class="section-seperator"></div>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>助攻列表</h1>
      <a-list
        :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }"
        :dataSource="sprintVideoList"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <SprintVideoBrief 
            :key="item.id"
            :video="item"
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
      sprintVideoList: []
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
  }
};
</script>