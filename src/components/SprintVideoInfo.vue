<template>
  <div v-if="JSON.stringify(video) != '{}'">
    <a-list
      itemLayout="vertical"
      :dataSource="[video]"
    >
      <a-list-item slot="renderItem" slot-scope="item" key="item.id">
        <a-list-item-meta>
          <a slot="title" :href="'/sprint/av'+item.aid"><h3>{{ item.title }}</h3></a>
          <div slot="description">
            <p><a-avatar size="small" :src="item.face" style="margin-right:12px"/>{{ item.name }}</p>
            <p>投稿时间：{{ formatDate(item.created) }}</p>
            <p>最后更新时间：{{ formatDate(item.latestVideoRecord.added) }}</p>
            <p>当前播放：{{ item.latestVideoRecord.view }}</p>
            <div v-if="promotionReason != null">
              <p>推荐理由：{{ promotionReason }}</p>
            </div>
          </div>
        </a-list-item-meta>
        <img slot="extra" width="200" alt="pic" :src="item.pic" style="margin-bottom:12px"/>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
export default {
  name: "SprintVideoInfo",
  props: {
    video: Object,
    promotionReason: String
  },
  data: function() {
    return {

    }
  },
  methods: {
    formatDate: function(ts) {
      var date = new Date(ts * 1000)
      return (
        date.getFullYear() + "-" + 
        (date.getMonth()+1) + "-" + 
        date.getDate() + " " + 
        (date.getHours()<10?"0"+date.getHours():date.getHours()) + ":" + 
        (date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes()) + ":" + 
        (date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds())
      )
    }
  }
}
</script>
