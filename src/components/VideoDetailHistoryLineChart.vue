<template>
  <div>
    <div id="video-detail-history-line-chart"></div>
    <div id="video-detail-history-line-chart-slider"></div>
  </div>
</template>

<script>
import G2 from '@antv/g2';
import DataSet from '@antv/data-set';

export default {
  name: '',
  data: function() {
    return {
      chart: null,
      ds: null,
      dv: null
    }
  },
  props: {
    videoRecords: Array
  },
  methods: {
    init: function() {
      this.chart = new G2.Chart({
        container: 'video-detail-history-line-chart',
        forceFit: true,
        height : 400
      });

      this.ds = new DataSet({
        state: {
          start: this.videoRecords.length > 0 ? this.videoRecords[0].added : 0,
          end: this.videoRecords.length > 0 ? this.videoRecords[this.videoRecords.length-1].added : 0
        }
      });

      let that = this;
      this.dv = this.ds.createView()
        .source(this.videoRecords)
        .transform({
          type: 'filter',
          callback(row) {
            return row.added >= that.ds.state.start && row.added <= that.ds.state.end;
          }
        })
        .transform({
          type: 'fold',
          fields: ['view', 'danmaku', 'reply', 'favorite', 'coin', 'share', 'like'],
          key: 'prop',
          value: 'value'
        })
        .transform({
          type: 'map',
          callback(row) {
            row.added = row.added * 1000; // ts_s -> ts_ms
            return row;
          }
        });

      this.chart.source(this.dv, {
        added: {
          type: 'time',
          mask: 'YYYY-MM-DD HH:mm:ss'
        }
      });

      this.chart.axis('added', {
        label: {
          formatter: function (text) {
            return text.slice(5, 10);
          }
        }
      });

      let dv_slider = this.ds.createView()
        .source(this.videoRecords)
        .transform({
          type: 'map',
          callback(row) {
            row.added = row.added * 1000; // ts_s -> ts_ms
            return row;
          }
        });
      this.chart.interact('slider', {
        container: 'video-detail-history-line-chart-slider',
        data: dv_slider,
        xAxis: 'added',
        yAxis: 'view',
        onChange: ({ startValue, endValue}) => {
          that.ds.setState('start', Math.floor(startValue / 1000));
          that.ds.setState('end', Math.floor(endValue / 1000));
          setTimeout(() => {
            that.chart.render();
          }, 32);
        }
      });

      this.chart
        .line()
        .position('added*value')
        .color('prop');

      this.chart.render();
    }
  },
  mounted: function() {
    this.init();
  }
}
</script>

<style scoped>

</style>