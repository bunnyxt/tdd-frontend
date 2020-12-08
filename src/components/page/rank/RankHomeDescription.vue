<template>
  <div>
    <div class="line-1">开始时间：{{ $util.tsToDateString(startTs) }}</div>
    <div class="line-1">统计时间：{{ $util.tsToDateString(endTs) }}</div>
    <div class="line-2" style="margin-top: 8px">*周榜统计时间范围与周刊同步，北京时间每周六凌晨三点归档当前期数据，开始新一期排行</div>
    <div class="line-1">*实时数据每小时更新一次，存在几分钟更新延迟</div>
  </div>
</template>

<script>
export default {
  name: 'RankHomeDescription',
  props: {
    startTs: {
      type: Number,
      required: true,
    },
    endTs: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style scoped>

</style>
