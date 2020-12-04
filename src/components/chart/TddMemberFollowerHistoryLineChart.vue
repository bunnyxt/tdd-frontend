<template>
  <div>
    <tdd-line-chart
      id="tdd-member-follower-history"
      :data="followerRecords"
      :option="option"
    />
  </div>
</template>

<script>
import TddLineChart from "@/components/chart/TddLineChart";

export default {
  name: 'TddMemberFollowerHistoryLineChart',
  props: {
    followerRecords: {
      type: Array,
      required: true
    }
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
            prop: 'follower',
            per: 'day',
            rename: true,
          }],
          transform: {
            rename: {
              follower: '粉丝数',
            },
            fold: ['粉丝数'],
          },
          speedArea: 'follower',
        },
      }
    }
  },
}
</script>

<style scoped>

</style>
