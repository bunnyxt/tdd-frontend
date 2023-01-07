<template>
  <div v-if="JSON.stringify(video) != '{}'">
    <a-list
      itemLayout="vertical"
      :dataSource="[video]"
    >
      <template #renderItem="{ item }">
        <a-list-item key="item.id">
          <a-list-item-meta>
            <template #title>
              <h3 style="margin-bottom: 24px">{{ item.title }}</h3>
            </template>
            <template #description>
              <div>
                <p><a-avatar size="small" :src="$util.httpS(item.member.face)" style="margin-right:12px"/><a :href="'https://space.bilibili.com/'+item.mid" target="_blank">{{ item.member.name }}</a></p>
                <p>投稿时间：{{ formatDate(item.created) }}</p>
                <p>最后更新时间：{{ formatDate(item.last_record.added) }}</p>
                <p>当前播放：{{ item.last_record.view }}</p>
                <div v-if="promotionReason != null">
                  <p>推荐理由：{{ promotionReason }}</p>
                </div>
                <div v-if="records != null">
                  <p>昨日增速：{{ daySpeed }}</p>
                  <p>已用时间：{{ passedTime }}日</p>
                  <p>还需时间：{{ needTime }}日</p>
                </div>
              </div>
            </template>
          </a-list-item-meta>
          <template #extra>
            <a-card
              hoverable
              style="margin: 0px 0px 12px 0px; width:200px"
            >
              <template #cover>
                <img
                  width="198"
                  height="124"
                  alt="pic"
                  :src="$util.httpS(item.pic)"
                  @click="handleLineChartClick"
                >
              </template>
              <template #actions>
                <div class="ant-card-actions">
                  <play-circle-outlined title="立刻助攻" @click="handlePlayCircleClick"/>
                  <line-chart-outlined title="查看详情" @click="handleLineChartClick"/>
                </div>
              </template>
            </a-card>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script>
import { PlayCircleOutlined, LineChartOutlined } from '@ant-design/icons-vue';

export default {
  name: "SprintVideoInfo",
  components: {
    PlayCircleOutlined,
    LineChartOutlined,
  },
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
      return this.video.last_record.added
    },
    passedTime: function() {
      return parseInt((this.latestUpdateTime - this.video.created) / (60 * 60 * 24))
    },
    daySpeed: function() {
      if (this.records.length == 0) {
        return 0;
      }
      let ts2 = this.latestUpdateTime - this.latestUpdateTime % (60 * 60 * 24) - (60 * 60 * 8) // UTC+8
      if ((this.latestUpdateTime - (60 * 60 * 8) % (60 * 60 * 24)) > (60 * 60 * 6)) { // UTC+8
        ts2 += (60 * 60 * 6)
      } else {
        ts2 -= (60 * 60 * 18)
      }
      let ts1 = ts2 - (60 * 60 * 24)
      let v2 = 0
      let v1 = this.records[0].view
      let flag = false
      for (let i = this.records.length - 1; i >= 0; i--){
        let added = this.records[i].added
        let view = this.records[i].view
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
      return parseInt((1000000 - this.video.last_record.view) / this.daySpeed)
    }
  },
  methods: {
    formatDate: function(ts) {
      let date = new Date(ts * 1000)
      return (
        date.getFullYear() + "-" +
        (date.getMonth()+1) + "-" +
        date.getDate() + " " +
        (date.getHours()<10?"0"+date.getHours():date.getHours()) + ":" +
        (date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes()) + ":" +
        (date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds())
      )
    },
    handlePlayCircleClick: function() {
      window.open('https://www.bilibili.com/video/av' + this.video.aid);
    },
    handleLineChartClick: function() {
      this.$router.push("/sprint/av" + this.video.aid);
    }
  }
}
</script>
