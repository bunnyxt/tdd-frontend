<template>
  <div>
    <div id="member-detail-follower-history-line-chart-toolbar" style="overflow: hidden">
<!--      <a-popover title="使用提示" trigger="hover" placement="bottomRight" style="float: right">-->
<!--        <template slot="content">-->
<!--          <ul style="padding: 0 0 0 12px">-->
<!--            <li>调整图表底端滑块调整显示的时间段。</li>-->
<!--          </ul>-->
<!--        </template>-->
<!--        <span style="cursor: help">使用提示 <a-icon type="question-circle"/></span>-->
<!--      </a-popover>-->
    </div>
    <div id="member-detail-follower-history-line-chart"></div>
    <div id="member-detail-follower-history-line-chart-slider"></div>
  </div>
</template>

<script>
  import G2 from '@antv/g2';
  import DataSet from '@antv/data-set';

  export default {
    name: 'MemberDetailFollowerHistoryLineChart',
    props: {
      followerRecords: {
        type: Array,
        required: true
      }
    },
    data: function () {
      return {
        chart: null,
        ds: null,
        dv: null,
        paddingDESKTOP: [ 20, 8, 75, 60 ],
        paddingMOBILE: [ 20, 8, 75, 8 ],
        heightDESKTOP: 400,
        heightMOBILE: 300,
        isInitialing: false
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
      followerRecords: function() {
        this.init();
      },
      _storeClientMode: function() {
        this.chart.destroy();
        document.getElementById('member-detail-follower-history-line-chart-slider').innerHTML = ''; // destroy slider
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
            start: this.followerRecords.length > 0 ? this.followerRecords[0].added : 0,
            end: this.followerRecords.length > 0 ? this.followerRecords[this.followerRecords.length-1].added : 0
          }
        });
      },
      initDv: function() {
        let that = this;
        this.dv = this.ds.createView()
          .source(this.followerRecords)
          .transform({
            type: 'filter',
            callback(row) {
              return row.added >= that.ds.state.start && row.added <= that.ds.state.end;
            }
          })
          .transform({
            type: 'rename',
            map: {
              follower: '粉丝数'
            }
          })
          .transform({
            type: 'fold',
            fields: ['粉丝数'],
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
        this.setChartSource();

        this.setChartInteract();
        this.setChartStyle();
      },
      createChart: function() {
        this.chart = new G2.Chart({
          container: 'member-detail-follower-history-line-chart',
          forceFit: true,
          height : this.height,
          padding: this.padding
        });
      },
      setChartSource: function() {
        this.chart.source(this.dv, {
          added: {
            type: 'time',
            mask: 'YYYY-MM-DD HH:mm:ss'
          },
          value: {
            type: 'linear',
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
      },
      setChartInteract: function() {
        let that = this;
        let dv_slider = this.ds.createView()
          .source(this.followerRecords)
          .transform({
            type: 'map',
            callback(row) {
              row.added = row.added * 1000; // ts_s -> ts_ms
              return row;
            }
          });
        this.chart.interact('slider', {
          container: 'member-detail-follower-history-line-chart-slider',
          data: dv_slider,
          xAxis: 'added',
          yAxis: 'follower',
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
      }
    },
    mounted: function() {
      if (typeof(this.followerRecords) === typeof([]) && this.followerRecords.length > 0) {
        this.init();
      }
    }
  }
</script>