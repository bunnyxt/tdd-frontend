<template>
  <div id="chart">
    <apexchart type="heatmap" height="350" :options="chartOptions" :series="series"/>
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
      series: [],
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
    getSeries: function() {
      var records = this.records
      var matrix = new Array()
      for (var i = 0; i < 7; i++) {
        matrix[i] = new Array(12)
        for (var j = 0; j < 12; j++) {
          matrix[i][j] = 0
        }
      }

      var nowTs = records[records.length - 1].added
      var nowW = (new Date(nowTs * 1000).getDay() + 6) % 7
      var nowH = new Date(nowTs * 1000).getHours() / 2
      var limTs = nowTs - (nowTs % (60 * 60 * 2))  - (60 * 60 * 24 * 7) + (60 * 60 * 2)

      var p2 = records.length - 1
      var p1 = p2 - 1
      while (p1 >= 0) {
        var ts2 = records[p2].added
        var v2 = records[p2].view
        var w2 = (new Date(ts2 * 1000).getDay() + 6) % 7
        var h2 = new Date(ts2 * 1000).getHours() / 2

        var ts1 = records[p1].added
        var v1 = records[p1].view
        var w1 = (new Date(ts1 * 1000).getDay() + 6) % 7
        var h1 = new Date(ts1 * 1000).getHours() / 2

        if (ts1 < limTs) {
          break;
        }

        if ((w2 * 12 + h2) - (w1 * 12 + h1) == 0) {
          matrix[w2][h2] += (v2 - v1)
        } else if (((w2 * 12 + h2) - (w1 * 12 + h1) == 1) || ((w2 * 12 + h2) - (w1 * 12 + h1) == -83)){
          var tss = ts2 - (ts2 % 7200)
          var v11 = (v2 - v1) / (ts2 - ts1) * (tss - ts1)
          var v22 = (v2 - v1) / (ts2 - ts1) * (ts2 - tss)
          matrix[w1][h1] += parseInt(v11)
          matrix[w2][h2] += parseInt(v22)
        }

        p2--
        p1--
      }

      var xNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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

      return series
    }
  },
  watch: {
    records: function (newRecords, oldRecords) {
      this.series = this.getSeries()
    }
  },
}
</script>
