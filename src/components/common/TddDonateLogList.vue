<template>
  <a-table
    :columns="columns"
    :row-key="log => log.id"
    :data-source="donateLogList"
    :loading="isLoadingDonateLogList"
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
  data: function () {
    return {
      isLoadingDonateLogList: false,
      donateLogList: [],
      columns: [
        {
          title: '用户',
          key: 'name',
          dataIndex: 'name',
        },
        {
          title: '时间',
          key: 'added',
          width: 160,
        },
        {
          title: '共计',
          key: 'total',
          width: 120,
        }
      ],
    }
  },
  created() {
    this.fetchDonateLogList();
  },
  methods: {
    fetchDonateLogList: function () {
      this.isLoadingDonateLogList = true;
      this.$axios.get('donatelog')
        .then((response) => {
          this.donateLogList = response.data.sort((a, b) => b.added - a.added);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoadingDonateLogList = false;
        });
    },
  }
};
</script>

<style scoped>

</style>
