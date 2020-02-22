<template>
  <div>
    <div v-wechat-title="$route.meta.title='助攻日报'+this.$route.params.date+' - 天钿Daily'"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/sprint">传说助攻</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/sprint/daily">助攻日报</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ this.$route.params.date }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div v-if="isLoadingDaily">
      <div class="section-block">
        <a-spin :spinning="isLoadingDaily">
          正在查找助攻日报<a :href="'/sprint/daily/'+this.$route.params.date">#{{ this.$route.params.date }}</a>
        </a-spin>
      </div>
    </div>
    <div v-else>
      <div v-if="daily.id != -1">
        <div class="section-block">
          <h1>助攻日报#{{ this.$route.params.date }}</h1>
          <div v-if="daily.correct == 1">
            <p>本期收录时间范围：<strong>UTC+8 {{ dateStart }} 06:00 ~ {{ dateEnd }} 06:00</strong>，共收录传说冲刺曲目<strong>{{ daily.vidnum }}</strong>首。</p>
            <p>本期传说冲刺曲目播放数总增长<strong>{{ daily.viewincr }}</strong>，与上一期相比<strong>{{ daily.viewincrincr > 0 ? "增长"+daily.viewincrincr:"减少"+(-daily.viewincrincr) }}</strong>。</p>
          </div>
          <div v-else>
            <a-alert type="error" :message="daily.comment" banner style="margin-bottom: 12px"/>
          </div>
          <p>传送门：<a-icon type="arrow-left" />助攻日报<a :href="'/sprint/daily/'+lastDate">#{{ lastDate }}</a> 助攻日报<a :href="'/sprint/daily/'+nextDate">#{{ nextDate }}</a><a-icon type="arrow-right" /></p>
        </div>
        <div class="section-separator"></div>

        <div v-if="daily.newvids.length > 0">
          <div class="section-block">
            <h2>本期有<strong>{{ daily.newvids.length }}</strong>首新曲</h2>
            <a-spin :spinning="isLoadingNewVids">
             <SprintVideoBriefTable :videos="newvidsList"/>
            </a-spin>
          </div>
          <div class="section-separator"></div>
        </div>

        <div v-if="daily.millvids.length > 0">
          <div class="section-block">
            <h2>本期有<strong>{{ daily.millvids.length }}</strong>首曲目达成传说</h2>
            <a-spin :spinning="isLoadingMillVids">
              <SprintVideoBriefTable :videos="millvidsList"/>
            </a-spin>
          </div>
          <div class="section-separator"></div>
        </div>

        <div v-if="daily.correct == 1">
          <div class="section-block">
            <a-spin :spinning="isLoadingRecords">
              <SprintDailyDetailTable :sprintDailyRecordList="sprintDailyRecordList"/>
            </a-spin>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="section-block">
          <p>没有找到助攻日报<a :href="'/sprint/daily/'+this.$route.params.date">#{{ this.$route.params.date }}</a></p>
          <a href="/sprint/daily">返回往期助攻日报</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SprintVideoBriefTable from "../SprintVideoBriefTable.vue"
import SprintDailyDetailTable from "./SprintDailyDetailTable.vue"

export default {
  name: "SprintDailyDetail",
  components: {
    SprintVideoBriefTable,
    SprintDailyDetailTable
  },
  data: function() {
    return {
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
      millvidsList: [],
      isLoadingDaily: false,
      isLoadingRecords: false,
      isLoadingNewVids: false,
      isLoadingMillVids: false
    };
  },
  computed: {
    dateStart: function() {
      let date = this.$route.params.date
      let d = new Date()
      d.setFullYear(date.substring(0, 4))
      d.setMonth(date.substring(4, 6) - 1)
      d.setDate(date.substring(6, 8))
      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(0)
      d.setMilliseconds(0)
      let ts = d.valueOf() / 1000 - (60 * 60 * 24)
      d = new Date(ts * 1000)
      return d.getFullYear() +"-"+ (d.getMonth()+1) +"-"+ d.getDate()
    },
    dateEnd: function() {
      let date = this.$route.params.date
      let d = new Date()
      d.setFullYear(date.substring(0, 4))
      d.setMonth(date.substring(4, 6) - 1)
      d.setDate(date.substring(6, 8))
      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(0)
      d.setMilliseconds(0)
      return d.getFullYear() +"-"+ (d.getMonth()+1) +"-"+ d.getDate()
    },
    lastDate: function() {
      let date = this.$route.params.date
      let d = new Date()
      d.setFullYear(date.substring(0, 4))
      d.setMonth(date.substring(4, 6) - 1)
      d.setDate(date.substring(6, 8))
      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(0)
      d.setMilliseconds(0)
      let ts = d.valueOf() / 1000 - (60 * 60 * 24)
      d = new Date(ts * 1000)
      return "" + d.getFullYear() + ((d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1):(d.getMonth()+1)) + (d.getDate() < 10 ? '0'+d.getDate():d.getDate())
    },
    nextDate: function() {
      let date = this.$route.params.date
      let d = new Date()
      d.setFullYear(date.substring(0, 4))
      d.setMonth(date.substring(4, 6) - 1)
      d.setDate(date.substring(6, 8))
      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(0)
      d.setMilliseconds(0)
      let ts = d.valueOf() / 1000 + (60 * 60 * 24)
      d = new Date(ts * 1000)
      return "" + d.getFullYear() + ((d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1):(d.getMonth()+1)) + (d.getDate() < 10 ? '0'+d.getDate():d.getDate())
    }
  },
  watch: {
    daily: function() {
      // TODO async error may occor here
      this.isLoadingNewVids = true
      let nList = new Array()
      for (let i = 0; i < this.daily.newvids.length; i++) {
        fetch(this.$store.state.apiBase + "sprint_video.php?aid="+this.daily.newvids[i])
          .then(response => response.json())
          .then(json => nList.push(json.data[0]))
      }
      this.newvidsList = nList
      this.isLoadingNewVids = false

      this.isLoadingMillVids = true
      let mList = new Array()
      for (let i = 0; i < this.daily.millvids.length; i++) {
        fetch(this.$store.state.apiBase + "sprint_video.php?aid="+this.daily.millvids[i])
          .then(response => response.json())
          .then(json => mList.push(json.data[0]))
      }
      this.millvidsList = mList
      this.isLoadingMillVids = false
    }
  },
  created: function() {
    // TODO rewrite get info method to support router-view
    this.isLoadingDaily = true
    this.isLoadingRecords = true
    fetch(this.$store.state.apiBase + "sprint_daily.php?date="+this.$route.params.date)
      .then(response => response.json())
      .then(json => {
        if (json.data[0]) {
          this.daily = json.data[0]
        }
      })
      .then(() => this.isLoadingDaily = false)
    fetch(this.$store.state.apiBase + "sprint_daily_record.php?date="+this.$route.params.date)
      .then(response => response.json())
      .then(json => {
        if (json.data) {
          this.sprintDailyRecordList = json.data
          this.sprintDailyRecordList.sort(
            (o1, o2) => o2.view - o1.view
          )
        }
      })
      .then(() => this.isLoadingRecords = false)
  }
}
</script>
