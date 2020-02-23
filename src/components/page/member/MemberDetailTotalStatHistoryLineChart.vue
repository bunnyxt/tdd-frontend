<template>
  <div>
    <div id="member-detail-total-stat-history-line-chart-toolbar" style="overflow: hidden">
      <span>坐标系类型：</span>
      <a-switch checkedChildren="对数" unCheckedChildren="线性" @change="onValueTypeSwitchChange" />
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
    <div id="member-detail-total-stat-history-line-chart"></div>
    <div id="member-detail-total-stat-history-line-chart-slider"></div>
  </div>
</template>

<script>
  import G2 from '@antv/g2';
  import DataSet from '@antv/data-set';

  export default {
    name: 'MemberDetailTotalStatHistoryLineChart',
    props: {
      totalStatRecords: {
        type: Array,
        required: true
      }
    },
    data: function () {
      return {
        chart: null,
        ds: null,
        dv: null,
        paddingDESKTOP: [ 20, 8, 95, 70 ],
        paddingMOBILE: [ 20, 8, 95, 8 ],
        heightDESKTOP: 400,
        heightMOBILE: 300,
        isInitialing: false,
        tmpCount: 0
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
      totalStatRecords: function() {
        this.init();
      },
      _storeClientMode: function() {
        this.chart.destroy();
        document.getElementById('member-detail-total-stat-history-line-chart-slider').innerHTML = ''; // destroy slider
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
            start: this.totalStatRecords.length > 0 ? this.totalStatRecords[0].added : 0,
            end: this.totalStatRecords.length > 0 ? this.totalStatRecords[this.totalStatRecords.length-1].added : 0
          }
        });
      },
      initDv: function() {
        let that = this;

        // add view_speed
        if (this.totalStatRecords.length > 0) {
          this.totalStatRecords[0].view_speed = 0;
          for (let i = 1; i < this.totalStatRecords.length; i++) {
            let view_diff = this.totalStatRecords[i].view - this.totalStatRecords[i - 1].view;
            let added_diff = this.totalStatRecords[i].added - this.totalStatRecords[i - 1].added;
            if (view_diff === 0) {
              this.totalStatRecords[i].view_speed = this.totalStatRecords[i - 1].view_speed;
            } else {
              this.totalStatRecords[i].view_speed = Math.round(view_diff / added_diff * 24 * 60 * 60);
            }
          }
        }

        this.dv = this.ds.createView()
          .source(this.totalStatRecords)
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
              video_count: '投稿',
              view_speed: '播放瞬时增速/日'
            }
          })
          .transform({
            type: 'fold',
            fields: ['播放', '弹幕', '评论', '收藏', '硬币', '分享', '点赞', '投稿'],
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
      },
      createChart: function() {
        this.chart = new G2.Chart({
          container: 'member-detail-total-stat-history-line-chart',
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
        this.chart.axis('播放瞬时增速/日', {
          grid: null
        });
      },
      setChartInteract: function() {
        let that = this;
        let dv_slider = this.ds.createView()
          .source(this.totalStatRecords)
          .transform({
            type: 'map',
            callback(row) {
              row.added = row.added * 1000; // ts_s -> ts_ms
              return row;
            }
          });
        this.chart.interact('slider', {
          container: 'member-detail-total-stat-history-line-chart-slider',
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
          .position('added*播放瞬时增速/日')
          .color('rgba(255,0,0,0.2)');
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
      if (typeof(this.totalStatRecords) === typeof([]) && this.totalStatRecords.length > 0) {
        this.init();
      }
    }
  }
</script>