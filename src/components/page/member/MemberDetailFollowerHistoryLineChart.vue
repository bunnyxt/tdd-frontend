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
      <a-popover title="数据范围" trigger="click" placement="bottomRight" style="float: right">
        <template slot="content">
          <p>
            <a-range-picker
                showTime
                v-model="addedRangeValue"
                :ranges="addedRangeRanges"
                :disabledDate="addedRangeDisabledDate"
                @change="onAddedRangeChange"
                style="width: 360px"
            />
          </p>
          数据共计：{{ this.followerRecords.length }}条，当前展示：{{ this.data.length }}条。
        </template>
        <span style="cursor: pointer">数据范围 <a-icon type="calendar" /></span>
      </a-popover>
    </div>
    <div id="member-detail-follower-history-line-chart"></div>
    <div id="member-detail-follower-history-line-chart-slider"></div>
  </div>
</template>

<script>
  import G2 from '@antv/g2';
  import DataSet from '@antv/data-set';
  import moment from 'moment';

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
        data: [],
        chart: null,
        ds: null,
        dv: null,
        paddingDESKTOP: [ 20, 8, 75, 68 ],
        paddingMOBILE: [ 20, 8, 75, 8 ],
        heightDESKTOP: 400,
        heightMOBILE: 300,
        isInitialing: false,
        addedRangeValue: [],
        addedRangeRanges: {
          '1日': [moment().startOf('day'), moment()],
          '7日': [moment().subtract(7, 'days').startOf('day'), moment()],
          '30日': [moment().subtract(30, 'days').startOf('day'), moment()],
          '180日': [moment().subtract(180, 'days').startOf('day'), moment()],
        },
        addedRangeDisabledDate: current => current > moment().endOf('day')
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
        this.initAddedRange();
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
      initAddedRange: function () {
        let length = this.followerRecords.length;
        let size = 200;
        this.addedRangeValue[0] = moment(this.followerRecords[length - size < 0 ? 0 : length - size].added * 1000);
        this.addedRangeValue[1] = moment(this.followerRecords[length - 1].added * 1000);

        let minTs = this.followerRecords[0].added;
        this.addedRangeDisabledDate = function (current) {
          return current < moment(minTs * 1000) || current > moment().endOf('day')
        }
      },
      init: function() {
        if (this.isInitialing === true) {
          return;
        } else {
          this.isInitialing = true;
        }
        this.initData();
        this.initDs();
        this.initDv();
        this.initChart();
        this.chart.render();
        this.isInitialing = false;
      },
      initData: function () {
        this.data = [];

        // cut via range
        if (this.addedRangeValue.length !== 2) {
          // show all
          this.data = [...this.followerRecords];
        } else {
          let startTs = Math.floor(this.addedRangeValue[0].valueOf() / 1000);
          let endTs = Math.floor(this.addedRangeValue[1].valueOf() / 1000);
          for (let i = 0; i < this.followerRecords.length; i++) {
            let record = this.followerRecords[i];
            if (record.added >= startTs && record.added <= endTs) {
              this.data.push(record);
            }
          }
        }

        // add follower_speed
        if (this.data.length > 0) {
          this.data[0].follower_speed = 0;
          for (let i = 1; i < this.data.length; i++) {
            let follower_diff = this.data[i].follower - this.data[i - 1].follower;
            let added_diff = this.data[i].added - this.data[i - 1].added;
            if (follower_diff === 0) {
              this.data[i].follower_speed = this.data[i - 1].view_speed;
            } else {
              this.data[i].follower_speed = parseFloat((follower_diff / added_diff * 60 * 60).toFixed(2));
            }
          }
        }
      },
      initDs: function() {
        this.ds = new DataSet({
          state: {
            start: this.data.length > 0 ? this.data[0].added : 0,
            end: this.data.length > 0 ? this.data[this.data.length-1].added : 0
          }
        });
      },
      initDv: function() {
        let that = this;

        this.dv = this.ds.createView()
          .source(this.data)
          .transform({
            type: 'filter',
            callback(row) {
              return row.added >= that.ds.state.start && row.added <= that.ds.state.end;
            }
          })
          .transform({
            type: 'rename',
            map: {
              follower: '粉丝数',
              follower_speed: '粉丝瞬时增速/日'
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
          label: this.$store.getters.clientMode === 'MOBILE' ? null : {
            formatter: val => parseInt(val).toLocaleString()
          }
        });
        this.chart.axis('粉丝瞬时增速/日', {
          grid: null
        });
      },
      setChartInteract: function() {
        let that = this;
        let dv_slider = this.ds.createView()
          .source(this.data)
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
        this.chart
          .area()
          .position('added*粉丝瞬时增速/日')
          .color('rgba(255,0,0,0.2)');
      },
      onAddedRangeChange: function () {
        this.chart.destroy();
        document.getElementById('member-detail-follower-history-line-chart-slider').innerHTML = ''; // destroy slider
        this.init();
      }
    },
    mounted: function() {
      if (typeof(this.followerRecords) === typeof([]) && this.followerRecords.length > 0) {
        this.initAddedRange();
        this.init();
      }
    }
  }
</script>