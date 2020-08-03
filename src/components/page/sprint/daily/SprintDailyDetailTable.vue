<template>
  <a-table
      :columns="columns"
      :rowKey="r => r.id"
      :dataSource="sprintDailyRecordList"
      :pagination="pagination"
  >
    <template slot="picRender" slot-scope="pic">
      <img :src="pic" width="100px"/>
    </template>
    <template slot="dayRender" slot-scope="day">
      {{ day }}天
    </template>
    <template slot="actionRender" slot-scope="aid">
      <a-button title="立刻助攻" @click="handlePlayCircleClick(aid)" style="margin-right: 8px"><a-icon type="play-circle"/></a-button>
      <a-button title="查看详情" @click="handleLineChartClick(aid)"><a-icon type="line-chart"/></a-button>
    </template>
  </a-table>
</template>

<script>
export default {
  name: "SprintDailyDetailTable",
  props: {
    sprintDailyRecordList: Array
  },
  data: function() {
    return {
      columns: [{
        title: '封面',
        dataIndex: 'sprint_video.pic',
        width: '120px',
        scopedSlots: { customRender: 'picRender' }
      }, {
        title: '标题',
        dataIndex: 'sprint_video.title',
        width: '40%'
      }, {
        title: 'UP主',
        dataIndex: 'sprint_video.member.name'
      }, {
        title: '播放数',
        dataIndex: 'view',
        sorter: (a, b) => a.view - b.view,
      }, {
        title: '播放增长',
        dataIndex: 'viewincr',
        sorter: (a, b) => a.viewincr - b.viewincr
      }, {
        title: '已用时间',
        dataIndex: 'pday',
        sorter: (a, b) => a.pday - b.pday,
        scopedSlots: { customRender: 'dayRender' }
      }, {
        title: '剩余时间',
        dataIndex: 'lday',
        sorter: (a, b) => a.lday - b.lday,
        scopedSlots: { customRender: 'dayRender' }
      }, {
        title: '相关操作',
        dataIndex: 'aid',
        scopedSlots: { customRender: 'actionRender' }
      }],
      pagination: false
    }
  },
  methods: {
    handlePlayCircleClick: function(aid) {
      window.open('https://www.bilibili.com/video/av' + aid);
    },
    handleLineChartClick: function(aid) {
      this.$router.push("/sprint/av" + aid);
    }
  }
}
</script>
