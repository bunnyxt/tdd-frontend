<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>视频</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>视频</h1>
      <p>天钿Daily收录B站<a href="https://www.bilibili.com/v/music/vocaloid/" target="_blank">VOCALOID·UTAU</a>分区下的所有视频和部分其他分区中的VC视频。</p>
      <a-alert style="margin-bottom: 8px" message="播放、弹幕等数据并非时时数据，最低每24小时更新一次" banner />
      <a-alert style="margin-bottom: 8px" message="点击视频列表查看详细信息" banner type="info"/>
      <div style="display: flex">
        <tdd-video-abid-auto-complete v-model="jumpVideoTargetIdObj" />
        <a-button
          type="primary"
          :disabled="typeof jumpVideoTargetIdObj.id === 'string' ? jumpVideoTargetIdObj.id.length === 0 : true"
          @click="goJumpVideo"
          style="margin-left: 8px"
        >跳转</a-button>
      </div>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <a-collapse :activeKey="[1]" style="margin-bottom: 8px">
        <a-collapse-panel header="筛选搜索" key="1">
          <table class="filter-table">
            <tr>
              <td>视频分类</td>
              <td>
                <a-radio-group name="queryParameterVcRadioGroup" v-model="queryParameter.vc.value">
                  <a-radio value="0">全部</a-radio>
                  <a-radio value="1">仅VC</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td>活跃程度</td>
              <td>
                <a-radio-group name="queryParameterActivityRadioGroup" v-model="queryParameter.activity.value">
                  <a-radio value="-1">所有视频</a-radio>
                  <a-radio value="1">活跃视频</a-radio>
                  <a-radio value="2">热门视频</a-radio>
                  <a-radio value="0">其他视频</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td>最近投稿</td>
              <td>
                <a-radio-group name="queryParameterRecentRadioGroup" v-model="queryParameter.recent.value">
                  <a-radio value="-1">所有视频</a-radio>
                  <a-radio value="1">本周新作</a-radio>
                  <a-radio value="2">本日新作</a-radio>
                  <a-radio value="0">其他视频</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td>排序依据</td>
              <td>
                <a-radio-group name="queryParameterOrderByRadioGroup" v-model="queryParameter.order_by.value">
                  <a-radio value="pubdate">投稿时间</a-radio>
                  <a-radio value="view">播放</a-radio>
                  <a-radio value="danmaku">弹幕</a-radio>
                  <a-radio value="reply">评论</a-radio>
                  <a-radio value="favorite">收藏</a-radio>
                  <a-radio value="coin">硬币</a-radio>
                  <a-radio value="share">分享</a-radio>
                  <a-radio value="like">点赞</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td>排序顺序</td>
              <td>
                <a-radio-group name="queryParameterDescRadioGroup" v-model="queryParameter.desc.value">
                  <a-radio value="0">从小到大</a-radio>
                  <a-radio value="1">从大到小</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td>投稿时间</td>
              <td>
                <a-date-picker
                  :disabledDate="disabledStartDate"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始"
                  v-model="queryParameter.start_ts.value"
                  @change="handlePubdateStartChange"
                  @openChange="handlePubdateStartOpenChange"
                />
                ~
                <a-date-picker
                  :disabledDate="disabledEndDate"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="结束"
                  v-model="queryParameter.end_ts.value"
                  :open="pubdateEndOpen"
                  @change="handlePubdateEndChange"
                  @openChange="handlePubdateEndOpenChange"
                  style="margin-right: 8px"
                />
                <a-select
                  style="width: 100px"
                  placeholder="快速选择"
                  v-model="pubdateSelectValue"
                  @change="handlePubdateSelectChange">
                  <a-select-option value="custom">自定义</a-select-option>
                  <a-select-option value="day">本日</a-select-option>
                  <a-select-option value="week">本周</a-select-option>
                  <a-select-option value="month">本月</a-select-option>
                  <a-select-option value="year">本年</a-select-option>
                  <a-select-option value="last_day">近一日</a-select-option>
                  <a-select-option value="last_week">近一周</a-select-option>
                  <a-select-option value="last_month">近一月</a-select-option>
                  <a-select-option value="last_year">近一年</a-select-option>
                </a-select>
              </td>
            </tr>
            <tr>
              <td>视频标题</td>
              <td>
                <a-input v-model="queryParameter.title.value" placeholder="视频标题" allowClear />
              </td>
            </tr>
            <tr>
              <td>UP主昵称</td>
              <td>
                <a-input v-model="queryParameter.up_name.value" placeholder="UP主昵称" allowClear />
              </td>
            </tr>
          </table>
          <a-button
            type="primary"
            icon="search"
            :loading="isLoadingVideoList"
            :disable="queryParameterInvalidityList.length > 0"
            @click="handleSearchButtonClick"
            style="margin-top: 8px"
          >
            搜索
          </a-button>
          <a-popconfirm
            title="确定重置所有条件？"
            @confirm="resetQueryParameters"
            okText="确定"
            cancelText="取消"
          >
            <a-button icon="reload" style="margin-top: 8px; margin-left: 16px">重置</a-button>
          </a-popconfirm>
        </a-collapse-panel>
      </a-collapse>
      <a-spin :spinning="isLoadingVideoList">
<!--        <a-alert-->
<!--          v-if="isLoadingVideoList"-->
<!--          message="加载中..."-->
<!--          :description="loadingDescription"-->
<!--          type="info"-->
<!--          style="margin-top: 12px"-->
<!--        />-->
<!--        <template v-else>-->
          <tdd-video-list
            :video-list="videoList"
            :main-prop="mainProp"
            mode="grid"
            @item-clicked="videoListItemClickedHandler"
          ></tdd-video-list>
          <a-pagination
            showQuickJumper
            v-model="queryParameter.pn.value"
            :total="videoTotalCount"
            :showTotal="total => `共 ${total} 个视频`"
            :pageSize="20"
            style="margin-top: 8px"
            @change="onPagiChange"
          />
<!--        </template>-->
      </a-spin>
    </div>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue';
import moment from 'moment';
import TddVideoList from "../../common/TddVideoList";
import TddVideoAbidAutoComplete from "@/components/common/TddVideoAbidAutoComplete";

export default {
  name: "VideoHome",
  components: {
    TddVideoAbidAutoComplete,
    TddVideoList
  },
  data: function() {
    return {
      jumpVideoTargetIdObj: { id: '', type: 'aid' },
      videoList: [],
      isLoadingVideoList: false,
      pubdateEndOpen: false,
      pubdateSelectValue: undefined,
      videoTotalCount: 0,
      mainProp: 'view',
      queryParameter: {
        vc: {
          label: '视频分类',
          type: 'category',
          allowedValues: ['0', '1'],
          value: '1',
          default: '1',
          toQueryEntry: function (value) {
            if (value === '1') {
              return ['vc', '1'];
            }
            return null;
          },
        },
        activity: {
          label: '活跃程度',
          type: 'category',
          allowedValues: ['-1', '0', '1', '2'],
          value: '-1',
          default: '-1',
          toQueryEntry: function (value) {
            if (value === '-1') {
              return null;
            }
            return ['activity', value];
          },
        },
        recent: {
          label: '最近投稿',
          type: 'category',
          allowedValues: ['-1', '0', '1', '2'],
          value: '-1',
          default: '-1',
          toQueryEntry: function (value) {
            if (value === '-1') {
              return null;
            }
            return ['recent', value];
          },
        },
        order_by: {
          label: '排序依据',
          type: 'category',
          allowedValues: ['pubdate', 'view', 'danmaku', 'reply', 'favorite', 'coin', 'share', 'like'],
          value: 'pubdate',
          default: 'pubdate',
          toQueryEntry: function (value) {
            return ['order_by', value];
          },
        },
        desc: {
          label: '排序顺序',
          type: 'category',
          allowedValues: ['0', '1'],
          value: '1',
          default: '1',
          toQueryEntry: function (value) {
            return ['desc', value];
          },
        },
        start_ts: {
          label: '投稿时间（开始）',
          type: 'moment',
          value: null,  // store moment object
          default: null,
          toQueryEntry: function (value) {
            if (value) {
              return ['start_ts', Math.floor(value.toDate().valueOf() / 1000)];
            }
            return null;
          },
        },
        end_ts: {
          label: '投稿时间（结束）',
          type: 'moment',
          value: null,  // store moment object
          default: null,
          toQueryEntry: function (value) {
            if (value) {
              return ['end_ts', Math.floor(value.toDate().valueOf() / 1000)];
            }
            return null;
          },
        },
        title: {
          label: '视频标题',
          type: 'text',
          value: null,
          default: null,
          toQueryEntry: function (value) {
            if (value) {
              return ['title', value];
            }
            return null;
          },
        },
        up_name: {
          label: 'UP主昵称',
          type: 'text',
          value: null,
          default: null,
          toQueryEntry: function (value) {
            if (value) {
              return ['up', value];
            }
            return null;
          },
        },
        pn: {
          label: '页码',
          type: 'integer',
          value: 1,
          default: 1,
          toQueryEntry: function (value) {
            if (value) {
              return ['pn', value];
            }
            return null;
          },
        },
      },
    }
  },
  computed: {
    queryParameterInvalidityList: function () {
      // TODO finish other type
      const invalidityList = [];
      for (const [parameter, metadata] of Object.entries(this.queryParameter)) {
        switch (metadata.type) {
          case 'category':
            if (!metadata.allowedValues.includes(metadata.value)) {
              invalidityList.push({
                name: parameter,
                value: metadata.value,
                message: `条件${metadata.label}的值${metadata.value}不在合法集合[${metadata.allowedValues}]内`,
              });
            }
            break;
          default:
            break;
        }
      }
      return invalidityList;
    },
    loadingDescription: function () {
      // TODO need refactor
      // const paramDescriptions = [];
      // for (const metadata of Object.entries(this.queryParameter)) {
      //   if (metadata.value !== metadata.default) {
      //     let paramDescription;
      //     if (metadata.type === 'moment') {
      //       // TODO
      //     } else {
      //       // TODO
      //     }
      //     paramDescriptions.push(paramDescription);
      //   }
      // }
      // return paramDescriptions.join('，');
      return '';
    },
  },
  methods: {
    goJumpVideo: function () {
      this.$router.push(`/video/${
        {aid: 'av', bvid: 'BV'}[this.jumpVideoTargetIdObj.type]
      }${this.jumpVideoTargetIdObj.id}`);
    },
    init: function (queryObj) {
      // set page query entries to queryParameter
      for (let [key, value] of Object.entries(queryObj)) {
        if (Object.keys(this.queryParameter).includes(key)) {
          // change value format
          switch (this.queryParameter[key].type) {
            case 'integer':
              value = parseInt(value);
              break;
            case 'float':
              value = parseFloat(value);
              break;
            case 'moment':
              value = moment.unix(value);  // to moment object
              break;
            case 'category':
            case 'text':
            default:
              break;
          }
          this.queryParameter[key].value = value;
        }
      }
      
      // check queryParameter validity
      if (this.queryParameterInvalidityList.length > 0) {
        const that = this;
        Modal.error({
          title: '查询参数非法',
          content: this.queryParameterInvalidityList.reduce(
            ((prev, curr) => prev += `${curr.message}；`), ''
          ).replace(/(；$)/g, '。'),
          okText: '重置搜索参数',
          onOk: function () {
            that.$router.push('/video');
            that.resetQueryParameters();
            that.fetchVideoList();
          },
        });
        return;
      }
      
      // go fetch video list
      this.fetchVideoList();
    },
    videoListItemClickedHandler: function (item) {
      this.$store.commit('setVideoDetailDrawerVideo', item);
      this.$store.commit('setVideoDetailDrawerVisibility', true);
    },
    assembleQueryParams: function () {
      const params = {};
      for (const metadata of Object.values(this.queryParameter)) {
        const queryEntry = metadata.toQueryEntry(metadata.value);
        if (queryEntry) {
          params[queryEntry[0]] = queryEntry[1];
        }
      }
      return params;
    },
    fetchVideoList: function () {
      if (this.queryParameterInvalidityList.length > 0) {
        return;
      }
      this.isLoadingVideoList = true;
      const that = this;
      const queryParams = this.assembleQueryParams();
      this.$axios.get('video', { params: queryParams })
        .then(function (response) {
          that.videoList = response.data;
          that.videoTotalCount = parseInt(response.headers['x-total-count']);
          // change mainProp
          if (queryParams.order_by === 'pubdate') {
            that.mainProp = 'view';
          } else {
            that.mainProp = queryParams.order_by;
          }
        })
        .catch(function (error) {
          let title = `${error.response.data.code} - ${error.response.data.message}`;
          let content = JSON.stringify(error.response.data.detail);
          if (error.response.data.code === 40001) {
            title = '请求参数出错';
            content = '请检查筛选搜索条件。' + JSON.stringify(error.response.data);
          }
          Modal.error({ title, content });
        })
        .finally(function () {
          that.isLoadingVideoList = false;
        });
    },
    disabledStartDate(startValue) {
      const endValue = this.pubdateEndValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.pubdateStartValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handlePubdateStartChange() {
      if (this.pubdateSelectValue !== 'custom') {
        this.pubdateSelectValue = 'custom';
      }
    },
    handlePubdateStartOpenChange(open) {
      if (!open) {
        if (this.queryParameter.start_ts.value !== null && this.queryParameter.end_ts.value === null) {
          this.pubdateEndOpen = true;
        }
      }
    },
    handlePubdateEndChange() {
      if (this.pubdateSelectValue !== 'custom') {
        this.pubdateSelectValue = 'custom';
      }
    },
    handlePubdateEndOpenChange(open) {
      this.pubdateEndOpen = open;
    },
    handlePubdateSelectChange(value) {
      switch (value) {
        case 'custom':
          this.queryParameter.start_ts.value = null;
          this.queryParameter.end_ts.value = null;
          break;
        case 'day':
        case 'week':
        case 'month':
        case 'year':
          this.queryParameter.start_ts.value = moment().startOf(value);
          this.queryParameter.end_ts.value = moment().endOf(value);
          break;
        case 'last_day':
        case 'last_week':
        case 'last_month':
        case 'last_year':
          this.queryParameter.start_ts.value = moment().add(-1, value.slice(5))
          this.queryParameter.end_ts.value = moment();
          break;
        default:
          break;
      }
    },
    handleSearchButtonClick: function() {
      if (this.isLoadingVideoList) {
        return;
      }
      // reset pn to 1
      this.queryParameter.pn.value = 1;
      // assemble url based on this.queryParameter
      let url = '/video?';
      for (const [parameter, metadata] of Object.entries(this.queryParameter)) {
        if (metadata.value !== metadata.default) {
          let encodedValue;
          if (metadata.type === 'moment') {
            encodedValue = encodeURI(metadata.value.unix());  // moment object to timestamp
          } else {
            encodedValue = encodeURI(String(metadata.value));
          }
          if (encodedValue === '') {
            // not allow empty encoded value
            continue;
          }
          url += `${parameter}=${encodedValue}&`;
        }
      }
      url = url.substring(0, url.length - 1);
      // update url
      this.$router.push(url);
      // go fetch video list
      this.fetchVideoList();  // TODO due to keepAlive: true we need this, remove this in the future
    },
    resetQueryParameters: function() {
      for (const parameter of Object.keys(this.queryParameter)) {
        this.queryParameter[parameter].value = this.queryParameter[parameter].default;
      }
    },
    onPagiChange: function (nextPnValue) {
      if (this.isLoadingVideoList) {
        return;
      }
      // assemble url based on this.$route.query, not this.queryParameter, ignore query rules (maybe) changed by user
      let url = '/video?';
      for (const [key, value] of Object.entries(this.$route.query).filter(entry => entry[0] !== 'pn')) {
        url += `${key}=${encodeURI(String(value))}&`;
      }
      url += `pn=${nextPnValue}`;  // only change pn
      // update url
      this.$router.push(url);
      // use new this.$route.query object, overwrite existed this.queryParameter and then this.fetchVideoList()
      this.init(this.$route.query);  // TODO due to keepAlive: true we need this, remove this in the future
    },
  },
  created() {
    this.init(this.$route.query);
  }
}
</script>

<style scoped>
.filter-table td {
  height: 40px;
}
.filter-table tr td:first-child {
  width: 80px;
  white-space: nowrap;
}
</style>
