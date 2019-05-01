<template>
  <a-table :columns="columns"
    :rowKey="r => r.id"
    :dataSource="promotionVideos"
    :pagination="pagination"
  >
    <template slot="picRender" slot-scope="pic">
      <img :src="pic" width="100px"/>
    </template>
    <template slot="actionRender" slot-scope="aid">
      <a-button title="立刻助攻" @click="handlePlayCircleClick(aid)" style="margin-right: 8px"><a-icon type="play-circle"/></a-button>
      <a-button title="查看详情" @click="handleLineChartClick(aid)"><a-icon type="line-chart"/></a-button>
    </template>
  </a-table>
</template>

<script>
export default {
  name: "SprintPromotionTable",
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
        title: '相关操作',
        dataIndex: 'aid',
        scopedSlots: { customRender: 'actionRender' }
      }],
      pagination: false
    }
  },
  computed: {
    promotionVideos: function() {
      var list = []
      if (this.videos.length > 0) {
        var mostViewed = this.videos[0]
        var mostViewedIndex = 0
        var earliestCreated = this.videos[0]
        var earliestCreatedIndex = 0
        for (var i = 0; i < this.videos.length; i++) {
          var video = this.videos[i]
          if (video.latestVideoRecord.view > mostViewed.latestVideoRecord.view) {
            mostViewed = video
            mostViewedIndex = i
          }
          if (video.created < earliestCreated.created) {
            earliestCreated = video
            earliestCreatedIndex = i
          }
        }
        var randomSelected = this.videos[0]

          var randomSelectedIndex = Math.floor(Math.random() * this.videos.length);
          console.log(randomSelectedIndex)
          if (randomSelectedIndex != mostViewedIndex && randomSelectedIndex != earliestCreatedIndex) {
            randomSelected = this.videos[randomSelectedIndex]
          }

        list.push(mostViewed)
        list.push(earliestCreated)
        list.push(randomSelected)
      }
      return list
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
