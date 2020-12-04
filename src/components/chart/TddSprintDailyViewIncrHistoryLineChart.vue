<template>
  <div>
    <tdd-line-chart
      id="tdd-sprint-daily-view-incr-history"
      :data="dataToShow"
      :option="option"
    />
  </div>
</template>

<script>
import TddLineChart from "@/components/chart/TddLineChart";

export default {
  name: 'TddSprintDailyViewIncrHistoryLineChart',
  props: {
    sprintDailyList: Array
  },
  components: {
    TddLineChart,
  },
  data: function () {
    return {
      option: {
        configPanel: null,
        dateRangePanel: {
          performanceWarning: 1000,
        },
        data: {
          transform: {
            rename: {
              viewincr: '播放增长',
            },
          },
          dataLine: '播放增长',
        },
      }
    }
  },
  computed: {
    dataToShow: function () {
      return this.sprintDailyList.map(x => {
        const dateString = String(x.date);
        return {
          added: this.$util.dateStringToTs(
            `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)} 06:00:00`),
          viewincr: x.viewincr,
        }
      }).reverse();
    },
  },
}
</script>

<style scoped>

</style>
