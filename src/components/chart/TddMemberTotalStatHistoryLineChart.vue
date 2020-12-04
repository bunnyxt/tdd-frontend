<template>
  <div>
    <tdd-line-chart
      id="tdd-member-total-stat-history"
      :data="totalStatRecords"
      :option="option"
    />
  </div>
</template>

<script>
import TddLineChart from "@/components/chart/TddLineChart";

export default {
  name: 'TddMemberTotalStatHistoryLineChart',
  props: {
    totalStatRecords: {
      type: Array,
      required: true,
    }
  },
  components: {
    TddLineChart,
  },
  data: function () {
    return {
      option: {
        configPanel: {
          showSpecialPoint: null,
          showBasePoint: null,
        },
        data: {
          addSpeed: [{
            prop: 'view',
            per: 'day',
            rename: true,
          }],
          transform: {
            rename: {
              view: '播放',
              danmaku: '弹幕',
              reply: '评论',
              favorite: '收藏',
              coin: '硬币',
              share: '分享',
              like: '点赞',
              video_count: '投稿',
            },
            fold: ['播放', '弹幕', '评论', '收藏', '硬币', '分享', '点赞', '投稿'],
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
