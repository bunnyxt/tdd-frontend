<template>
  <div id="chart">
    <h3>播放数分时增长量 {{ formatDate(seriesList[weekIndex - 1].startTs) }} ~ {{ formatDate(seriesList[weekIndex - 1].startTs + (60 * 60 * 24 * 7) - 1) }}</h3>
    <a-pagination v-model="weekIndex" :total="seriesList.length * 10" style="margin-bottom:4px"/>
    <apexchart type="heatmap" height="350" :options="chartOptions" :series="seriesList[weekIndex - 1].series"/>
  </div>
</template>

<script>
export default {
  name: "SprintVideoHeatMapChart",
  props: {
      records: Array
  },
  data: function() {
    return {
      weekIndex: 1, // from 1 to length
      seriesList: [],
      chartOptions: {
        chart: {
          toolbar: {
            tools: {
              download: false,
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        colors: ["#008FFB"]
      }
    }
  },
  methods: {
    getSeriesList: function() {
      var seriesList = []
      var records = this.records

      var startTs = records[0].added
      var endTs = records[records.length - 1].added

      var startWeekTs = startTs - startTs % (60 * 60 * 24 * 7)
      startWeekTs -= (60 * 60 * 8) // UTC+8
      startWeekTs -= (60 * 60 * 24 * 3) // modify week to Monday

      var p1 = 0
      var p2 = 1

      while (p2 < records.length) {
        // add one week data
        var matrix = new Array()
        for (var i = 0; i < 7; i++) {
          matrix[i] = new Array(12)
          for (var j = 0; j < 12; j++) {
            matrix[i][j] = 0
          }
        }

        var endWeekTs = startWeekTs + (60 * 60 * 24 * 7)

        while (p2 < records.length) {
          var ts1 = records[p1].added
          var v1 = records[p1].view
          var w1 = (new Date(ts1 * 1000).getDay() + 6) % 7
          var h1 = parseInt(new Date(ts1 * 1000).getHours() / 2)

          var ts2 = records[p2].added
          var v2 = records[p2].view
          var w2 = (new Date(ts2 * 1000).getDay() + 6) % 7
          var h2 = parseInt(new Date(ts2 * 1000).getHours() / 2)

          if (ts2 >= endWeekTs) {
            // last record
            var v11 = (v2 - v1) / (ts2 - ts1) * (endWeekTs - ts1)
            matrix[w1][h1] += parseInt(v11)
            break;
          }

          if ((w2 * 12 + h2) - (w1 * 12 + h1) == 0) {
            // in same block
            matrix[w2][h2] += (v2 - v1)
          } else if ((w2 * 12 + h2) - (w1 * 12 + h1) == 1){
            // cross block
            var tss = ts2 - (ts2 % 7200)
            var v11 = (v2 - v1) / (ts2 - ts1) * (tss - ts1)
            var v22 = (v2 - v1) / (ts2 - ts1) * (ts2 - tss)
            matrix[w1][h1] += parseInt(v11)
            matrix[w2][h2] += parseInt(v22)
          } else if (ts1 < startWeekTs) {
            // first record
            var v22 = (v2 - v1) / (ts2 - ts1) * (ts2 - startWeekTs)
            matrix[w2][h2] += parseInt(v22)
          }

          p1++
          p2++
        }

        var xNames = []
        var weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        for (var i = 0; i < 7; i++) {
          var date = new Date((startWeekTs + (60 * 60 * 24 * i)) * 1000)
          xNames.push((date.getMonth()+1) + "-" + date.getDate() + " " + weekLabels[i])
        }
        var series = [
          {
            name: "22:00 - 24:00",
            data: []
          },
          {
            name: "20:00 - 22:00",
            data: []
          },
          {
            name: "18:00 - 20:00",
            data: []
          },
          {
            name: "16:00 - 18:00",
            data: []
          },
          {
            name: "14:00 - 16:00",
            data: []
          },
          {
            name: "12:00 - 14:00",
            data: []
          },
          {
            name: "10:00 - 12:00",
            data: []
          },
          {
            name: "08:00 - 10:00",
            data: []
          },
          {
            name: "06:00 - 08:00",
            data: []
          },
          {
            name: "04:00 - 06:00",
            data: []
          },
          {
            name: "02:00 - 04:00",
            data: []
          },
          {
            name: "00:00 - 02:00",
            data: []
          },
        ]

        for (var i = 0; i < 7; i++) {
          for (var j = 0; j < 12; j++) {
            series[11 - j].data.push({
              x: xNames[i],
              y: matrix[i][j]
            })
          }
        }

        seriesList.push({
          startTs: startWeekTs,
          series: series
        })

        startWeekTs += (60 * 60 * 24 * 7) // go to next week
      }

      return seriesList    
    },
   formatDate: function(ts) {
      var date = new Date(ts * 1000)
      return (
        date.getFullYear() + "-" + 
        (date.getMonth()+1) + "-" + 
        date.getDate()
      )
    }
  },
  watch: {
    records: function () {
      this.seriesList = this.getSeriesList()
      this.weekIndex = this.seriesList.length
    }
  },
}
</script>
