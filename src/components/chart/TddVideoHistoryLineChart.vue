<template>
  <div>
    <div id="tdd-video-history-line-chart-toolbar" style="overflow: hidden">
      <a-popover title="图表设置" trigger="click" placement="bottomLeft">
        <div slot="content">
          <p>坐标系类型：<a-switch checkedChildren="对数" unCheckedChildren="线性" @change="toggleAxisType" /></p>
          <p>特殊数据标记：<a-switch default-checked @change="toggleShowSpecialPoint" /></p>
          <p>数据原点显示：<a-switch @change="toggleShowBasePoint" /></p>
        </div>
        <span style="cursor: pointer"><a-icon type="setting" /> 图表设置</span>
      </a-popover>
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
          <p>数据共计：{{ this.videoRecords.length }}条，当前展示：{{ this.filteredData.length }}条。</p>
          <a-alert v-if="this.filteredData.length > 200" message="当前显示数据较多，可能会出现图表卡顿，如欲提高响应速度，请酌情缩小时间范围。" banner />
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
                style="width: 380px"
              />
            </p>
            <p>数据共计：{{ this.videoRecords.length }}条，当前展示：{{ this.filteredData.length }}条。</p>
            <a-alert v-if="this.filteredData.length > 200" banner>
              <template slot="message">
                当前显示数据较多，可能会出现图表卡顿，<br>如欲提高响应速度，请酌情缩小时间范围。
              </template>
            </a-alert>
          </template>
          <span style="cursor: pointer">时间范围 <a-icon type="calendar" /></span>
        </a-popover>
      </template>
    </div>
    <div id="tdd-video-history-line-chart"></div>
  </div>
</template>

<script>
import { Chart } from '@antv/g2';
import { DataView } from '@antv/data-set';
import moment from "moment";

export default {
  name: 'TddVideoHistoryLineChart',
  props: {
    videoRecords: {
      type: Array,
      required: true,
    },
    pubdate: {
      type: Number,
      default: 0,
    }
  },
  data: function () {
    return {
      // chart
      chart: null,
      chartPaddingDESKTOP: [ 20, 8, 95, 68 ],
      chartPaddingMOBILE: [ 20, 8, 50, 8 ],
      chartHeightDESKTOP: 400,
      chartHeightMOBILE: 300,
      // left panel, chart config setting
      showBasePoint: false,
      showSpecialPoint: true,
      // right panel, added range setting
      addedRangeValue: [
        moment().subtract(7, 'days'),
        moment()
      ],
      addedRangeRanges: {
        '1日': [moment().subtract(1, 'days'), moment()],
        '7日': [moment().subtract(7, 'days'), moment()],
        '30日': [moment().subtract(30, 'days'), moment()],
        '180日': [moment().subtract(180, 'days'), moment()],
      },
      addedRangeDisabledDate: current => current > moment().endOf('day'),
      addedRangeMobileVisibility: false,
      addedRangeValueStart: null,
      addedRangeValueEnd: null,
    }
  },
  computed: {
    startTs: function () {
      if (this.addedRangeValue[0]) {
        return Math.floor(this.addedRangeValue[0].valueOf() / 1000);
      } else {
        // return ((new Date()).valueOf() / 1000 - 7 * 24 * 60 * 60).toFixed(0);
        return 0;
      }
    },
    endTs: function (){
      if (this.addedRangeValue[1]) {
        return Math.floor(this.addedRangeValue[1].valueOf() / 1000);
      } else {
        return ((new Date()).valueOf() / 1000).toFixed(0);
      }
    },
    filteredData: function () {
      let filteredRecords = [];
      
      // add base point
      if (this.showBasePoint) {
        filteredRecords.push({
          id: 0,
          added: this.pubdate,
          view: 0,
          danmaku: 0,
          reply: 0,
          favorite: 0,
          coin: 0,
          share: 0,
          like: 0
        });
      }
      
      // cut via range
      filteredRecords = [
        ...filteredRecords,
        ...this.videoRecords.filter(v => v.added >= this.startTs && v.added <= this.endTs)
      ]
      
      return filteredRecords;
    },
    transformedData: function () {
      // annotation
      // TODO can I move it to another proper place?
      this.chart.annotation().clear(true);
      this.setAnnotation();
      
      const filteredData = [...this.filteredData];
      // add view speed
      if (filteredData.length > 0) {
        filteredData[0].view_speed = 0; // set first speed to 0
        for (let i = 1; i < filteredData.length; i++) {
          const view_diff = filteredData[i].view - filteredData[i-1].view;
          const added_diff = filteredData[i].added - filteredData[i-1].added;
          if (view_diff === 0 && added_diff <= 75) {
            // two record with same value in 75s
            filteredData[i].view_speed = filteredData[i-1].view_speed;
          } else {
            // speed per hour
            filteredData[i].view_speed = parseFloat((view_diff / added_diff * 60 * 60).toFixed(2));
          }
        }
      }
      
      return new DataView().source(filteredData)
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
            view_speed: '播放瞬时增速/小时',
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
        }).rows;
    },
    compact: function() {
      return this.$store.getters.clientMode === 'MOBILE';
    },
    chartPadding: function() {
      return this.compact
        ? this.chartPaddingMOBILE
        : this.chartPaddingDESKTOP;
    },
    chartHeight: function() {
      return this.compact
        ? this.chartHeightMOBILE
        : this.chartHeightDESKTOP;
    }
  },
  watch: {
    compact: function() {
      this.chart.destroy();
      this.draw();
    },
    videoRecords: function () {
      // TODO change addedRangeValue
      this.chart.changeData(this.transformedData);
      // TODO test whether need render
      // this.chart.render();
    }
  },
  methods: {
    // left panel, chart config setting
    toggleAxisType: function (checked) {
      if (checked) {
        this.axisType = 'log';
      } else {
        this.axisType = 'linear';
      }
      this.setConfig(this.compact);
      this.chart.render();
    },
    toggleShowBasePoint: function (checked) {
      this.showBasePoint = checked;
      this.chart.changeData(this.transformedData);
    },
    toggleShowSpecialPoint: function (checked) {
      this.showSpecialPoint = checked;
      if (this.showSpecialPoint) {
        this.setAnnotation();
      } else {
        this.chart.annotation().clear(true);
      }
      this.chart.render();
    },
    // right panel, added range setting
    onAddedRangeChange: function () {
      this.chart.changeData(this.transformedData);
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
    },
    // chart draw
    createChart: function () {
      this.chart = new Chart({
        container: 'tdd-video-history-line-chart',
        autoFit: true,
        height : this.chartHeight,
        padding: this.chartPadding,
      });
    },
    setData: function () {
      this.chart.data(this.transformedData);
    },
    setConfig: function () {
      this.chart.scale({
        added: {
          type: 'time',
          mask: 'YYYY-MM-DD HH:mm:ss'
        },
        value: {
          type: this.axisType,
          base: 10, // only work when valueType === 'log'
          nice: false
        }
      });
      
      this.chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });
      
      this.chart.axis('added', {
        label: {
          // TODO change formatter
          formatter: function (text) {
            return text.slice(5, 10);
          }
        }
      });
      this.chart.axis('value', {
        label: this.compact ? null : {
          formatter: val => parseInt(val).toLocaleString()
        }
      });
      this.chart.axis('播放瞬时增速/小时', {
        label: null,
        grid: null
      });
      
      if (!this.compact) {
        // TODO update to newest version to fix this bug
        this.chart.option('slider', {
          height: -30,
          trendCfg: {
            // data: this.videoRecords.map(v => -v.view)
            data: []
          },
          formatter: added => this.$util.tsToDateString(Math.floor(added / 1000))
        });
      }
    },
    setAnnotation: function () {
      const data = this.filteredData;
      if (data.length === 0) {
        return;
      }
      
      // view point
      const minView = data[0].view;
      const maxView = data[data.length - 1].view;
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
        let hi = data.length;
        while (lo < hi) {
          let mid = Math.floor(lo + (hi - lo) / 2);
          if (data[mid].view < viewPointTask) {
            lo = mid + 1;
          } else {
            hi = mid;
          }
        }
        viewPoints.push({
          viewPoint: data[lo],
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
        this.chart.annotation().dataMarker({
          position: [ viewPoint.added * 1000, viewPoint.view ],
          text: {
            style: {
              fontSize: 13,
              stroke: 'white',
              lineWidth: 2
            },
            content: viewPointTask.toLocaleString() + '+',
          },
          line: {
            length: 30
          }
        });
      }
    },
    setLayout: function () {
      this.chart.line()
        .position('added*value')
        .color('prop')
        .shape('smooth');
      
      this.chart.area()
        .position('added*播放瞬时增速/小时')
        .color('rgba(255,0,0,0.5)');
    },
    draw: function () {
      this.createChart();
      this.setData();
      this.setConfig();
      this.setAnnotation();
      this.setLayout();
      this.chart.render();
    }
  },
  mounted() {
    let defaultAddedRangeStartIndex = 0;
    if (this.videoRecords.length > 200) {
      defaultAddedRangeStartIndex = this.videoRecords.length - 200;
    }
    this.addedRangeValue = [
      moment(this.videoRecords[defaultAddedRangeStartIndex].added * 1000),
      moment()
    ];
    this.draw();
  }
}
</script>

<style scoped>

</style>
