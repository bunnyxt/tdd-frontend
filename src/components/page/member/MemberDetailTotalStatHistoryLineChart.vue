<template>
  <div>
    <div id="member-detail-total-stat-history-line-chart-toolbar" style="overflow: hidden">
      <a-popover title="图表设置" trigger="hover" placement="bottomLeft">
        <div slot="content">
          <p>坐标系类型：<a-switch checkedChildren="对数" unCheckedChildren="线性" @change="onValueTypeSwitchChange" /></p>
        </div>
        <a-icon type="setting" /> 图表设置
      </a-popover>
<!--      <a-popover title="使用提示" trigger="hover" placement="bottomRight" style="float: right">-->
<!--        <template slot="content">-->
<!--          <ul style="padding: 0 0 0 12px">-->
<!--            <li><span style="color: red">对数坐标系</span>的纵轴成对数比例增长，适用于数值规模差距较大的属性对比。</li>-->
<!--            <li><span style="color: red">线性坐标系</span>的纵轴成线性比例增长，适用于观察单个属性走势情况。</li>-->
<!--            <li>点击图表下方图例隐藏/显示某属性。</li>-->
<!--            <li>调整图表底端滑块调整显示的时间段。</li>-->
<!--          </ul>-->
<!--        </template>-->
<!--        <span style="cursor: help">使用提示 <a-icon type="question-circle"/></span>-->
<!--      </a-popover>-->
      <div v-if="$store.getters.clientMode === 'MOBILE'" style="float: right" @click="onAddedRangeMobileClick">
        <span style="cursor: pointer">时间范围 <a-icon type="calendar" /></span>
        <a-modal title="时间范围" v-model="addedRangeMobileVisibility">
          <template slot="footer">
            <a-button type="primary" @click="onAddedRangeMobileClick">确定</a-button>
          </template>
          <p>
            开始：
            <a-date-picker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="开始"
                v-model="addedRangeValueStart"
                @change="onAddedRangeValueStartChange"
            ></a-date-picker>
          </p>
          <p>
            结束：
            <a-date-picker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="结束"
                v-model="addedRangeValueEnd"
                @change="onAddedRangeValueEndChange"
            ></a-date-picker>
          </p>
          <p>
            <a-button size="small" @click="setAddedRangeMobile(1)" style="margin-right: 4px">1日</a-button>
            <a-button size="small" @click="setAddedRangeMobile(7)" style="margin-right: 4px">7日</a-button>
            <a-button size="small" @click="setAddedRangeMobile(30)" style="margin-right: 4px">30日</a-button>
            <a-button size="small" @click="setAddedRangeMobile(180)">180日</a-button>
          </p>
          <p>数据共计：{{ this.totalStatRecords.length }}条，当前展示：{{ this.data.length }}条。</p>
          <a-alert v-if="data.length > 200" message="当前显示数据较多，可能会出现图表卡顿，如欲提高响应速度，请酌情缩小时间范围。" banner />
        </a-modal>
      </div>
      <template v-else>
        <a-popover title="时间范围" trigger="click" placement="bottomRight" style="float: right">
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
            <p>数据共计：{{ this.totalStatRecords.length }}条，当前展示：{{ this.data.length }}条。</p>
            <a-alert v-if="data.length > 200" banner>
              <template slot="message">
                当前显示数据较多，可能会出现图表卡顿，<br>如欲提高响应速度，请酌情缩小时间范围。
              </template>
            </a-alert>
          </template>
          <span style="cursor: pointer">时间范围 <a-icon type="calendar" /></span>
        </a-popover>
      </template>
    </div>
    <div id="member-detail-total-stat-history-line-chart"></div>
    <div id="member-detail-total-stat-history-line-chart-slider"></div>
  </div>
</template>

<script>
import G2 from '@antv/g2';
import DataSet from '@antv/data-set';
import moment from 'moment';

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
      data: [],
      chart: null,
      ds: null,
      dv: null,
      paddingDESKTOP: [ 20, 8, 95, 74 ],
      paddingMOBILE: [ 20, 8, 95, 8 ],
      heightDESKTOP: 400,
      heightMOBILE: 300,
      isInitialing: false,
      addedRangeValue: [],
      addedRangeRanges: {
        '1日': [moment().subtract(1, 'days'), moment()],
        '7日': [moment().subtract(7, 'days'), moment()],
        '30日': [moment().subtract(30, 'days'), moment()],
        '180日': [moment().subtract(180, 'days'), moment()],
      },
      addedRangeDisabledDate: current => current > moment().endOf('day'),
      addedRangeMobileVisibility: false,
      addedRangeValueStart: null,
      addedRangeValueEnd: null
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
      this.initAddedRange();
      this.init();
    },
    addedRangeValue: function () {
      if (this.addedRangeValue.length === 2) {
        this.addedRangeValueStart = this.addedRangeValue[0];
        this.addedRangeValueEnd = this.addedRangeValue[1];
      } else {
        this.addedRangeValueStart = null;
        this.addedRangeValueEnd = null;
      }
    },
    _storeClientMode: function() {
      this.chart.destroy();
      document.getElementById('member-detail-total-stat-history-line-chart-slider').innerHTML = ''; // destroy slider
      this.initChart();
      this.chart.render();
    }
  },
  methods: {
    initAddedRange: function () {
      let length = this.totalStatRecords.length;
      let size = 200;
      let start = moment(this.totalStatRecords[length - size < 0 ? 0 : length - size].added * 1000);
      let end = moment(this.totalStatRecords[length - 1].added * 1000);
      this.addedRangeValue = [start, end];

      let minTs = this.totalStatRecords[0].added;
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
        this.data = [...this.totalStatRecords];
      } else {
        let startTs = Math.floor(this.addedRangeValue[0].valueOf() / 1000);
        let endTs = Math.floor(this.addedRangeValue[1].valueOf() / 1000);
        for (let i = 0; i < this.totalStatRecords.length; i++) {
          let record = this.totalStatRecords[i];
          if (record.added >= startTs && record.added <= endTs) {
            this.data.push(record);
          }
        }
      }

      // add view_speed
      if (this.data.length > 0) {
        this.data[0].view_speed = 0;
        for (let i = 1; i < this.data.length; i++) {
          let view_diff = this.data[i].view - this.data[i - 1].view;
          let added_diff = this.data[i].added - this.data[i - 1].added;
          if (view_diff === 0 && added_diff <= 75) { // assume update interval 75s
            this.data[i].view_speed = this.data[i - 1].view_speed;
          } else {
            this.data[i].view_speed = parseFloat((view_diff / added_diff * 24 * 60 * 60).toFixed(2));
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
        label: this.$store.getters.clientMode === 'MOBILE' ? null : {
          formatter: val => parseInt(val).toLocaleString()
        }
      });
      this.chart.axis('播放瞬时增速/日', {
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
    },
    onAddedRangeChange: function () {
      this.chart.destroy();
      document.getElementById('member-detail-total-stat-history-line-chart-slider').innerHTML = ''; // destroy slider
      this.init();
    },
    onAddedRangeMobileClick: function () {
      this.addedRangeMobileVisibility = !this.addedRangeMobileVisibility;
    },
    onAddedRangeValueStartChange: function () {
      if (this.addedRangeValueStart === null) {
        this.addedRangeValueEnd = null;
        this.addedRangeValue = [];
      } else {
        if (this.addedRangeValue.length !== 2) {
          this.addedRangeValueEnd = moment();
          this.addedRangeValue = [this.addedRangeValueStart, moment()];
        } else {
          this.addedRangeValue = [this.addedRangeValueStart, this.addedRangeValue[1]];
        }
      }
      this.onAddedRangeChange();
    },
    onAddedRangeValueEndChange: function () {
      if (this.addedRangeValueEnd === null) {
        this.addedRangeValueStart = null;
        this.addedRangeValue = [];
      } else {
        if (this.addedRangeValue.length !== 2) {
          this.addedRangeValueStart = moment(0);
          this.addedRangeValue = [moment(0), this.addedRangeValueEnd];
        } else {
          this.addedRangeValue = [this.addedRangeValue[0], this.addedRangeValueEnd];
        }
      }
      this.onAddedRangeChange();
    },
    setAddedRangeMobile: function (day) {
      this.addedRangeValueStart = moment().subtract(day, 'days');
      this.addedRangeValueEnd = moment();
      this.addedRangeValue = [this.addedRangeValueStart, this.addedRangeValueEnd];
      this.onAddedRangeChange();
    }
  },
  mounted: function() {
    if (typeof(this.totalStatRecords) === typeof([]) && this.totalStatRecords.length > 0) {
      this.initAddedRange();
      this.init();
    }
  }
}
</script>
