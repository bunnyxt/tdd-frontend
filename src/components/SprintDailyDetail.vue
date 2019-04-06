<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/sprint">传说助攻</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/sprint/daily">助攻日报</a></a-breadcrumb-item>
      <a-breadcrumb-item><a :href="'/sprint/daily'+this.$route.params.date">{{ this.$route.params.date }}</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div v-if="daily.id != '-1'">
      <div class="section-block" :style="sectionBlockStyle">
        <h1>助攻日报#{{ this.$route.params.date }}</h1>
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
import SprintDailyDetailTable from "./SprintDailyDetailTable.vue"

export default {
  name: "SprintDailyDetail",
  components: {
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
        newvids: [],
        millvids: [],
        viewincr: 0,
        viewincrincr: 0,
        comment: ""
      },
      sprintDailyRecordList: []
    };
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
