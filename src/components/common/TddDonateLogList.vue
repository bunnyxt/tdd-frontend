<template>
  <a-table
    :columns="columns"
    :row-key="log => log.id"
    :data-source="donateLogList"
    :show-header="false"
    :pagination="{
      pageSize: 10,
      hideOnSinglePage: true,
    }"
    size="small"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'added'">
        {{ $util.tsToDateString(record.added, 'yyyy-MM-dd') }}
      </template>
      <template v-else-if="column.key === 'total'">
        <span :title="`¥ ${record.amount} * ${record.timespan}个月`">¥ {{ record.amount * record.timespan }}</span>
      </template>
    </template>
  </a-table>
</template>

<script>
export default {
  name: 'TddDonateLogList',
  props: {
    donateLogList: {
      type: Array,
      required: true,
    },
  },
  data: function () {
    return {
      columns: [
        {
          title: '用户',
          key: 'name',
          dataIndex: 'name',
        },
        {
          title: '时间',
          key: 'added',
          dataIndex: 'added',
        },
        {
          title: '共计',
          key: 'total',
        }
      ],
    }
  },
};
</script>

<style scoped>

</style>
