<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "pagi_total": "共 {total} 条记录"
  },
  "en": {
    "pagi_total": "{total} records in total"
  }
}
</i18n>

<template>
  <a-table
    :columns="columns"
    :rowKey="record => record.added"
    :dataSource="videoRecords"
    :pagination="pagination"
    :scroll="{ x: 850 }"
    size="small"
  >
    <template #added="added">
      {{ $util.tsToDateString(added) }}
    </template>
    <template #value="value">
      {{ value.toLocaleString() }}
    </template>
  </a-table>
</template>

<script>
export default {
  name: 'VideoDetailHistoryTable',
  props: {
    videoRecords: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      columns: [
        {
          title: this.$t('time'),
          dataIndex: 'added',
          scopedSlots: { customRender: 'added' },
          sorter: (a, b) => a.added - b.added,
          defaultSortOrder: 'descend',
          width: '168px',
          fixed: 'left',
        }, {
          title: this.$t('view'),
          dataIndex: 'view',
          scopedSlots: { customRender: 'value' },
        }, {
          title: this.$t('danmaku'),
          dataIndex: 'danmaku',
          scopedSlots: { customRender: 'value' },
        }, {
          title: this.$t('reply'),
          dataIndex: 'reply',
          scopedSlots: { customRender: 'value' },
        }, {
          title: this.$t('favorite'),
          dataIndex: 'favorite',
          scopedSlots: { customRender: 'value' },
        }, {
          title: this.$t('coin'),
          dataIndex: 'coin',
          scopedSlots: { customRender: 'value' },
        }, {
          title: this.$t('share'),
          dataIndex: 'share',
          scopedSlots: { customRender: 'value' },
        }, {
          title: this.$t('like'),
          dataIndex: 'like',
          scopedSlots: { customRender: 'value' },
        }
      ],
      pagination: {
        size: 'big',
        showQuickJumper: true,
        showTotal: total => this.$t('pagi_total', { total })
      }
    }
  }
}
</script>

<style scoped>

</style>
