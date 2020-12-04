<template>
  <div>
    <tdd-line-chart
      id="tdd-video-history"
      :data="videoRecords"
      :option="option"
    />
  </div>
</template>

<script>
import TddLineChart from "@/components/chart/TddLineChart";

export default {
  name: 'TddVideoHistoryLineChart',
  props: {
    videoRecords: {
      type: Array,
      required: true,
    },
    pubdate: {
      type: Number,
      default: 0,
    }
  },
  components: {
    TddLineChart,
  },
  data: function () {
    return {
      option: {
        configPanel: {
          showBasePoint: {
            basePointAdded: this.pubdate,
          },
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
              danmaku: '弹幕',
              reply: '评论',
              favorite: '收藏',
              coin: '硬币',
              share: '分享',
              like: '点赞',
            },
            fold: ['播放', '弹幕', '评论', '收藏', '硬币', '分享', '点赞'],
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
