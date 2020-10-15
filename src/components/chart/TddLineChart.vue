<template>
  <div>
    <div :id="toolbarId" style="overflow: hidden">
      <a-popover v-if="config.configPanel" title="图表设置" trigger="click" placement="bottomLeft">
        <div slot="content" class="config-panel-content">
          <div v-if="config.configPanel.changeAxisType">
            坐标系类型：<a-switch checkedChildren="对数" unCheckedChildren="线性" @change="toggleAxisType" />
          </div>
          <div v-if="config.configPanel.showSpecialPoint">
            特殊数据标记：<a-switch default-checked @change="toggleShowSpecialPoint" />
          </div>
          <div v-if="config.configPanel.showBasePoint">
            数据原点显示：<a-switch @change="toggleShowBasePoint" />
          </div>
        </div>
        <span style="cursor: pointer"><a-icon type="setting" /> 图表设置</span>
      </a-popover>
      <template v-if="config.dateRangePanel">
        <div v-if="compact" style="float: right" @click="onAddedRangeMobileClick">
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
            <p>数据共计：{{ this.data.length }}条，当前展示：{{ this.filteredData.length }}条。</p>
            <a-alert v-if="showPerformanceWarning" banner>
              <template slot="message">
                当前显示数据较多，可能会出现图表卡顿，如欲提高响应速度，请酌情缩小时间范围。
              </template>
            </a-alert>
          </a-modal>
        </div>
        <a-popover v-else title="时间范围" trigger="click" placement="bottomRight" style="float: right">
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
            <p>数据共计：{{ this.data.length }}条，当前展示：{{ this.filteredData.length }}条。</p>
            <a-alert v-if="showPerformanceWarning" banner>
              <template slot="message">
                当前显示数据较多，可能会出现图表卡顿，<br>如欲提高响应速度，请酌情缩小时间范围。
              </template>
            </a-alert>
          </template>
          <span style="cursor: pointer">时间范围 <a-icon type="calendar" /></span>
        </a-popover>
      </template>
    </div>
    <div :id="chartId"></div>
  </div>
</template>

<script>
import { Chart } from '@antv/g2';
import moment from "moment";

export default {
  name: 'TddLineChart',
  props: {
    id: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    option: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data: function () {
    return {
      // chart
      chart: null,
      chartPaddingDESKTOP: [ 20, 8, 95, 68 ],
      chartPaddingMOBILE: [ 20, 8, 50, 8 ],
      chartHeightDESKTOP: 400,
      chartHeightMOBILE: 300,
      // config panel
      axisType: 'linear',
      showBasePoint: false,
      showSpecialPoint: true,
      // date range panel
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
      // config
      defaultConfig: {
        // left panel of toolbar, provide chart config
        configPanel: {
          // change axis type between linear or log
          changeAxisType: {},
          // show special points
          showSpecialPoint: {
            exactlyView: true,  // 10k, 100k, 200k, ..., 1m, 2m, ..., 10m, 20m, ...
          },
          // show base point
          showBasePoint: {
            basePointAdded: 0,  // ts_s, maybe pubdate
          },
        },
        // right panel of toolbar, provide date range select
        dateRangePanel: {
          // performance warning
          performanceWarning: 200,  // 200 for multi props, 1000 for single prop
        },
        // data manipulation
        data: {
          addSpeed: [],  // default
          // addSpeed: [{
          //   prop: 'view',  // prop name
          //   per: 'hour',  // per, timespan, could be 'hour', 'day'
          //   rename: true,  // will auto rename in the transform process
          // }],  // add speed of prop
          transform: {
            rename: null,  // default
            // rename: {
            //   view: '播放',
            //   danmaku: '弹幕',
            // },  // prop rename map
            fold: null,  // default
            // fold: ['播放', '弹幕'],
          },  // dv transform
          dataLine: 'value',  // default
          // dataLine: 'viewincr',  // single line support
          speedArea: null,  // default
          // speedArea: 'view',  // speed area prop
        },
      },
    };
  },
  computed: {
    // display start ts
    startTs: function () {
      if (this.addedRangeValue[0]) {
        return Math.floor(this.addedRangeValue[0].valueOf() / 1000);
      } else {
        // return ((new Date()).valueOf() / 1000 - 7 * 24 * 60 * 60).toFixed(0);
        return 0;
      }
    },
    // display end ts
    endTs: function () {
      if (this.addedRangeValue[1]) {
        return Math.floor(this.addedRangeValue[1].valueOf() / 1000);
      } else {
        return ((new Date()).valueOf() / 1000).toFixed(0);
      }
    },
    // data add base point, filter by added range
    filteredData: function () {
      let filteredData = [];
      
      // add base point
      if (this.showBasePoint) {
        const templatePoint = this.$util.deepClone(this.data[0]);
        for (let key in templatePoint) {
          templatePoint[key] = 0;
        }
        templatePoint['added'] = this.config.configPanel.showBasePoint.basePointAdded;
        filteredData.push(templatePoint);
      }
      
      // cut via range
      filteredData = [
        ...filteredData,
        ...this.data.filter(v => v.added >= this.startTs && v.added <= this.endTs),
      ]
      
      return filteredData;
    },
    // data manipulation for chart display
    transformedData: function () {
      // annotation
      // TODO can I move it to another proper place?
      this.chart.annotation().clear(true);
      this.setAnnotation();
      
      // copy filtered data
      const filteredData = [...this.filteredData];
      
      // add speed
      if (filteredData.length > 0 && this.config.data.addSpeed) {
        for (let { prop, per } of this.config.data.addSpeed) {
          const per_ts = {
            'hour': 60 * 60,
            'day': 24 * 60 * 60,
          }[per];
          const prop_speed = `${prop}_speed`;
          filteredData[0][prop_speed] = 0; // set first speed to 0
          for (let i = 1; i < filteredData.length; i++) {
            const prop_diff = filteredData[i][prop] - filteredData[i-1][prop];
            const added_diff = filteredData[i].added - filteredData[i-1].added;
            if (prop_diff === 0 && added_diff <= 75) {
              // two record with same value in 75s
              filteredData[i][prop_speed] = filteredData[i-1][prop_speed];
            } else {
              // speed per *
              filteredData[i][prop_speed] = parseFloat((prop_diff / added_diff * per_ts).toFixed(2));
            }
          }
        }
      }
      
      // transform
      let dv = new this.$util.DataView().source(filteredData);
      
      // rename
      const renameMap = this.$util.deepClone(this.config.data.transform.rename);
      if (renameMap) {
        // add need rename speed
        for (let { prop, per, rename } of this.config.data.addSpeed) {
          if (!rename) {
            continue;
          }
          const prop_speed = `${prop}_speed`;
          const per_rename = {
            'hour': '小时',
            'day': '日',
          }[per];
          renameMap[prop_speed] = `${renameMap[prop]}瞬时增速/${per_rename}`;
        }
        // go rename
        dv = dv.transform({
          type: 'rename',
          map: renameMap,
        });
      }
      
      // fold
      const foldFields = this.config.data.transform.fold;
      if (foldFields) {
        // go fold
        dv = dv.transform({
          type: 'fold',
          fields: foldFields,
          key: 'prop',
          value: 'value'
        });
      }
      
      // ts_ms -> ts_s
      dv = dv.transform({
        type: 'map',
        callback(row) {
          row.added = row.added * 1000; // ts_s -> ts_ms
          return row;
        }
      })
      
      return dv.rows;
    },
    // id of toolbar div
    toolbarId: function () {
      return `${this.id}-line-chart-toolbar`;
    },
    // id of chart div
    chartId: function () {
      return `${this.id}-line-chart`;
    },
    // option -> config
    config: function () {
      const costumedConfig = this.$util.deepClone(this.defaultConfig);
      
      // TODO maybe have bug
      const optionToConfig = function (option, config) {
        for (let key in option) {
          if (option.hasOwnProperty(key)) {
            if (typeof option[key] !== 'object' || option[key] == null) {
              config[key] = option[key];
            } else if (option[key] instanceof Array) {
              config[key] = option[key];
            } else {
              if (typeof config[key] !== 'object' || config[key] == null || JSON.stringify(config[key]) === '{}') {
                config[key] = option[key];
              } else {
                optionToConfig(option[key], config[key]);
              }
            }
          }
        }
      }

      optionToConfig(this.option, costumedConfig);
      
      return costumedConfig;
    },
    // compact mode or not
    compact: function() {
      return this.$store.getters.clientMode === 'MOBILE';
    },
    // chart padding
    chartPadding: function() {
      return this.compact
        ? this.chartPaddingMOBILE
        : this.chartPaddingDESKTOP;
    },
    // chart height
    chartHeight: function() {
      return this.compact
        ? this.chartHeightMOBILE
        : this.chartHeightDESKTOP;
    },
    //
    showPerformanceWarning: function () {
      return this.filteredData.length > this.config.dateRangePanel.performanceWarning;
    },
  },
  watch: {
    compact: function() {
      this.chart.destroy();
      this.draw();
    },
    data: function () {
      // TODO change addedRangeValue
      this.chart.changeData(this.transformedData);
      // TODO test whether need render
      this.chart.render();
    }
  },
  methods: {
    // config panel
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
    // date range panel, added range setting
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
        container: this.chartId,
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
      this.chart.axis(this.config.data.dataLine, {
        label: this.compact ? null : {
          formatter: val => parseInt(val).toLocaleString()
        }
      });
      this.chart.axis('播放瞬时增速/小时', {
        label: null,
        grid: null
      });
      
      // set slider
      if (!this.compact) {
        // TODO update to newest version to fix this bug
        this.chart.option('slider', {
          height: -30,
          trendCfg: {
            // data: this.data.map(v => -v.view)
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
      
      // set exactly view point
      if (this.config.configPanel
        && this.config.configPanel.showSpecialPoint
        && this.config.configPanel.showSpecialPoint.exactlyView
      ) {
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
      }
    },
    setLayout: function () {
      if (this.config.data.dataLine === 'value') {
        this.chart.line()
          .position('added*value')
          .color('prop')
          .shape('smooth');
      } else {
        // single line support
        this.chart.line()
          .position(`added*${this.config.data.dataLine}`)
          .shape('smooth');
      }

      
      // speed area
      if (this.config.data.speedArea) {
        const prop = this.config.data.speedArea;
        const { per } = this.config.data.addSpeed.find(x => x.prop === prop);
        const per_rename = {
          'hour': '小时',
          'day': '日',
        }[per];
        const prop_name = `${this.config.data.transform.rename[prop]}瞬时增速/${per_rename}`;
        this.chart.area()
          .position(`added*${prop_name}`)
          .color('rgba(255,0,0,0.5)');
      }
    },
    draw: function () {
      this.createChart();
      this.setData();
      this.setConfig();
      this.setAnnotation();
      this.setLayout();
      this.chart.render();
    },
  },
  mounted() {
    // sort via added
    this.data.sort((a, b) => a.added - b.added);
    
    // init addedRangeValue
    let defaultAddedRangeStartIndex = 0;
    const defaultDataLength = this.config.dateRangePanel
      ? (this.config.dateRangePanel.performanceWarning
        ? this.config.dateRangePanel.performanceWarning
        : 200)
      : 200;
    if (this.data.length > defaultDataLength) {
      defaultAddedRangeStartIndex = this.data.length - defaultDataLength;
    }
    this.addedRangeValue = [
      moment(this.data[defaultAddedRangeStartIndex].added * 1000),
      moment(),
    ];
    // go draw
    this.draw();
  },
}
</script>

<style scoped>
.config-panel-content {
  margin-bottom: -12px;
}
.config-panel-content div {
  margin-bottom: 12px;
}
</style>
