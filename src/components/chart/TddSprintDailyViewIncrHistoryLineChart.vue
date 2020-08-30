<template>
  <div>
    <div id="tdd-sprint-daily-view-incr-history-line-chart" />
  </div>
</template>

<script>
import { Chart } from '@antv/g2';

export default {
  name: 'TddSprintDailyViewIncrHistoryLineChart',
  props: {
    sprintDailyList: Array
  },
  data: function () {
    return {
      chart: null,
      chartPaddingDESKTOP: [ 20, 8, 65, 68 ],
      chartPaddingMOBILE: [ 20, 8, 50, 8 ],
      chartHeightDESKTOP: 400,
      chartHeightMOBILE: 300,
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
    }
  },
  watch: {
    sprintDailyList: function () {
      this.chart.destroy();
      this.draw();
    }
  },
  methods: {
    draw: function () {
      this.chart = new Chart({
        container: 'tdd-sprint-daily-view-incr-history-line-chart',
        autoFit: true,
        height : this.chartHeight,
        padding: this.chartPadding,
      });
      
      const dataToShow = this.sprintDailyList.map(x => {
        const dateString = String(x.date);
        return {
          added: this.$util.dateStringToTs(
            `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)} 06:00:00`) * 1000,
          播放增长: x.viewincr
        }
      })
      this.chart.data(dataToShow);

      this.chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });
      
      this.chart.scale('added', {
        formatter: (val) => this.$util.tsToDateString(val / 1000).substring(0, 10),
      });
      
      this.chart.line()
        .position('added*播放增长')
        .shape('smooth');
      
      this.chart.option('slider', {
        height: 24,
        formatter: added => this.$util.tsToDateString(Math.floor(added / 1000))
      });
      
      this.chart.render();
    }
  },
  mounted() {
    this.draw();
  }
}
</script>

<style scoped>

</style>
