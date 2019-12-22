<template>
  <div>
    <div>
      <span>坐标系类型：<a-switch defaultChecked checkedChildren="对数" unCheckedChildren="线性" @change="onValueTypeSwitchChange" /></span>
    </div>
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
      this.initChart();
      this.initDs();
      this.initDv();

      this.setChartSource('log');
      this.setChartAxis();
      this.setChartInteract();

      this.setChartStyle();
      this.chart.render();
    },
    initChart: function() {
      this.chart = new G2.Chart({
        container: 'video-detail-history-line-chart',
        forceFit: true,
        height : 400
      });
    },
    initDs: function() {
      this.ds = new DataSet({
        state: {
          start: this.videoRecords.length > 0 ? this.videoRecords[0].added : 0,
          end: this.videoRecords.length > 0 ? this.videoRecords[this.videoRecords.length-1].added : 0,
          valueType: 'log'
        }
      });
    },
    initDv: function() {
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
          type: 'rename',
          map: {
            view: '播放',
            danmaku: '弹幕',
            reply: '评论',
            favorite: '收藏',
            coin: '硬币',
            share: '分享',
            like: '点赞'
          }
        })
        .transform({
          type: 'fold',
          fields: ['播放', '弹幕', '评论', '收藏', '硬币', '分享', '点赞'],
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
    },
    setChartSource: function(valueType) {
      this.chart.source(this.dv, {
        added: {
          type: 'time',
          mask: 'YYYY-MM-DD HH:mm:ss'
        },
        value: {
          type: valueType,
          base: 10, // only work when valueType === 'log'
          nice: false
        }
      });
    },
    setChartAxis: function() {
      this.chart.axis('added', {
        label: {
          formatter: function (text) {
            return text.slice(5, 10);
          }
        }
      });
    },
    setChartInteract: function() {
      let that = this;
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
    },
    setChartStyle: function() {
      this.chart
        .line()
        .position('added*value')
        .color('prop');
    },
    onValueTypeSwitchChange: function (checked) {
      if (checked) {
        this.setChartSource('log');
      } else {
        this.setChartSource('linear');
      }
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