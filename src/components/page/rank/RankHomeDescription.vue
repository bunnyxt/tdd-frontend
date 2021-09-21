<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "start_time": "开始时间",
    "end_time": "结束时间",
    "arch_time_range_prompt": "{rank_name}统计时间范围{time_range}，北京时间{arch_time}归档当前期数据，开始新一期排行",
    "real-time_update_interval_prompt": "实时数据{interval}更新一次，存在几分钟更新延迟",
    "rank_name": {
      "hourly": "小时榜",
      "daily": "日榜",
      "weekly": "周榜",
      "monthly": "月榜",
      "yearly": "年榜"
    },
    "time_related": {
      "hourly": "每小时",
      "according_to_zk": "与周刊同步",
      "sat_0300": "每周六凌晨三点",
      "according_to_tdd_month": "以TDD月为准",
      "01_0400": "每月一日凌晨四点"
    }
  },
  "en": {
    "start_time": "Start Time",
    "end_time": "End Time",
    "arch_time_range_prompt": "{rank_name}'s counting period {time_range}, archiving current round ranking {arch_time} GMT+8, then start the new round of ranking.",
    "real-time_update_interval_prompt": "Real-time ranking updates {interval}, several minutes delay may occur.",
    "rank_name": {
      "hourly": "Hourly Ranking",
      "daily": "Daily Ranking",
      "weekly": "Weekly Ranking",
      "monthly": "Monthly Ranking",
      "yearly": "Yearly Ranking"
    },
    "time_related": {
      "hourly": "hourly",
      "according_to_zk": "according to the Weekly",
      "sat_0300": "at Sat. 3 AM",
      "according_to_tdd_month": "according to TDD month",
      "01_0400": "at 4 AM on the first day of every month"
    }
  }
}
</i18n>

<template>
  <div>
    <div class="line-1">{{ $t('start_time') }}{{ $t('colon') }}{{ $util.tsToDateString(startTs) }}</div>
    <div class="line-1">{{ $t('end_time') }}{{ $t('colon') }}{{ $util.tsToDateString(endTs) }}</div>
    <div class="line-2" :title="archTimeRangePrompt" style="margin-top: 8px">*{{ archTimeRangePrompt }}</div>
    <div class="line-1" :title="realTimeUpdateIntervalPrompt">*{{ realTimeUpdateIntervalPrompt }}</div>
  </div>
</template>

<script>
export default {
  name: 'RankHomeDescription',
  props: {
    rankName: {
      type: String,
      required: true,
    },
    startTs: {
      type: Number,
      required: true,
    },
    endTs: {
      type: Number,
      required: true,
    },
  },
  data: function () {
    return {
      description: {
        weekly: {
          name: this.$t('rank_name.weekly'),
          timeRange: this.$t('time_related.according_to_zk'),
          archiveTime: this.$t('time_related.sat_0300'),
          updateInterval: this.$t('time_related.hourly'),
        },
        monthly: {
          name: this.$t('rank_name.monthly'),
          timeRange: this.$t('time_related.according_to_tdd_month'),
          archiveTime: this.$t('time_related.01_0400'),
          updateInterval: this.$t('time_related.hourly'),
        },
      },
    }
  },
  computed: {
    archTimeRangePrompt: function () {
      const currDescription = this.description[this.rankName];
      return this.$t('arch_time_range_prompt', {
        rank_name: currDescription.name,
        time_range: currDescription.timeRange,
        arch_time: currDescription.archiveTime,
      });
    },
    realTimeUpdateIntervalPrompt: function () {
      const currDescription = this.description[this.rankName];
      return this.$t('real-time_update_interval_prompt', {
        interval: currDescription.updateInterval,
      });
    },
  }
}
</script>

<style scoped>

</style>
