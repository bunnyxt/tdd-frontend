<template>
  <div>
    <div id="video-detail-history-line-chart-toolbar" style="overflow: hidden">
      <a-popover title="图表设置" trigger="hover" placement="bottomLeft">
        <div slot="content">
          <p>坐标系类型：<a-switch checkedChildren="对数" unCheckedChildren="线性" @change="onValueTypeSwitchChange" /></p>
          <p>特殊数据标记：<a-switch default-checked @change="onGuideSwitchChange" /></p>
        </div>
        <a-icon type="setting" /> 图表设置
      </a-popover>
      <a-popover title="使用提示" trigger="hover" placement="bottomRight" style="float: right">
        <template slot="content">
          <ul style="padding: 0 0 0 12px">
            <li><span style="color: red">对数坐标系</span>的纵轴成对数比例增长，适用于数值规模差距较大的属性对比。</li>
            <li><span style="color: red">线性坐标系</span>的纵轴成线性比例增长，适用于观察单个属性走势情况。</li>
            <li>点击图表下方图例隐藏/显示某属性。</li>
            <li>调整图表底端滑块调整显示的时间段。</li>
          </ul>
        </template>
        <span style="cursor: help">使用提示 <a-icon type="question-circle"/></span>
      </a-popover>
    </div>
    <div id="video-detail-history-line-chart"></div>
    <div id="video-detail-history-line-chart-slider"></div>
  </div>
</template>

<script>
import G2 from '@antv/g2';
import DataSet from '@antv/data-set';

export default {
  name: 'VideoDetailHistoryLineChart',
  data: function() {
    return {
      chart: null,
      ds: null,
      dv: null,
      paddingDESKTOP: [ 20, 8, 95, 68 ],
      paddingMOBILE: [ 20, 8, 95, 8 ],
      heightDESKTOP: 400,
      heightMOBILE: 300,
      isInitialing: false
    }
  },
  props: {
    videoRecords: {
      type: Array,
      required: true
    }
  },
  computed: {
    _storeClientMode: function() {
      return this.$store.getters.clientMode;
    },
    padding: function() {
      return this.$store.getters.clientMode === 'MOBILE' ? this.paddingMOBILE : this.paddingDESKTOP;
    },
    height: function() {
      return this.$store.getters.clientMode === 'MOBILE' ? this.heightMOBILE : this.heightDESKTOP;
    }
  },
  watch: {
    videoRecords: function() {
      this.init();
    },
    _storeClientMode: function() {
      this.chart.destroy();
      document.getElementById('video-detail-history-line-chart-slider').innerHTML = ''; // destroy slider
      this.initChart();
      this.chart.render();
    }
  },
  methods: {
    init: function() {
      if (this.isInitialing === true) {
        return;
      } else {
        this.isInitialing = true;
      }
      this.initDs();
      this.initDv();
      this.initChart();
      this.chart.render();
      this.isInitialing = false;
    },
    initDs: function() {
      this.ds = new DataSet({
        state: {
          start: this.videoRecords.length > 0 ? this.videoRecords[0].added : 0,
          end: this.videoRecords.length > 0 ? this.videoRecords[this.videoRecords.length-1].added : 0,
          valueType: 'linear'
        }
      });
    },
    initDv: function() {
      let that = this;

      // add view_speed
      if (this.videoRecords.length > 0) {
        this.videoRecords[0].view_speed = 0;
        for (let i = 1; i < this.videoRecords.length; i++) {
          let view_diff = this.videoRecords[i].view - this.videoRecords[i - 1].view;
          let added_diff = this.videoRecords[i].added - this.videoRecords[i - 1].added;
          if (view_diff === 0) {
            this.videoRecords[i].view_speed = this.videoRecords[i - 1].view_speed;
          } else {
            this.videoRecords[i].view_speed = Math.round(view_diff / added_diff * 60 * 60);
          }
        }
      }

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
            like: '点赞',
            view_speed: '播放瞬时增速/小时'
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
    initChart: function() {
      this.createChart();
      this.setChartAxis();
      this.setChartSource('linear');

      this.setChartInteract();
      this.setChartStyle();
      this.setChartGuide();
    },
    createChart: function() {
      this.chart = new G2.Chart({
        container: 'video-detail-history-line-chart',
        forceFit: true,
        height : this.height,
        padding: this.padding
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
      this.chart.axis('value', {
        label: this.$store.getters.clientMode === 'MOBILE' ? null : {}
      });
      this.chart.axis('播放瞬时增速/小时', {
        grid: null
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
        padding: this.padding,
        onChange: ({ startValue, endValue }) => {
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
      this.chart
        .area()
        .position('added*播放瞬时增速/小时')
        .color('rgba(255,0,0,0.2)');
    },
    setChartGuide: function () {
      if (this.videoRecords.length === 0) {
        return;
      }

      // view point
      let minView = this.videoRecords[0].view;
      let maxView = this.videoRecords[this.videoRecords.length - 1].view;
      let viewPointTasks = [];
      let currentViewTask = 10000;
      let step = 90000;
      while (currentViewTask <= maxView) {
        // push current
        if (currentViewTask >= minView) {
          viewPointTasks.push(currentViewTask);
        }
        // go next
        currentViewTask += step;
        // change step
        if (currentViewTask >= 100000 && currentViewTask < 1000000) {
          step = 100000;
        } else if (currentViewTask < 10000000) {
          step = 1000000;
        } else if (currentViewTask < 100000000) {
          step = 10000000;
        }
      }

      // get view points
      let viewPoints = [];
      for (let viewPointTask of viewPointTasks) {
        let lo = 0;
        let hi = this.videoRecords.length;
        while (lo < hi) {
          let mid = Math.floor(lo + (hi - lo) / 2);
          if (this.videoRecords[mid].view < viewPointTask) {
            lo = mid + 1;
          } else {
            hi = mid;
          }
        }
        viewPoints.push({
          viewPoint: this.videoRecords[lo],
          viewPointTask: viewPointTask
        });
      }

      // remove duplicate
      let viewPointsTemp = [];
      for (let i = 1; i < viewPoints.length; i++) {
        if (viewPoints[i].viewPoint.view !== viewPoints[i - 1].viewPoint.view) {
          viewPointsTemp.push(viewPoints[i - 1]);
        }
      }
      if (viewPoints.length > 0) {
        viewPointsTemp.push(viewPoints[viewPoints.length - 1]);
      }
      viewPoints = viewPointsTemp;

      // add data maker
      for (let { viewPoint, viewPointTask } of viewPoints) {
        this.chart.guide().dataMarker({
          top: true,
          content: viewPointTask.toLocaleString() + '+',
          position: [ viewPoint.added * 1000, viewPoint.view ],
          style: {
            text: {
              fontSize: 13,
              stroke: 'white',
              lineWidth: 2
            }
          },
          lineLength: 30
        });
      }

      // // rapid growth
      // let avgViewSpeed = (this.videoRecords[this.videoRecords.length - 1].view - this.videoRecords[0].view)
      //   / (this.videoRecords[this.videoRecords.length - 1].added - this.videoRecords[0].added);
      //
      // let rapidGrowthPeriods = [];
      // for (let i = 1; i < this.videoRecords.length; i++) {
      //   let viewSpeed = (this.videoRecords[i].view - this.videoRecords[i - 1].view)
      //     / (this.videoRecords[i].added - this.videoRecords[i - 1].added);
      //   if (viewSpeed >= avgViewSpeed * 3) {
      //     rapidGrowthPeriods.push([this.videoRecords[i - 1].added, this.videoRecords[i].added]);
      //   }
      // }
      //
      // for (let rapidGrowthPeriod of rapidGrowthPeriods) {
      //   this.chart.guide().region({
      //     start: [rapidGrowthPeriod[0] * 1000, 'min'],
      //     end: [rapidGrowthPeriod[1] * 1000, 'max'],
      //     style: {
      //       fill: '#ff0000', // 辅助框填充的颜色
      //       fillOpacity: 0.15, // 辅助框的背景透明度
      //     }
      //   });
      // }
    },
    onValueTypeSwitchChange: function (checked) {
      if (checked) {
        this.setChartSource('log');
      } else {
        this.setChartSource('linear');
      }
      this.chart.render();
    },
    onGuideSwitchChange: function (checked) {
      if (checked) {
        this.setChartGuide();
      } else {
        this.chart.guide().clear()
      }
      this.chart.render();
    }
  },
  mounted: function() {
    if (typeof(this.videoRecords) === typeof([]) && this.videoRecords.length > 0) {
      this.init();
    }
  }
}
</script>

<style scoped>

</style>