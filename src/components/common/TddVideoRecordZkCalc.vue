<template>
  <div class="tdd-video-record-zk-calc">
    <template v-if="!isValid">
      <a-alert type="error" message="视频记录数据加载错误，请检查参数" banner />
    </template>
    <template v-else>
      <div style="margin-bottom: 12px">
        <div style="margin-bottom: 12px">
          <h3>周刊期数</h3>
          <div style="overflow: hidden">
            <a-input-number
              :min="211"
              :max="currentZkIssueValue"
              v-model="zkIssueValue"
              @change="setTimespanViaZkIssueValue"
              :style="zkIssueInputStyle"
            />
            <div :style="zkIssueActionStyle">
              <a-button @click="setZkIssueToCurrent">选择当前期</a-button>
              <a-popover title="根据日期选择" trigger="click" style="margin-left: 12px">
                <template #content>
                  <a-date-picker v-model="zkDatePickerValue" @change="setZkIssueViaDatePicker"></a-date-picker>
                </template>
                <a-button>根据日期选择</a-button>
              </a-popover>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 12px">
          <h3>时间范围</h3>
          <div style="overflow: hidden">
            <div :style="startDateStyle">
              开始：
              <a-date-picker
                :disabledDate="disabledStartDate"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="开始"
                v-model="recordStartValue"
                @openChange="handleRecordStartOpenChange"
              ></a-date-picker>
            </div>
            <div style="float: left">
              结束：
              <a-date-picker
                :disabledDate="disabledEndDate"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="结束"
                v-model="recordEndValue"
                :open="recordEndOpen"
                @openChange="handleRecordEndOpenChange"
                style="margin-right: 8px"
              ></a-date-picker>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 12px">
          <h3>起止记录</h3>
          <a-table
            :columns="columns"
            :rowKey="record => record.tableId"
            :pagination="false"
            :dataSource="videoRecordsFromTo"
            :scroll="{ x: 800 }"
            size="small"
          >
            <template #added="added">
              {{ $util.tsToDateString(added) }}
            </template>
            <template #value="value">
              {{ value.toLocaleString() }}
            </template>
            <template #action="obj">
              <a-button type="link" @click="toPreviousIndex(obj.added)" size="small" style="padding-left: 0">上一条</a-button>
              <a-button type="link" @click="toNextIndex(obj.added)" size="small">下一条</a-button>
            </template>
          </a-table>
          <div style="margin-top: 8px">
            <p><a-checkbox :checked="useZero" @change="changeUseZero">使用0代替算分起点记录数据</a-checkbox></p>
            <p>提示：系统自动选择最接近"时间范围"中"开始"时刻的记录作为算分起点记录。算分终止记录同理。可以通过右侧"上一条"、"下一条"按钮进行微调。</p>
          </div>
        </div>
        <div style="margin-bottom: 12px">
          <h3>算分结果</h3>
          <a-row>
            <a-col :xs="10" :md="6">
              <a-statistic title="播放" :value="view" style="margin-bottom: 8px" />
            </a-col>
            <a-col :xs="8" :md="5">
              <a-statistic title="评论" :value="reply" style="margin-bottom: 8px" />
            </a-col>
            <a-col :xs="10" :md="5">
              <a-statistic title="弹幕" :value="danmaku" style="margin-bottom: 8px" />
            </a-col>
            <a-col :xs="8" :md="5">
              <a-statistic title="收藏" :value="favorite" style="margin-bottom: 8px" />
            </a-col>
            <a-col :xs="6" :md="3">
              <a-statistic title="分P数" :value="page" style="margin-bottom: 8px" />
            </a-col>
            <a-col :xs="10" :md="6">
              <a-statistic title="得分" :value="point" style="margin-bottom: 8px" />
            </a-col>
            <a-col :xs="8" :md="5">
              <a-statistic title="修正A" :value="xiua" style="margin-bottom: 8px" />
            </a-col>
            <a-col :xs="6" :md="5">
              <a-statistic title="修正B" :value="xiub" style="margin-bottom: 8px" />
            </a-col>
          </a-row>
          <p>
            注意：周刊统计的播放数只计算站内播放，该数值可能会稍小于本站观测到的播放数，再考虑到数据统计时间范围的差异，因此此处的分数会与周刊的分数有一定的出入。计算结果仅供参考，最终数据以周刊公布的数据为准。自定义数据计算请移步<router-link to="/tool/zkcalc">周刊算分</router-link>工具。
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'TddVideoRecordZkCalc',
  props: {
    videoRecords: {
      type: Array,
      required: true
    },
    page: {
      type: Number,
      required: true
    },
    pubdate: {
      type: Number
    }
  },
  data: function () {
    return {
      columns: [
        {
          title: '时间',
          dataIndex: 'added',
          scopedSlots: { customRender: 'added' },
          width: '168px',
          fixed: 'left',
        }, {
          title: '播放',
          dataIndex: 'view',
          scopedSlots: { customRender: 'value' },
        }, {
          title: '评论',
          dataIndex: 'reply',
          scopedSlots: { customRender: 'value' },
        }, {
          title: '弹幕',
          dataIndex: 'danmaku',
          scopedSlots: { customRender: 'value' },
        }, {
          title: '收藏',
          dataIndex: 'favorite',
          scopedSlots: { customRender: 'value' },
        }, {
          title: '选择',
          key: 'operation',
          scopedSlots: { customRender: 'action' },
        },
      ],
      zkIssueValue: null,
      zkDatePickerValue: null,
      recordStartValue: null,
      recordEndValue: null,
      recordEndOpen: false,
      videoRecordFromIndex: 0,
      videoRecordToIndex: 1,
      useZero: false
    }
  },
  computed: {
    isValid: function () {
      return this.videoRecords !== null && this.videoRecords instanceof Array && this.videoRecords.length > 0;
    },
    currentZkIssueValue: function () {
      return this.calcZkIssueValueViaTs(Math.floor(new Date().valueOf() / 1000));
    },
    videoRecordsFromTo: function () {
      let videoRecordFrom = JSON.parse(JSON.stringify(this.videoRecords[this.videoRecordFromIndex]));
      videoRecordFrom.tableId = 0;
      let videoRecordTo = JSON.parse(JSON.stringify(this.videoRecords[this.videoRecordToIndex]));
      videoRecordTo.tableId = 1;
      return [videoRecordFrom, videoRecordTo];
    },
    startDateStyle: function () {
      let style = { float: 'left' };
      if (this.$store.getters.clientMode === 'MOBILE') {
        style.width = '100%';
        style.marginBottom = '8px';
      } else {
        style.marginRight = '12px';
      }
      return style;
    },
    zkIssueInputStyle: function () {
      let style = { float: 'left', width: '102px' };
      if (this.$store.getters.clientMode === 'MOBILE') {
        style.marginBottom = '8px';
      } else {
        style.marginRight = '12px';
      }
      return style;
    },
    zkIssueActionStyle: function () {
      let style = { float: 'left' };
      if (this.$store.getters.clientMode === 'MOBILE') {
        style.width = '100%';
        // style.marginBottom = '8px';
      }
      return style;
    },
    view: function () {
      return this.useZero ?
        this.videoRecords[this.videoRecordToIndex].view :
        this.videoRecords[this.videoRecordToIndex].view - this.videoRecords[this.videoRecordFromIndex].view;
    },
    reply: function () {
      return this.useZero ?
        this.videoRecords[this.videoRecordToIndex].reply :
        this.videoRecords[this.videoRecordToIndex].reply - this.videoRecords[this.videoRecordFromIndex].reply;
    },
    danmaku: function () {
      return this.useZero ?
        this.videoRecords[this.videoRecordToIndex].danmaku :
        this.videoRecords[this.videoRecordToIndex].danmaku - this.videoRecords[this.videoRecordFromIndex].danmaku;
    },
    favorite: function () {
      return this.useZero ?
        this.videoRecords[this.videoRecordToIndex].favorite :
        this.videoRecords[this.videoRecordToIndex].favorite - this.videoRecords[this.videoRecordFromIndex].favorite;
    },
    point: function () {
      return this.$util.zkCalc(this.view, this.reply, this.danmaku, this.favorite, this.page).point;
    },
    xiua: function () {
      return this.$util.zkCalc(this.view, this.reply, this.danmaku, this.favorite, this.page).xiua;
    },
    xiub: function () {
      return this.$util.zkCalc(this.view, this.reply, this.danmaku, this.favorite, this.page).xiub;
    }
  },
  watch: {
    recordStartValue: function () {
      this.updateVideoRecordFromIndex();
    },
    recordEndValue: function () {
      this.updateVideoRecordToIndex();
    },
    zkIssueValue: function () {
      if (this.pubdate) {
        this.useZero = this.calcZkIssueValueViaTs(this.pubdate) === this.zkIssueValue;
      } else {
        this.useZero = false;
      }
    },
    pubdate: function () {
      if (this.pubdate) {
        this.useZero = this.calcZkIssueValueViaTs(this.pubdate) === this.zkIssueValue;
      } else {
        this.useZero = false;
      }
    }
  },
  methods: {
    disabledStartDate(startValue) {
      const endValue = this.recordEndValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.recordStartValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleRecordStartOpenChange(open) {
      if (!open) {
        if (this.recordStartValue != null && this.recordEndValue == null) {
          this.recordEndOpen = true;
        }
      }
    },
    handleRecordEndOpenChange(open) {
      this.recordEndOpen = open;
    },
    calcZkIssueValueViaTs: function (dateTs) {
      const baseTs = 1344020400; // only support 211+
      return Math.floor((dateTs - baseTs) / (7 * 24 * 60 * 60)) + 1;
    },
    setTimespanViaZkIssueValue: function () {
      const baseTs = 1344020400; // only support 211+
      const issueBeginTs = baseTs + (this.zkIssueValue - 1) * (7 * 24 * 60 * 60);
      const issueEndTs = issueBeginTs + (7 * 24 * 60 * 60) - 1;
      this.recordStartValue = moment(issueBeginTs * 1000);
      this.recordEndValue = moment(issueEndTs * 1000);
    },
    setZkIssueToCurrent: function () {
      this.zkIssueValue = this.currentZkIssueValue;
      this.setTimespanViaZkIssueValue();
    },
    setZkIssueViaDatePicker: function () {
      this.zkIssueValue = this.calcZkIssueValueViaTs(Math.floor(this.zkDatePickerValue.valueOf() / 1000));
      this.setTimespanViaZkIssueValue();
    },
    locateNearestIndex: function (ts) {
      // binary search
      let lo = 0;
      let hi = this.videoRecords.length;
      while (lo < hi) {
        let mid = Math.floor(lo + (hi - lo) / 2);
        if (this.videoRecords[mid].added < ts) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }
      if (lo === 0) {
        return lo;
      }
      if (lo === this.videoRecords.length) {
        return lo - 1;
      }
      let leftTs = this.videoRecords[lo - 1].added;
      let rightTs = this.videoRecords[lo].added;
      if (ts - leftTs < rightTs - ts) {
        return lo - 1;
      } else {
        return lo;
      }
      // brute force
      // let index = 0;
      // while (index < this.videoRecords.length) {
      //   if (this.videoRecords[index].added >= ts) {
      //     break;
      //   } else {
      //     index++;
      //   }
      // }
      // if (index === 0) {
      //   return index;
      // }
      // if (index === this.videoRecords.length) {
      //   return index - 1;
      // }
      // let diff = this.videoRecords[index].added - ts;
      // if (ts - this.videoRecords[index - 1].added < diff) {
      //   return index - 1;
      // } else {
      //   return index;
      // }
    },
    updateVideoRecordFromIndex: function () {
      this.videoRecordFromIndex = this.locateNearestIndex(Math.floor(this.recordStartValue.valueOf() / 1000));
    },
    updateVideoRecordToIndex: function () {
      this.videoRecordToIndex = this.locateNearestIndex(Math.floor(this.recordEndValue.valueOf() / 1000));
    },
    toPreviousIndex: function (added) {
      // check from or to
      if (this.videoRecords[this.videoRecordFromIndex].added === added) {
        // from
        if (this.videoRecordFromIndex > 0) {
          this.videoRecordFromIndex--;
        } else {
          alert('已经是第一条记录了呀qwq');
        }
      } else if (this.videoRecords[this.videoRecordToIndex].added === added) {
        // to
        if (this.videoRecordToIndex > 0) {
          this.videoRecordToIndex--;
        } else {
          alert('已经是第一条记录了呀qwq');
        }
      }
    },
    toNextIndex: function (added) {
      // check from or to
      if (this.videoRecords[this.videoRecordFromIndex].added === added) {
        // from
        if (this.videoRecordFromIndex < this.videoRecords.length - 1) {
          this.videoRecordFromIndex++;
        } else {
          alert('已经是最后一条记录了呀qwq');
        }
      } else if (this.videoRecords[this.videoRecordToIndex].added === added) {
        // to
        if (this.videoRecordToIndex < this.videoRecords.length - 1) {
          this.videoRecordToIndex++;
        } else {
          alert('已经是最后一条记录了呀qwq');
        }
      }
    },
    changeUseZero: function () {
      this.useZero = !this.useZero;
    }
  },
  created() {
    this.zkIssueValue = this.calcZkIssueValueViaTs(Math.floor(new Date().valueOf() / 1000));
    this.setTimespanViaZkIssueValue();
  }
}
</script>

<style scoped>

</style>
