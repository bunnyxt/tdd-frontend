<template>
  <div>
    <tdd-line-chart
      id="tdd-sprint-video-view-history"
      :data="records"
      :option="option"
    />
  </div>
</template>

<script>
import TddLineChart from "@/components/chart/TddLineChart";

export default {
  name: 'TddSprintVideoViewHistoryLineChart',
  props: {
    records: Array
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
          addSpeed: [{
            prop: 'view',
            per: 'hour',
            rename: true,
          }],
          transform: {
            rename: {
              view: '播放',
            },
            fold: ['播放'],
          },
          speedArea: 'view',
        },
      }
    }
  },
}
</script>

<style scoped>

</style>
