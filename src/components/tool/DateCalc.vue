<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/tool">辅助工具</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>耗时计算</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>耗时计算</h1>
      <p>输入起止时间，计算所消耗的时间长度，可用于计算曲目传说/殿堂耗时。</p>
      <p>开始时间：
        <a-input placeholder="yyyy-MM-dd HH:mm:ss" v-model="startTimeString" style="width: 180px"></a-input>
        <a-input-search placeholder="视频AV号" addonBefore="av" v-model="aidString" style="margin-left: 12px; width: 160px" @search="getCreatedTs"/>
        <span style="margin-left: 12px">{{ createdTimeMessage }}</span>
      </p>
      <p>结束时间：
        <a-input placeholder="yyyy-MM-dd HH:mm:ss" v-model="endTimeString" style="width: 180px"></a-input>
        <a-button type="default" style="margin-left: 12px" @click="refreshEndTime">刷新</a-button>
        <a-switch style="margin-left: 12px" :checked="needAutoRefresh" @change='onAutoRefreshSwitchChange'/>
        <span style="margin-left: 12px">自动刷新</span>
      </p>
      <p>所耗时长：
        <a-input v-model="timePassed" style="width: 180px"></a-input>
      </p>
    </div> 
  </div>
</template>

<script>
import { setInterval, clearInterval } from 'timers';
export default {
  name: "DateCalc",
  data: function() {
    return {
      startTimeString: "2013-01-31 19:29:40",
      endTimeString: "2013-01-31 19:29:40",
      aidString: "",
      createdTimeMessage: "",
      needAutoRefresh: true,
      autoRefreshTimer: {},
      isGettingCreatedTs: false
    }
  },
  computed: {
    timePassed: function() {
      let startTime = new Date(this.startTimeString.replace(/-/g, '/'))
      let endTime = new Date(this.endTimeString.replace(/-/g, '/'))
      let ts = (endTime.valueOf() - startTime.valueOf()) / 1000
      if (ts < 0) {
        return "-"+this.tsToString(-ts)
      } else {
        return this.tsToString(ts)
      }
    }
  },
  methods: {
    formatDate: function(date) {
      let str = ""
      str += date.getFullYear()
      str += "-"
      str += this.addZero(date.getMonth()+1)
      str += "-"
      str += this.addZero(date.getDate())
      str += " "
      str += this.addZero(date.getHours())
      str += ":"
      str += this.addZero(date.getMinutes())
      str += ":"
      str += this.addZero(date.getSeconds())
      return str
    },
    addZero: function(value) {
      return value < 10 ? "0"+value : ""+value
    },
    tsToString: function(ts) {
      let day = parseInt(ts / (60 * 60 * 24))
      let hour = parseInt((ts - day * (60 * 60 * 24)) / (60 * 60))
      let minute = parseInt((ts - day * (60 * 60 * 24) - hour * (60 * 60)) / 60)
      let second = parseInt(ts - day * (60 * 60 * 24) - hour * (60 * 60) - minute * 60)
      return day+"日"+this.addZero(hour)+"时"+this.addZero(minute)+"分"+this.addZero(second)+"秒"
    },
    refreshEndTime: function() {
      let nowTime = new Date()
      this.endTimeString = this.formatDate(nowTime)
    },
    getCreatedTs: function() {
      this.isGettingCreatedTs = true
      this.createdTimeMessage = "正在获取视频投稿时间..."
      fetch("http://api.bunnyxt.com/tdd/bapi_view.php?aid=" + this.aidString)
        .then(response => response.json())
        .then(json => {
          let date
          switch (json.code) {
            case 0:
              date = new Date()
              date.setTime(json.data.pubdate * 1000)
              this.startTimeString = this.formatDate(date)
              this.createdTimeMessage = json.data.title
              break;
            default:
              this.createdTimeMessage = json.message
              break;
          }
        })
      this.isGettingCreatedTs = false
    },
    onAutoRefreshSwitchChange: function() {
      this.needAutoRefresh = !this.needAutoRefresh;
      if (this.needAutoRefresh) {
        this.refreshEndTime()
        this.autoRefreshTimer = setInterval(this.refreshEndTime, 1000)
      } else {
        clearInterval(this.autoRefreshTimer)
      }
    }
  },
  mounted: function() {
    this.refreshEndTime()
    this.autoRefreshTimer = setInterval(this.refreshEndTime, 1000)
  }
}
</script>
