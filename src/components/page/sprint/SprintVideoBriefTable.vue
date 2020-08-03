<template>
  <a-table
      :columns="columns"
      :rowKey="r => r.id"
      :dataSource="videos"
      :pagination="pagination"
  >
    <template slot="picRender" slot-scope="pic">
      <img :src="pic" width="100px"/>
    </template>
    <template slot="actionRender" slot-scope="aid">
      <a-button title="立刻助攻" @click="handlePlayCircleClick(aid)" style="margin-right: 8px"><a-icon type="play-circle"/></a-button>
      <a-button title="查看详情" @click="handleLineChartClick(aid)"><a-icon type="line-chart"/></a-button>
    </template>
    <template slot="dateRender" slot-scope="ts">
      {{ $util.tsToDateString(ts) }}
    </template>
  </a-table>
</template>

<script>
export default {
  name: "SprintVideoBriefTable",
  props: {
    videos: Array
  },
  data: function() {
    return {
      columns: [{
        title: '封面',
        dataIndex: 'pic',
        width: '120px',
        scopedSlots: { customRender: 'picRender' }
      }, {
        title: '标题',
        dataIndex: 'title',
        width: '40%'
      }, {
        title: 'UP主',
        dataIndex: 'name'
      }, {
        title: '投稿时间',
        dataIndex: 'created',
        scopedSlots: { customRender: 'dateRender' }
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
  },
}
</script>

