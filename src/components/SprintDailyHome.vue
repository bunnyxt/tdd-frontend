<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/sprint">传说助攻</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/sprint/daily">助攻日报</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>关于助攻日报</h1>
      <p>
        基于<a href="/sprint">传说助攻</a>的数据，以<strong>UTC+8 06:00至次日06:00</strong>为统计区间，每日刊发一期的助攻日报，记录当日各冲刺视频播放数及播放数变化情况。
      </p>
      <p>数据交流与系统反馈
        <ul>
          <li>
            QQ群：<a target="_blank" href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a>
          </li>
          <li>
            个人邮箱：<a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a>
          </li>
        </ul>
      </p>
    </div>
    <div class="section-seperator"></div>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>助攻趋势</h1>
      <SprintDailyChart :sprintDailyList="sprintDailyList"/>
    </div>
    <div class="section-seperator"></div>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>往期助攻日报</h1>
      <a-spin :spinning="isLoadingDaily">
        <SprintDailyTable :sprintDailyList="sprintDailyList" :showPagi="true"/>
      </a-spin>
    </div>
  </div>
</template>

<script>
import SprintDailyTable from "./SprintDailyTable.vue"
import SprintDailyChart from "./SprintDailyChart.vue"

export default {
  name: "SprintDailyHome",
  components: {
    SprintDailyTable,
    SprintDailyChart
  },
  data: function() {
    return {
      sectionBlockStyle: {
        background: "#fff",
        padding: "24px"
      },
      sprintDailyList: [],
      isLoadingDaily: false
    };
  },
  created: function() {
    this.isLoadingDaily = true
    fetch("http://api.bunnyxt.com/tdd/get_sprint_daily.php")
      .then(response => response.json())
      .then(json => this.sprintDailyList = json.data)
      .then(() => this.isLoadingDaily = false)
  },
}
</script>
