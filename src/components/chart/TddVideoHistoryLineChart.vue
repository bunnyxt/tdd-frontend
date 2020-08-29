<template>
  <div>
    <div id="video-detail-history-line-chart-toolbar" style="overflow: hidden">
      <a-popover title="图表设置" trigger="click" placement="bottomLeft">
        <div slot="content">
          <p>坐标系类型：<a-switch checkedChildren="对数" unCheckedChildren="线性" @change="toggleAxisType" /></p>
          <p>特殊数据标记：<a-switch default-checked @change="toggleShowSpecialPoint" /></p>
          <p>数据原点显示：<a-switch @change="toggleShowBasePoint" /></p>
        </div>
        <span style="cursor: pointer"><a-icon type="setting" /> 图表设置</span>
      </a-popover>
<!--      <div v-if="$store.getters.clientMode === 'MOBILE'" style="float: right" @click="onAddedRangeMobileClick">-->
<!--        <span style="cursor: pointer">时间范围 <a-icon type="calendar" /></span>-->
<!--        <a-modal title="时间范围" v-model="addedRangeMobileVisibility">-->
<!--          <template slot="footer">-->
<!--            <a-button type="primary" @click="onAddedRangeMobileClick">确定</a-button>-->
<!--          </template>-->
<!--          <p>-->
<!--            开始：-->
<!--            <a-date-picker-->
<!--              showTime-->
<!--              format="YYYY-MM-DD HH:mm:ss"-->
<!--              placeholder="开始"-->
<!--              v-model="addedRangeValueStart"-->
<!--              @change="onAddedRangeValueStartChange"-->
<!--            ></a-date-picker>-->
<!--          </p>-->
<!--          <p>-->
<!--            结束：-->
<!--            <a-date-picker-->
<!--              showTime-->
<!--              format="YYYY-MM-DD HH:mm:ss"-->
<!--              placeholder="结束"-->
<!--              v-model="addedRangeValueEnd"-->
<!--              @change="onAddedRangeValueEndChange"-->
<!--            ></a-date-picker>-->
<!--          </p>-->
<!--          <p>-->
<!--            <a-button size="small" @click="setAddedRangeMobile(1)" style="margin-right: 4px">1日</a-button>-->
<!--            <a-button size="small" @click="setAddedRangeMobile(7)" style="margin-right: 4px">7日</a-button>-->
<!--            <a-button size="small" @click="setAddedRangeMobile(30)" style="margin-right: 4px">30日</a-button>-->
<!--            <a-button size="small" @click="setAddedRangeMobile(180)">180日</a-button>-->
<!--          </p>-->
<!--          <p>数据共计：{{ this.videoRecords.length }}条，当前展示：{{ this.data.length }}条。</p>-->
<!--          <a-alert v-if="data.length > 200" message="当前显示数据较多，可能会出现图表卡顿，如欲提高响应速度，请酌情缩小时间范围。" banner />-->
<!--        </a-modal>-->
<!--      </div>-->
<!--      <template v-else>-->
<!--        <a-popover title="时间范围" trigger="click" placement="bottomRight" style="float: right">-->
<!--          <template slot="content">-->
<!--            <p>-->
<!--              <a-range-picker-->
<!--                showTime-->
<!--                v-model="addedRangeValue"-->
<!--                :ranges="addedRangeRanges"-->
<!--                :disabledDate="addedRangeDisabledDate"-->
<!--                @change="onAddedRangeChange"-->
<!--                style="width: 360px"-->
<!--              />-->
<!--            </p>-->
<!--            <p>数据共计：{{ this.videoRecords.length }}条，当前展示：{{ this.data.length }}条。</p>-->
<!--            <a-alert v-if="data.length > 200" banner>-->
<!--              <template slot="message">-->
<!--                当前显示数据较多，可能会出现图表卡顿，<br>如欲提高响应速度，请酌情缩小时间范围。-->
<!--              </template>-->
<!--            </a-alert>-->
<!--          </template>-->
<!--          <span style="cursor: pointer">时间范围 <a-icon type="calendar" /></span>-->
<!--        </a-popover>-->
<!--      </template>-->
    </div>
    <div id="tdd-video-history-line-chart"></div>
  </div>
</template>

<script>
import { Chart } from '@antv/g2';
import { DataView } from '@antv/data-set';

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
      chart: null,
      axisType: 'linear',
      chartPaddingDESKTOP: [ 20, 8, 95, 68 ],
      chartPaddingMOBILE: [ 20, 8, 50, 8 ],
      chartHeightDESKTOP: 400,
      chartHeightMOBILE: 300,
      showBasePoint: false,
      showSpecialPoint: true,
    }
  },
  computed: {
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
      this.chart.changeData(this.transformRecords(this.videoRecords, this.pubdate, undefined, undefined, this.showBasePoint));
    }
  },
  methods: {
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
      this.chart.changeData(this.transformRecords(this.videoRecords, this.pubdate, undefined, undefined, this.showBasePoint));
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
    transformRecords: function (rawRecords,
                                pubdate = 0,
                                startTs = 0,
                                endTs = ((new Date()).valueOf() / 1000).toFixed(0),
                                showBasePoint = false) {
      let newRecords = [];

      // add base point
      if (showBasePoint) {
        newRecords.push({
          id: 0,
          added: pubdate,
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
      newRecords = [
        ...newRecords,
        ...rawRecords.filter(v => v.added >= startTs && v.added <= endTs)
      ]

      // add view speed
      if (newRecords.length > 0) {
        newRecords[0].view_speed = 0; // set first speed to 0
        for (let i = 1; i < newRecords.length; i++) {
          const view_diff = newRecords[i].view - newRecords[i-1].view;
          const added_diff = newRecords[i].added - newRecords[i-1].added;
          if (view_diff === 0 && added_diff <= 75) {
            // two record with same value in 75s
            newRecords[i].view_speed = newRecords[i-1].view_speed;
          } else {
            // speed per hour
            newRecords[i].view_speed = parseFloat((view_diff / added_diff * 60 * 60).toFixed(2));
          }
        }
      }

      return new DataView().source(newRecords)
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
    createChart: function () {
      this.chart = new Chart({
        container: 'tdd-video-history-line-chart',
        autoFit: true,
        height : this.chartHeight,
        padding: this.chartPadding,
      });
    },
    setData: function (data) {
      this.chart.data(data);
    },
    setConfig: function (compact) {
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
        label: compact ? null : {
          formatter: val => parseInt(val).toLocaleString()
        }
      });
      this.chart.axis('播放瞬时增速/小时', {
        label: null,
        grid: null
      });
      
      if (!compact) {
        // TODO update to newest version to fix this bug
        this.chart.option('slider', {
          height: -30,
          trendCfg: {
            data: this.videoRecords.map(v => -v.view)
          },
          formatter: added => this.$util.tsToDateString(Math.floor(added / 1000))
        });
      }
    },
    setAnnotation: function () {
      const viewList = this.videoRecords.map(x => x.view);
      // TODO
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
      this.setData(this.transformRecords(this.videoRecords, this.pubdate, undefined, undefined, this.showBasePoint));
      this.setConfig(this.compact);
      this.setAnnotation();
      this.setLayout();
      this.chart.render();
    }
  },
  mounted() {
    this.draw();
  }
}
</script>

<style scoped>

</style>
