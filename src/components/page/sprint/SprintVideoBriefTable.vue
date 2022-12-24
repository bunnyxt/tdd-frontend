<template>
  <a-table
    :columns="columns"
    :rowKey="r => r.id"
    :dataSource="videos"
    :pagination="pagination"
  >
    <template #picRender="pic">
      <img
        :src="$util.httpS(pic)"
        width="100px"
      >
    </template>
    <template #actionRender="aid">
      <a-button title="立刻助攻" @click="handlePlayCircleClick(aid)" style="margin-right: 8px"><play-circle-outlined /></a-button>
      <a-button title="查看详情" @click="handleLineChartClick(aid)"><line-chart-outlined /></a-button>
    </template>
    <template #dateRender="ts">
      {{ $util.tsToDateString(ts) }}
    </template>
  </a-table>
</template>

<script>
import { PlayCircleOutlined, LineChartOutlined } from "@ant-design/icons-vue";

export default {
  name: "SprintVideoBriefTable",
  components: {
    PlayCircleOutlined,
    LineChartOutlined,
  },
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

