<template>
  <apexchart type="area" height="350" :options="chartOptions" :series="series"/>
</template>

<script>
export default {
  name: "SprintDailyChart",
  props: {
    sprintDailyList: Array
  },
  data: function() {
    return {
      series: [
        {
          name: "播放增长",
          data: null
        }
      ],
      chartOptions: {
        chart: {
          toolbar: {
            tools: {
              download: false,
            },
          },
          zoom: {
            type: "xy"
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: "hollow"
        },
        xaxis: {
          type: "datetime",
          //min: this.latest_time - 7 * 24 * 60 * 60 * 1000,
          tickAmount: 6,
          labels: {
            rotate: 0
          }
        },
        yaxis: {
          labels: {
            show: true
          }
        },
        tooltip: {
          x: {
            format: "yyyy-MM-dd"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        }
      }
    }
  },
  watch: {
    sprintDailyList: function(newSprintDailyList) {
      var arr = new Array()
      for (var i = 0; i < newSprintDailyList.length; i++) {
        if (newSprintDailyList[i].correct == 1) {
          arr.push([this.dailyDateToTs(newSprintDailyList[i].date+''), newSprintDailyList[i].viewincr])
        }
      }
      this.series = [{
        name: "播放增长",
        data: arr
      }]
    }
  },
  methods: {
    dailyDateToTs: function(dailyDate) {
      var date = new Date(dailyDate.substring(0, 4)+'/'+dailyDate.substring(4, 6)+'/'+dailyDate.substring(6, 8))
      return date.valueOf()
    }
  }
}
</script>
