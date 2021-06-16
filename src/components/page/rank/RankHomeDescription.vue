<template>
  <div>
    <div class="line-1">开始时间：{{ $util.tsToDateString(startTs) }}</div>
    <div class="line-1">统计时间：{{ $util.tsToDateString(endTs) }}</div>
    <div class="line-2" style="margin-top: 8px">*{{ description[rankName].name }}统计时间范围{{ description[rankName].timeRange }}，北京时间{{ description[rankName].archiveTime }}归档当前期数据，开始新一期排行</div>
    <div class="line-1">*实时数据{{ description[rankName].updateInterval }}更新一次，存在几分钟更新延迟</div>
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
          name: '周榜',
          timeRange: '与周刊同步',
          archiveTime: '每周六凌晨三点',
          updateInterval: '每小时',
        },
        monthly: {
          name: '月榜',
          timeRange: '以TDD月为准',
          archiveTime: '每月一日凌晨四点',
          updateInterval: '每小时',
        },
      },
    }
  },
}
</script>

<style scoped>

</style>
