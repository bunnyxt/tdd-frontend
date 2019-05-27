<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/tool">辅助工具</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/tool/datecalc">耗时计算</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>耗时计算</h1>
      <p>输入起止时间，计算所消耗的时间长度，可用于计算曲目传说/殿堂耗时。</p>
      <p>开始时间：<a-input placeholder="yyyy-MM-dd HH:mm:ss" v-model="startTimeString" style="width: 180px"></a-input></p>
      <p>结束时间：<a-input placeholder="yyyy-MM-dd HH:mm:ss" v-model="endTimeString" style="width: 180px"></a-input></p>
      <p>所耗时长：<a-input v-model="timePassed" style="width: 180px"></a-input></p>
    </div> 
  </div>
</template>

<script>
export default {
  name: "DateCalc",
  data: function() {
    return {
      sectionBlockStyle: {
        background: "#FFF",
        padding: "24px"
      },
      startTimeString: "2013-01-31 19:29:40",
      endTimeString: "2013-01-31 19:29:40"
    }
  },
  computed: {
    timePassed: function() {
      var startTime = new Date(this.startTimeString)
      var endTime = new Date(this.endTimeString)
      var ts = (endTime.valueOf() - startTime.valueOf()) / 1000
      if (ts < 0) {
        return "-"+this.tsToString(-ts)
      } else {
        return this.tsToString(ts)
      }
    }
  },
  methods: {
    formatDate: function(date) {
      var str = ""
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
      var day = parseInt(ts / (60 * 60 * 24))
      var hour = parseInt((ts - day * (60 * 60 * 24)) / (60 * 60))
      var minute = parseInt((ts - day * (60 * 60 * 24) - hour * (60 * 60)) / 60)
      var second = parseInt(ts - day * (60 * 60 * 24) - hour * (60 * 60) - minute * 60)
      return day+"日"+this.addZero(hour)+"时"+this.addZero(minute)+"分"+this.addZero(second)+"秒"
    }
  },
  mounted: function() {
    var nowTime = new Date()
    this.endTimeString = this.formatDate(nowTime)
  }
}
</script>
