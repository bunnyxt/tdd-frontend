<template>
  <div>
    <div>
      <a-row>
        <a-col
          :span="size === 'small' ? 24 : size === 'middle' ? 12 : 8"
          :style="{ marginBottom: size === 'small' ? '8px' : 0}"
        >
          <h3>最近更新</h3>
          <tdd-video-stat-bar :stat="stat" :show-name="true" :mode="'vertical'"></tdd-video-stat-bar>
          *{{ $util.tsToDateString(stat.added) }}更新
        </a-col>
        <a-col
          :span="size === 'small' ? 24 : size === 'middle' ? 12 : 8"
        >
          <h3>互动比例</h3>
          <tdd-video-proportion-chart v-if="stat.view > 0" :stat="stat" />
          <a-alert v-else type="error" message="播放数非正，无法计算" />
        </a-col>
<!--        <a-col :span="size === 'small' ? 24 : size === 'middle' ? 24 : 8">-->
<!--          <h3>还没想好</h3>-->
<!--        </a-col>-->
      </a-row>
    </div>
  </div>
</template>

<script>
import TddVideoStatBar from "@/components/common/TddVideoStatBar";
import TddVideoProportionChart from "@/components/common/TddVideoProportionChart";

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
    }
  },
  components: {
    TddVideoStatBar,
    TddVideoProportionChart
  }
}
</script>

<style scoped>

</style>
