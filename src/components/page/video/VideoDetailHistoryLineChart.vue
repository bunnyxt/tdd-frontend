<template>
  <div>
    <div id="video-detail-history-line-chart-toolbar" style="overflow: hidden">
      <a-popover title="图表设置" trigger="click" placement="bottomLeft">
        <div slot="content">
          <p>坐标系类型：<a-switch checkedChildren="对数" unCheckedChildren="线性" @change="onValueTypeSwitchChange" /></p>
          <p>特殊数据标记：<a-switch default-checked @change="onGuideSwitchChange" /></p>
        </div>
        <span style="cursor: pointer"><a-icon type="setting" /> 图表设置</span>
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
          <p>数据共计：{{ this.videoRecords.length }}条，当前展示：{{ this.data.length }}条。</p>
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
            <p>数据共计：{{ this.videoRecords.length }}条，当前展示：{{ this.data.length }}条。</p>
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
    <div id="video-detail-history-line-chart"></div>
    <div id="video-detail-history-line-chart-slider"></div>
  </div>
</template>

<script>
import G2 from '@antv/g2';
import DataSet from '@antv/data-set';
import moment from 'moment';

export default {
  name: 'VideoDetailHistoryLineChart',
  data: function() {
    return {
      data: [],
      chart: null,
      ds: null,
      dv: null,
      paddingDESKTOP: [ 20, 8, 95, 68 ],
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
      document.getElementById('video-detail-history-line-chart-slider').innerHTML = ''; // destroy slider
      this.initChart();
      this.chart.render();
    }
  },
  methods: {
    initAddedRange: function () {
      let length = this.videoRecords.length;
      let size = 200;
      let start = moment(this.videoRecords[length - size < 0 ? 0 : length - size].added * 1000);
      let end = moment(this.videoRecords[length - 1].added * 1000);
      this.addedRangeValue = [start, end];

      let minTs = this.videoRecords[0].added;
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
        this.data = [...this.videoRecords];
      } else {
        let startTs = Math.floor(this.addedRangeValue[0].valueOf() / 1000);
        let endTs = Math.floor(this.addedRangeValue[1].valueOf() / 1000);
        for (let i = 0; i < this.videoRecords.length; i++) {
          let record = this.videoRecords[i];
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
          if (view_diff === 0) {
            this.data[i].view_speed = this.data[i - 1].view_speed;
          } else {
            this.data[i].view_speed = parseFloat((view_diff / added_diff * 60 * 60).toFixed(2));
          }
        }
      }
    },
    initDs: function () {
      this.ds = new DataSet({
        state: {
          start: this.data.length > 0 ? this.data[0].added : 0,
          end: this.data.length > 0 ? this.data[this.data.length-1].added : 0,
          valueType: 'linear'
        }
      });
    },
    initDv: function () {
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
          // TODO change formatter
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
      this.chart.axis('播放瞬时增速/小时', {
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
      if (this.data.length === 0) {
        return;
      }

      // view point
      let minView = this.data[0].view;
      let maxView = this.data[this.data.length - 1].view;
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
        let hi = this.data.length;
        while (lo < hi) {
          let mid = Math.floor(lo + (hi - lo) / 2);
          if (this.data[mid].view < viewPointTask) {
            lo = mid + 1;
          } else {
            hi = mid;
          }
        }
        viewPoints.push({
          viewPoint: this.data[lo],
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
    },
    onAddedRangeChange: function () {
      this.chart.destroy();
      document.getElementById('video-detail-history-line-chart-slider').innerHTML = ''; // destroy slider
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
    if (typeof(this.videoRecords) === typeof([]) && this.videoRecords.length > 0) {
      this.initAddedRange();
      this.init();
    }
  }
}
</script>

<style scoped>

</style>