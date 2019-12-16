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
      chart: null
    }
  },
  props: {
    videoRecords: Array
  },
  methods: {
    draw: function() {
      const chart = new G2.Chart({
        container: 'video-detail-history-line-chart',
        forceFit: true,
        height : 400
      });

      const ds = new DataSet({
        state: {
          start: '',
          end: ''
        }
      });
      const dv = ds.createView();
      dv.source(this.videoRecords)
        .transform({
          type: 'fold',
          fields: [ 'view', 'danmaku', 'reply', 'favorite', 'coin', 'share', 'like' ],
          key: 'key',
          value: 'value'
        })
        .transform({
          type: 'map',
          callback(row) {
            row.added = row.added * 1000;
            return row;
          }
        });

      chart.source(dv, {
        added: {
          type: 'time',
          mask: 'YYYY-MM-DD HH:mm:ss'
        },
      });

      chart.axis('added', {
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

      chart
        .line()
        .position('added*value')
        .color('key');

      this.chart = chart;
      this.chart.render();
    }
  },
  mounted: function() {
    this.draw();
  }
}
</script>

<style scoped>

</style>