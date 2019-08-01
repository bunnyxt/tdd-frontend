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
      seriesList: [
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
      ],
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
      let seriesList = []
      let records = this.records

      let startTs = records[0].added
      // var endTs = records[records.length - 1].added

      // calc start week ts
      let startDate = new Date(startTs * 1000)
      let startDateDay = startDate.getDay()
      let startDateHours = startDate.getHours()
      let startDateMinutes = startDate.getMinutes()
      let startDateSeconds = startDate.getSeconds()
      let startWeekTs = startTs - (startDateHours * 60 * 60) - (startDateMinutes * 60) - (startDateSeconds)
      startDateDay = (startDateDay + 6) % 7
      startWeekTs -= (startDateDay *  24 * 60 * 60)

      let p1 = 0
      let p2 = 1

      while (p2 < records.length) {
        // add one week data
        let matrix = new Array()
        for (let i = 0; i < 7; i++) {
          matrix[i] = new Array(12)
          for (let j = 0; j < 12; j++) {
            matrix[i][j] = 0
          }
        }

        let endWeekTs = startWeekTs + (60 * 60 * 24 * 7)

        while (p2 < records.length) {
          let ts1 = records[p1].added
          let v1 = records[p1].view
          let d1 = new Date(ts1 * 1000)
          let w1 = (d1.getDay() + 6) % 7
          let h1 = Math.floor(d1.getHours() / 2)

          let ts2 = records[p2].added
          let v2 = records[p2].view
          let d2 = new Date(ts2 * 1000)
          let w2 = (d2.getDay() + 6) % 7
          let h2 = Math.floor(d2.getHours() / 2)

          if (ts2 >= endWeekTs) {
            // last record
            let v11 = (v2 - v1) / (ts2 - ts1) * (endWeekTs - ts1)
            matrix[w1][h1] += Math.floor(v11)
            break;
          }

          if ((w2 * 12 + h2) - (w1 * 12 + h1) == 0) {
            // in same block
            matrix[w2][h2] += (v2 - v1)
          } else if ((w2 * 12 + h2) - (w1 * 12 + h1) == 1){
            // cross block
            let d2_h = d2.getHours()
            let d2_m = d2.getMinutes()
            let d2_s = d2.getSeconds()
            let tss = ts2 - (d2_h % 2) * (60 * 60) - d2_m * 60 - d2_s // mid separation ts
            let v11 = (v2 - v1) / (ts2 - ts1) * (tss - ts1)
            let v22 = (v2 - v1) / (ts2 - ts1) * (ts2 - tss)
            matrix[w1][h1] += Math.floor(v11)
            matrix[w2][h2] += Math.floor(v22)
          } else if (ts1 < startWeekTs) {
            // first record
            let v22 = (v2 - v1) / (ts2 - ts1) * (ts2 - startWeekTs)
            matrix[w2][h2] += Math.floor(v22)
          }

          p1++
          p2++
        }

        let xNames = []
        let weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        for (let i = 0; i < 7; i++) {
          let date = new Date((startWeekTs + (60 * 60 * 24 * i)) * 1000)
          xNames.push((date.getMonth()+1) + "-" + date.getDate() + " " + weekLabels[i])
        }
        let series = [
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

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 12; j++) {
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
      let date = new Date(ts * 1000)
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
