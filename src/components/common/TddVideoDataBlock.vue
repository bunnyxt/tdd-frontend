<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "latest_update": "最近更新",
    "interaction_ratio": "互动比例",
    "weekly_rank": "周榜排行",
    "view_not_positive_error": "播放数非正，无法计算"
  },
  "en": {
    "latest_update": "Latest Update",
    "interaction_ratio": "Interaction Ratio",
    "weekly_rank": "Weekly Rank",
    "view_not_positive_error": "Cannot calc due to non-positive view value."
  }
}
</i18n>

<template>
  <div>
    <div>
      <a-row :gutter="16">
        <a-col
          :span="size === 'small' ? 24 : size === 'middle' ? 12 : 8"
          :style="{ marginBottom: size === 'small' || size === 'middle' ? '16px' : 0}"
        >
          <h3>{{ $t('latest_update') }}</h3>
          <tdd-video-stat-bar :stat="stat" :show-name="true" :mode="'vertical'"></tdd-video-stat-bar>
          *{{ $util.tsToDateString(stat.added) }}{{ $t('updated_suffix') }}
        </a-col>
        <a-col
          :span="size === 'small' ? 24 : size === 'middle' ? 12 : 8"
          :style="{ marginBottom: size === 'small' || size === 'middle' ? '16px' : 0}"
        >
          <h3>{{ $t('interaction_ratio') }}</h3>
          <tdd-video-proportion-chart v-if="stat.view > 0" :stat="stat" />
          <a-alert v-else type="error" :message="$t('view_not_positive_error')" banner />
        </a-col>
        <a-col :span="size === 'small' ? 24 : size === 'middle' ? 24 : 8">
          <h3>{{ $t('weekly_rank') }}</h3>
          <tdd-video-rank-weekly-brief :bvid="bvid" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import TddVideoStatBar from "@/components/common/TddVideoStatBar";
import TddVideoProportionChart from "@/components/chart/TddVideoProportionChart";
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
