<i18n src="@/i18n/common.json"></i18n>

<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/sprint">{{ $t('page_name.sprint') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('page_name.sprint_daily') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>关于助攻日报</h1>
      <p>
        基于<router-link to="/sprint">传说助攻</router-link>的数据，以<strong>UTC+8 06:00至次日06:00</strong>为统计区间，每日刊发一期的助攻日报，记录当日各冲刺视频播放数及播放数变化情况。
      </p>
      <p>
        数据交流与系统反馈
      </p>
      <ul>
        <li>
          QQ群：<a target="_blank" href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a>
        </li>
        <li>
          个人邮箱：<a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a>
        </li>
      </ul>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <h1>助攻趋势</h1>
      <div v-if="isLoadingDaily">
        <a-spin>
          <a-alert type="info" message="加载中..."></a-alert>
        </a-spin>
      </div>
      <tdd-sprint-daily-view-incr-history-line-chart v-else :sprint-daily-list="sprintDailyList" />
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <h1>往期助攻日报</h1>
      <div v-if="isLoadingDaily">
        <a-spin>
          <a-alert type="info" message="加载中..."></a-alert>
        </a-spin>
      </div>
      <sprint-daily-table v-else :sprintDailyList="sprintDailyList" :showPagi="true"/>
    </div>
  </div>
</template>

<script>
import SprintDailyTable from "./SprintDailyTable.vue"
import TddSprintDailyViewIncrHistoryLineChart from "@/components/chart/TddSprintDailyViewIncrHistoryLineChart";

export default {
  name: "SprintDailyHome",
  components: {
    SprintDailyTable,
    TddSprintDailyViewIncrHistoryLineChart,
  },
  data: function() {
    return {
      sprintDailyList: [],
      isLoadingDaily: false
    };
  },
  created: function() {
    this.isLoadingDaily = true
    fetch(this.$store.state.apiBase + "sprint_daily.php")
      .then(response => response.json())
      .then(json => this.sprintDailyList = json.data)
      .then(() => this.sprintDailyList = this.sprintDailyList.reverse()) // reverse here
      .then(() => this.isLoadingDaily = false)
  },
}
</script>
