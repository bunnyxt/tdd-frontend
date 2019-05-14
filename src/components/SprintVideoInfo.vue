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
            <div v-if="records != null">
              <p>昨日增速：{{ daySpeed }}</p>
              <p>已用时间：{{ passedTime }}日</p>
              <p>还需时间：{{ needTime }}日</p>
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
    promotionReason: String,
    records: Array
  },
  data: function() {
    return {

    }
  },
  computed: {
    latestUpdateTime: function() {
      return this.video.latestVideoRecord.added
    },
    passedTime: function() {
      return parseInt((this.latestUpdateTime - this.video.created) / (60 * 60 * 24))
    },
    daySpeed: function() {
      var ts2 = this.latestUpdateTime - this.latestUpdateTime % (60 * 60 * 24) - (60 * 60 * 8) // UTC+8
      if ((this.latestUpdateTime - (60 * 60 * 8) % (60 * 60 * 24)) > (60 * 60 * 6)) { // UTC+8
        ts2 += (60 * 60 * 6)
      } else {
        ts2 -= (60 * 60 * 18)
      }
      var ts1 = ts2 - (60 * 60 * 24)
      var v2 = 0
      var v1 = this.records[0].view
      var flag = false
      for (var i = this.records.length - 1; i >= 0; i--){
        var added = this.records[i].added
        var view = this.records[i].view
        if (flag == false) {
          if (added < ts2) {
            flag = true
          } else {
            v2 = view
          }
        } else {
          if (added < ts1) {
            break;
          } else {
            v1 = view
          }
        }
      }
      return v2 - v1
    },
    needTime: function() {
      return parseInt((1000000 - this.video.latestVideoRecord.view) / this.daySpeed)
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
