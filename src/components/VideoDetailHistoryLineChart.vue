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
          start: '',
          end: ''
        }
      });

      this.dv = this.ds.createView()
        .source(this.videoRecords)
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

      // TODO slider
      // chart.interact('slider', {
      //   container: 'video-detail-history-line-chart-slider',
      //   data: this.videoRecords,
      //   xAxis: 'added',
      //   yAxis: 'view',
      // });

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