<template>
  <div>
    <div>
      <a-row :gutter="16">
        <a-col
          :span="size === 'small' ? 24 : size === 'middle' ? 12 : 8"
          :style="{ marginBottom: size === 'small' || size === 'middle' ? '16px' : 0}"
        >
          <h3>最近更新</h3>
          <tdd-video-stat-bar :stat="stat" :show-name="true" :mode="'vertical'"></tdd-video-stat-bar>
          *{{ $util.tsToDateString(stat.added) }}更新
        </a-col>
        <a-col
          :span="size === 'small' ? 24 : size === 'middle' ? 12 : 8"
          :style="{ marginBottom: size === 'small' || size === 'middle' ? '16px' : 0}"
        >
          <h3>互动比例</h3>
          <tdd-video-proportion-chart v-if="stat.view > 0" :stat="stat" />
          <a-alert v-else type="error" message="播放数非正，无法计算" />
        </a-col>
        <a-col :span="size === 'small' ? 24 : size === 'middle' ? 24 : 8">
          <h3>周榜排行</h3>
          <tdd-video-rank-weekly-brief :bvid="bvid" :size="size" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import TddVideoStatBar from "@/components/common/TddVideoStatBar";
import TddVideoProportionChart from "@/components/common/TddVideoProportionChart";
import TddVideoRankWeeklyBrief from "@/components/common/TddVideoRankWeeklyBrief";

export default {
  name: 'TddVideoDataBlock',
  props: {
    stat: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'middle'
    },
    bvid: {
      type: String,
      required: true
    }
  },
  components: {
    TddVideoStatBar,
    TddVideoProportionChart,
    TddVideoRankWeeklyBrief
  }
}
</script>

<style scoped>

</style>
