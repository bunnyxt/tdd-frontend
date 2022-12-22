<template>
  <a-table
    :columns="columns"
    :rowKey="r => r.id"
    :dataSource="sprintDailyRecordList"
    :pagination="pagination"
  >
    <template #picRender="pic">
      <img :src="$util.httpS(pic)" width="100px"/>
    </template>
    <template #dayRender="day">
      {{ day }}天
    </template>
    <template #actionRender="aid">
      <a-button title="立刻助攻" @click="handlePlayCircleClick(aid)" style="margin-right: 8px"><play-circle-outlined /></a-button>
      <a-button title="查看详情" @click="handleLineChartClick(aid)"><line-chart-outlined /></a-button>
    </template>
  </a-table>
</template>

<script>
import { PlayCircleOutlined, LineChartOutlined } from "@ant-design/icons-vue";

export default {
  name: "SprintDailyDetailTable",
  components: {
    PlayCircleOutlined,
    LineChartOutlined,
  },
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
