<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/sprint">传说助攻</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>关于传说助攻</h1>
      <p>VC传说冲刺曲目助攻计划，收录B站接近<a href="https://zh.moegirl.org/Vocaloid中文传说曲" target="_blank">中文VOCALOID传说曲</a>要求的曲目视频，目前以<strong>80万</strong>播放数作为收录标准。</p>
      <p>曲目信息每10分钟更新一次，存在一定的延迟。移动端访问本站可能出现图表较小、查看不便等问题，可尝试将设备横过来，使用<strong>横屏浏览</strong>。</p>
      <p>
        点击<a-icon type="play-circle" title="立刻助攻"/>跳转至B站视频页进行助攻<br/>
        点击<a-icon type="line-chart" title="查看详情"/>查看本站记录的冲刺数据详情
      </p>
      <p>数据交流与系统反馈
        <ul>
          <li>
            QQ群：<a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=2e43cb11988077acffc4fbad8584b6d0788eec9e697477baa939ddc2ab9b7e84">537793686</a>
          </li>
          <li>
            个人邮箱：<a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a>
          </li>
        </ul>
      </p>
    </div>
    <div class="section-seperator"></div>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>助攻日报</h1>
      <p>
        基于<a href="/sprint">传说助攻</a>的数据，以<strong>UTC+8 06:00至次日06:00</strong>为统计区间，每日刊发一期的助攻日报，记录当日各冲刺视频播放数及播放数变化情况。
      </p>
      <p>查看<a href="/sprint/daily">往期助攻日报</a></p>
      <SprintDailyTable :sprintDailyList="sprintDailyList" :showPagi="false"/>
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
    <div class="section-seperator"></div>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>历史助攻*</h1>
      <p>*展示已达成传说的，本系统曾经记录过的历史助攻曲目视频</p>
      <a-list
        :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 }"
        :dataSource="sprintVideoFinishedList"
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
import SprintDailyTable from "./SprintDailyTable.vue";

export default {
  name: "SprintHome",
  components: {
    SprintVideoBrief,
    SprintDailyTable
  },
  data: function() {
    return {
      sectionBlockStyle: {
        background: "#fff",
        padding: "24px"
      },
      sprintVideoList: [],
      sprintVideoFinishedList: [],
      sprintVideoImgHeight: '200px',
      sprintDailyList: []
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
    fetch("http://api.bunnyxt.com/tdd/get_sprint_video.php?status=finished")
      .then(response => response.json())
      .then(json => this.sprintVideoFinishedList = json.data);
    fetch("http://api.bunnyxt.com/tdd/get_sprint_daily.php?limit=3")
      .then(response => response.json())
      .then(json => this.sprintDailyList = json.data)
  },
  mounted: function(){
    var that = this;
    window.addEventListener('resize',() => that.sprintVideoImgHeight = `${document.getElementsByClassName("sprint-video-card").item(0).clientWidth / 1.6}px`,false);
  }
};
</script>