<template>
  <a-table
    :columns="columns"
    :rowKey="log => log.id"
    :dataSource="donateLogList"
    :showHeader="false"
    :pagination="{
      pageSize: 10,
      hideOnSinglePage: true,
    }"
    size="small"
  >
    <template #added="added">
      {{ $util.tsToDateString(added, 'yyyy-MM-dd') }}
    </template>
    <template #money="item">
      <span :title="`¥ ${item.amount} * ${item.timespan}个月`">¥ {{ item.amount * item.timespan}}</span>
    </template>
  </a-table>
</template>

<script>
export default {
  name: 'TddDonateLogList',
  props: {
    donateLogList: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      columns: [
        {
          title: '用户',
          dataIndex: 'name',
        }, {
          title: '时间',
          dataIndex: 'added',
          scopedSlots: { customRender: 'added' },
        }, {
          title: '共计',
          scopedSlots: { customRender: 'money' },
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
