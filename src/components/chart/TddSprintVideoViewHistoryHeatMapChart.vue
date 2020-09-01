<template>
  <div>
    <a-week-picker placeholder="选择星期" v-model="weekPickerMoment" @change="onWeekPickerChange" />
    <div id="tdd-sprint-video-view-history-heat-map-chart" />
  </div>
</template>

<script>
import { Chart } from '@antv/g2';
import moment from "moment";

export default {
  name: 'TddSprintVideoViewHistoryHeatMapChart',
  props: {
    records: Array
  },
  data: function () {
    return {
      // chart
      chart: null,
      chartPaddingDESKTOP: [20, 20, 40, 20],
      chartPaddingMOBILE: [20, 20, 32, 20],
      chartHeightDESKTOP: 400,
      chartHeightMOBILE: 300,
      // week picker
      weekPickerMoment: moment().startOf('week'),
    }
  },
  computed: {
    compact: function() {
      return this.$store.getters.clientMode === 'MOBILE';
    },
    chartPadding: function() {
      return this.compact
        ? this.chartPaddingMOBILE
        : this.chartPaddingDESKTOP;
    },
    chartHeight: function() {
      return this.compact
        ? this.chartHeightMOBILE
        : this.chartHeightDESKTOP;
    },
    weekMatrices: function () {
      let matrices = {};
      for (let i = 1; i < this.records.length; i++) {
        // get start record r1 and end record r2
        const r1 = this.records[i - 1];
        const r2 = this.records[i];
        // delta_view and delta_ts
        const delta_view = r2.view - r1.view;
        const delta_ts = r2.added - r1.added;
        // separate ts into hour cells
        const hourCells = [];
        let ts_start = r1.added;
        let currentWeekStartTs = this.getWeekStartTs(ts_start);
        let currentHourStartTs = this.getHourStartTs(ts_start);
        let currentHourEndTs = currentHourStartTs + 60 * 60;
        let ts_end = r2.added > currentHourEndTs ? currentHourEndTs : r2.added;
        do {
          const date = (new Date(ts_start * 1000));
          let week = date.getDay() - 1;
          if (week === -1) {
            week = 6;
          }
          const hour = date.getHours();
          hourCells.push({
            index: currentWeekStartTs,
            week,
            hour,
            view: (ts_end - ts_start) / delta_ts * delta_view
          })
          ts_start = ts_end;
          currentWeekStartTs = this.getWeekStartTs(ts_start);
          currentHourStartTs = currentHourEndTs;
          currentHourEndTs = currentHourStartTs + 60 * 60;
          ts_end = r2.added > currentHourEndTs ? currentHourEndTs : r2.added;
        } while (ts_start >= currentHourStartTs);
        hourCells.forEach(({ index, week, hour, view }) => {
          if (!matrices.hasOwnProperty(index)) {
            matrices[index] = this.makeWeekMatrix();
          }
          matrices[index][week][hour] += view;
        })
      }
      return matrices;
    },
    weekPickerStartTs: function () {
      return Math.floor(this.weekPickerMoment.startOf('week').valueOf() / 1000);
    },
  },
  watch: {
    compact: function() {
      this.chart.destroy();
      this.draw();
    },
    records: function () {
      this.chart.destroy();
      this.draw();
    }
  },
  methods: {
    makeWeekMatrix: function () {
      const matrix = [];
      for (let i = 0; i < 7; i++) {
        matrix.push(new Array(24).fill(0));
      }
      return matrix;
    },
    getWeekStartTs: function (ts) {
      return Math.floor(moment.unix(ts).startOf('week').valueOf() / 1000)
    },
    getHourStartTs: function (ts) {
      return Math.floor(moment.unix(ts).startOf('hour').valueOf() / 1000)
    },
    draw: function () {
      this.chart = new Chart({
        container: 'tdd-sprint-video-view-history-heat-map-chart',
        autoFit: true,
        height : this.chartHeight,
        padding: this.chartPadding,
      });
      
      // find week matrix of this week
      let weekMatrix = this.weekMatrices[this.weekPickerStartTs];
      
      let data = [];
      const weekName = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      const dateName = {
        '周一': this.$util.tsToDateString(this.weekPickerStartTs + 0 * 24 * 60 * 60, 'yyyy-MM-dd'),
        '周二': this.$util.tsToDateString(this.weekPickerStartTs + 1 * 24 * 60 * 60, 'yyyy-MM-dd'),
        '周三': this.$util.tsToDateString(this.weekPickerStartTs + 2 * 24 * 60 * 60, 'yyyy-MM-dd'),
        '周四': this.$util.tsToDateString(this.weekPickerStartTs + 3 * 24 * 60 * 60, 'yyyy-MM-dd'),
        '周五': this.$util.tsToDateString(this.weekPickerStartTs + 4 * 24 * 60 * 60, 'yyyy-MM-dd'),
        '周六': this.$util.tsToDateString(this.weekPickerStartTs + 5 * 24 * 60 * 60, 'yyyy-MM-dd'),
        '周日': this.$util.tsToDateString(this.weekPickerStartTs + 6 * 24 * 60 * 60, 'yyyy-MM-dd'),
      };
      for (let week = 0; week < 7; week++) {
        for (let hour = 0; hour < 24; hour++) {
          let value = 0;
          if (weekMatrix) {
            value = Math.round(weekMatrix[week][hour] * 100) / 100;
          }
          data.push({
            week: weekName[week],
            hour: (hour < 10 ? '0': '') + String(hour) + ':00',
            value,
          });
        }
      }
      this.chart.data(data);
      
      this.chart.tooltip({
        showTitle: null,
        showMarkers: false,
        itemTpl: `<div style="margin-bottom: 12px">
<div style="margin-bottom: 12px">{date} {week}</div><div>{hour}<div style="float: right">{value}</div><div/>
</div>`,
      });
      this.chart.coordinate('polar', {
        innerRadius: 0.2
      });
      this.chart.legend({
        slidable: false
      });
      this.chart.axis('week', {
        grid: null,
        line: null,
        tickLine: null,
        label: null
      });
      this.chart.axis('hour', {
        line: null,
        tickLine: null,
        grid: null,
        label: {
          offset: 3
        }
      });
      this.chart.polygon()
        .position('hour*week')
        .color('value', '#BAE7FF-#1890FF-#0050B3')
        .tooltip('week*hour*value', (week, hour, value) => {
          return {
            date: dateName[week],
            week: week,
            hour: hour,
            value: value.toFixed(2),
          };
        })
        .style({
          stroke: '#fff',
          lineWidth: 1
        });
      weekName.map((val, idx) => {
        this.chart.annotation().text({
          top: true,
          position: [0, idx],
          content: val,
          style: {
            fill: '#fff',
            textAlign: 'center',
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, .45)'
          }
        });
      })
      this.chart.render();
    },
    onWeekPickerChange: function () {
      this.chart.destroy();
      this.draw();
    },
  },
  mounted() {
    this.draw();
  }
}
</script>

<style scoped>

</style>
