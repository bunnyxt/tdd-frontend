<template>
  <a-table
    :columns="columns"
    :rowKey="record => record.added"
    :dataSource="videoRecords"
    :pagination="pagination"
    :scroll="{ x: 800 }"
    size="small"
  >
    <template slot="added" slot-scope="added">
      {{ $util.tsToDateString(added) }}
    </template>
    <template slot="value" slot-scope="value">
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
          title: '时间',
          dataIndex: 'added',
          scopedSlots: { customRender: 'added' },
          sorter: (a, b) => a.added - b.added,
          defaultSortOrder: 'descend',
          width: '168px',
          fixed: 'left',
        }, {
          title: '播放',
          dataIndex: 'view',
          scopedSlots: { customRender: 'value' },
        }, {
          title: '弹幕',
          dataIndex: 'danmaku',
          scopedSlots: { customRender: 'value' },
        }, {
          title: '评论',
          dataIndex: 'reply',
          scopedSlots: { customRender: 'value' },
        }, {
          title: '收藏',
          dataIndex: 'favorite',
          scopedSlots: { customRender: 'value' },
        }, {
          title: '硬币',
          dataIndex: 'coin',
          scopedSlots: { customRender: 'value' },
        }, {
          title: '分享',
          dataIndex: 'share',
          scopedSlots: { customRender: 'value' },
        }, {
          title: '点赞',
          dataIndex: 'like',
          scopedSlots: { customRender: 'value' },
        }
      ],
      pagination: {
        size: 'big',
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条记录`
      }
    }
  }
}
</script>

<style scoped>

</style>
