<template>
  <a-table
      :columns="columns"
      :rowKey="record => record.added"
      :dataSource="videoRecords"
      :pagination="pagination"
      :scroll="{ x: 700 }"
      size="small"
  >
    <template slot="added" slot-scope="added">
      {{ $util.tsToDateString(added) }}
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
          }, {
            title: '弹幕',
            dataIndex: 'danmaku',
          }, {
            title: '评论',
            dataIndex: 'reply',
          }, {
            title: '收藏',
            dataIndex: 'favorite',
          }, {
            title: '硬币',
            dataIndex: 'coin',
          }, {
            title: '分享',
            dataIndex: 'share',
          }, {
            title: '点赞',
            dataIndex: 'like',
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