<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/sprint">传说助攻</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/sprint/daily">助攻日报</a></a-breadcrumb-item>
      <a-breadcrumb-item><a :href="'/sprint/daily'+this.$route.params.date">{{ this.$route.params.date }}</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div v-if="daily.id != -1">
      <div class="section-block" :style="sectionBlockStyle">
        <h1>助攻日报#{{ this.$route.params.date }}</h1>
        <div v-if="daily.correct == 1">
          <p>本期收录时间范围：<strong>UTC+8 {{ dateStart }} 06:00 ~ {{ dateEnd }} 06:00</strong>，共收录传说冲刺曲目<strong>{{ daily.vidnum }}</strong>首。</p>
          <p>本期传说冲刺曲目播放数总增长<strong>{{ daily.viewincr }}</strong>，与上一期相比<strong>{{ daily.viewincrincr > 0 ? "增长"+daily.viewincrincr:"减少"+(-daily.viewincrincr) }}</strong>。</p>
          <p>传送门：<a-icon type="arrow-left" />助攻日报<a :href="'/sprint/daily/'+lastDate">#{{ lastDate }}</a> 助攻日报<a :href="'/sprint/daily/'+nextDate">#{{ nextDate }}</a><a-icon type="arrow-right" /></p>
        </div>
        <div v-else>
          {{ daily.comment }}
        </div>
      </div>
      <div class="section-seperator"></div>

      <div v-if="daily.newvids.length > 0">
        <div class="section-block" :style="sectionBlockStyle">
          <h2>本期有<strong>{{ daily.newvids.length }}</strong>首新曲</h2>
          <SprintVideoBriefTable :videos="newvidsList"/>
        </div>
        <div class="section-seperator"></div>
      </div>

      <div v-if="daily.millvids.length > 0">
        <div class="section-block" :style="sectionBlockStyle">
          <h2>本期有<strong>{{ daily.millvids.length }}</strong>首曲目达成传说</h2>
          <SprintVideoBriefTable :videos="millvidsList"/>
        </div>
        <div class="section-seperator"></div>
      </div>

      <div class="section-block" :style="sectionBlockStyle">
        <SprintDailyDetailTable :sprintDailyRecordList="sprintDailyRecordList"/>
      </div>
  </div>
  <div v-else>
    <div class="section-block" :style="sectionBlockStyle">
      <p>没有找到助攻日报<a :href="'/sprint/daily/'+this.$route.params.date">#{{ this.$route.params.date }}</a></p>
      <a href="/sprint/daily">返回往期助攻日报</a>
    </div>
  </div>
</div>
</template>

<script>
import SprintVideoBriefTable from "./SprintVideoBriefTable.vue"
import SprintDailyDetailTable from "./SprintDailyDetailTable.vue"

export default {
  name: "SprintDailyDetail",
  components: {
    SprintVideoBriefTable,
    SprintDailyDetailTable
  },
  data: function() {
    return {
      sectionBlockStyle: {
        background: "#fff",
        padding: "24px"
      },
      daily: {
        id: -1,
        correct: 1,
        vidnum: 0,
        newvids: [],
        millvids: [],
        viewincr: 0,
        viewincrincr: 0,
        comment: ""
      },
      sprintDailyRecordList: [],
      newvidsList: [],
      millvidsList: []
    };
  },
  computed: {
    dateStart: function() {
      var date = this.$route.params.date
      var d = new Date()
      d.setFullYear(date.substring(0, 4))
      d.setMonth(date.substring(4, 6) - 1)
      d.setDate(date.substring(6, 8))
      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(0)
      d.setMilliseconds(0)
      var ts = d.valueOf() / 1000 - (60 * 60 * 24)
      var d = new Date(ts * 1000)
      return d.getFullYear() +"-"+ (d.getMonth()+1) +"-"+ d.getDate()
    },
    dateEnd: function() {
      var date = this.$route.params.date
      return date.substring(0, 4) +"-"+ date.substring(4, 6) +"-"+ date.substring(6, 8)
    },
    lastDate: function() {
      var date = this.$route.params.date
      var d = new Date()
      d.setFullYear(date.substring(0, 4))
      d.setMonth(date.substring(4, 6) - 1)
      d.setDate(date.substring(6, 8))
      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(0)
      d.setMilliseconds(0)
      var ts = d.valueOf() / 1000 - (60 * 60 * 24)
      var d = new Date(ts * 1000)
      return "" + d.getFullYear() + ((d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1):(d.getMonth()+1)) + (d.getDate() < 10 ? '0'+d.getDate():d.getDate())
    },
    nextDate: function() {
      var date = this.$route.params.date
      var d = new Date()
      d.setFullYear(date.substring(0, 4))
      d.setMonth(date.substring(4, 6) - 1)
      d.setDate(date.substring(6, 8))
      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(0)
      d.setMilliseconds(0)
      var ts = d.valueOf() / 1000 + (60 * 60 * 24)
      var d = new Date(ts * 1000)
      return "" + d.getFullYear() + ((d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1):(d.getMonth()+1)) + (d.getDate() < 10 ? '0'+d.getDate():d.getDate())
    }
  },
  watch: {
    daily: function(oldDaily, newDaily) {
      var nList = new Array()
      for (var i = 0; i < this.daily.newvids.length; i++) {
        fetch("http://api.bunnyxt.com/tdd/get_sprint_video.php?aid="+this.daily.newvids[i])
          .then(response => response.json())
          .then(json => nList.push(json.data[0]))
      }
      this.newvidsList = nList

      var mList = new Array()
      for (var i = 0; i < this.daily.millvids.length; i++) {
        fetch("http://api.bunnyxt.com/tdd/get_sprint_video.php?aid="+this.daily.millvids[i])
          .then(response => response.json())
          .then(json => mList.push(json.data[0]))
      }
      this.millvidsList = mList
    }
  },
  created: function() {
    fetch("http://api.bunnyxt.com/tdd/get_sprint_daily.php?date="+this.$route.params.date)
      .then(response => response.json())
      .then(json => {
        if (json.data[0]) {
          this.daily = json.data[0]
        }
      })
    fetch("http://api.bunnyxt.com/tdd/get_sprint_daily_record.php?date="+this.$route.params.date)
      .then(response => response.json())
      .then(json => {
        if (json.data) {
          this.sprintDailyRecordList = json.data
        }
      })
  }
}
</script>
