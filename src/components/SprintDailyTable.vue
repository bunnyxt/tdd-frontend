<template>
  <a-table :columns="columns"
    :rowKey="r => r.id"
    :dataSource="sprintDailyList"
    :pagination="pagination"
  >
    <template slot="titleRender" slot-scope="date">
      助攻日报<a :href="'/sprint/daily/'+date">#{{date}}</a>
    </template>
  </a-table>
</template>

<script>
export default {
  name: "SprintDailyTable",
  props: {
    sprintDailyList: Array,
    showPagi: Boolean
  },
  data: function() {
    return {
      columns: [{
        title: '标题',
        dataIndex: 'date',
        scopedSlots: { customRender: 'titleRender' },
      }, {
        title: '播放总增长',
        dataIndex: 'viewincr',
      }, {
        title: '环比增长',
        dataIndex: 'viewincrincr',
      }],
      pagination: {}
    }
  },
  mounted: function () {
    if (!this.showPagi) {
      this.pagination = false
    }
  }
}
</script>
