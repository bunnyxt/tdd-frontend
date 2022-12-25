<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "page_intro_video": "天钿Daily收录B站{0}分区下的所有视频和部分其他分区中的VC视频。",
    "update_interval_alert": "播放、收藏等数据并非时时数据，最低每24小时更新一次",
    "click_to_view_detailed_info": "点击视频查看详细信息",
    "pagi_total": "共 {total} 个视频",
    "filter": {
      "video_category": {
        "label": "视频分类",
        "all": "全部",
        "vc_only": "仅VC"
      },
      "activity": {
        "label": "活跃程度",
        "all": "所有视频",
        "active": "活跃视频",
        "hot": "热门视频",
        "others": "其他视频"
      },
      "recent": {
        "label": "最近投稿",
        "all": "所有视频",
        "this_week": "本周新作",
        "today": "本日新作",
        "others": "其他视频"
      },
      "sort_by": {
        "label": "排序依据"
      },
      "sort_order": {
        "label": "排序顺序",
        "asc": "从小到大",
        "desc": "从大到小"
      },
      "pubdate": {
        "label": "投稿时间",
        "quick_select": {
          "label": "快速选择",
          "custom": "自定义",
          "day": "本日",
          "week": "本周",
          "month": "本月",
          "year": "本年",
          "last_day": "近一日",
          "last_week": "近一周",
          "last_month": "近一月",
          "last_year": "近一年"
        }
      },
      "title": {
        "label": "视频标题"
      },
      "member_name": {
        "label": "UP主昵称"
      }
    },
    "reset_confirm": "确定重置所有条件？"
  },
  "en": {
    "page_intro_video": "TianDian Daily tracks all videos under Bilibili {0} category and some VC related videos in other categories.",
    "update_interval_alert": "All data including view, favorite etc. may not up-to-date. They will be updated at least once per 24 hours.",
    "click_to_view_detailed_info": "Click to view detailed info of video.",
    "pagi_total": "{total} videos in total",
    "filter": {
      "video_category": {
        "label": "Video Category",
        "all": "All",
        "vc_only": "VC Only"
      },
      "activity": {
        "label": "Active Status",
        "all": "All",
        "active": "Active",
        "hot": "Hot",
        "others": "Others"
      },
      "recent": {
        "label": "Recent Publish",
        "all": "All",
        "this_week": "This Week",
        "today": "Today",
        "others": "Others"
      },
      "sort_by": {
        "label": "Sort By"
      },
      "sort_order": {
        "label": "Sort Order",
        "asc": "Asc",
        "desc": "Desc"
      },
      "pubdate": {
        "label": "Publish Date",
        "quick_select": {
          "label": "Quick Select",
          "custom": "Custom",
          "day": "Today",
          "week": "This Week",
          "month": "This Month",
          "year": "This Year",
          "last_day": "Last Day",
          "last_week": "Last Week",
          "last_month": "Last Month",
          "last_year": "Last Year"
        }
      },
      "title": {
        "label": "Video Title"
      },
      "member_name": {
        "label": "Uploader Name"
      }
    },
    "reset_confirm": "Reset all search filters?"
  }
}
</i18n>

<template>
  <div>
    <div v-wechat-title="$t('page_title.video')"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('page_name.video') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>{{ $t('page_name.video') }}</h1>
      <p>
        <i18n-t keypath="page_intro_video" tag="label">
          <a href="https://www.bilibili.com/v/music/vocaloid/" target="_blank">VOCALOID·UTAU</a>
        </i18n-t>
      </p>
      <a-alert style="margin-bottom: 8px" :message="$t('update_interval_alert')" banner />
      <a-alert style="margin-bottom: 8px" :message="$t('click_to_view_detailed_info')" banner type="info"/>
      <div style="display: flex">
        <tdd-video-abid-auto-complete v-model="jumpVideoTargetIdObj" />
        <a-button
          type="primary"
          :disabled="typeof jumpVideoTargetIdObj.id === 'string' ? jumpVideoTargetIdObj.id.length === 0 : true"
          @click="goJumpVideo"
          style="margin-left: 8px"
        >{{ $t('go_jump') }}</a-button>
      </div>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <a-collapse :activeKey="[1]" style="margin-bottom: 8px">
        <a-collapse-panel :header="$t('search_filter')" key="1">
          <table class="filter-table">
            <tr>
              <td>{{ $t('filter.video_category.label') }}</td>
              <td>
                <a-radio-group name="queryParameterVcRadioGroup" v-model:value="queryParameter.vc.value">
                  <a-radio value="0">{{ $t('filter.video_category.all') }}</a-radio>
                  <a-radio value="1">{{ $t('filter.video_category.vc_only') }}</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td>{{ $t('filter.activity.label') }}</td>
              <td>
                <a-radio-group name="queryParameterActivityRadioGroup" v-model:value="queryParameter.activity.value">
                  <a-radio value="-1">{{ $t('filter.activity.all') }}</a-radio>
                  <a-radio value="1">{{ $t('filter.activity.active') }}</a-radio>
                  <a-radio value="2">{{ $t('filter.activity.hot') }}</a-radio>
                  <a-radio value="0">{{ $t('filter.activity.others') }}</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td>{{ $t('filter.recent.label') }}</td>
              <td>
                <a-radio-group name="queryParameterRecentRadioGroup" v-model:value="queryParameter.recent.value">
                  <a-radio value="-1">{{ $t('filter.recent.all') }}</a-radio>
                  <a-radio value="1">{{ $t('filter.recent.this_week') }}</a-radio>
                  <a-radio value="2">{{ $t('filter.recent.today') }}</a-radio>
                  <a-radio value="0">{{ $t('filter.recent.others') }}</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td>{{ $t('filter.sort_by.label') }}</td>
              <td>
                <a-radio-group name="queryParameterOrderByRadioGroup" v-model:value="queryParameter.order_by.value">
                  <a-radio value="pubdate">{{ $t('pubdate') }}</a-radio>
                  <a-radio value="view">{{ $t('view') }}</a-radio>
                  <a-radio value="danmaku">{{ $t('danmaku') }}</a-radio>
                  <a-radio value="reply">{{ $t('reply') }}</a-radio>
                  <a-radio value="favorite">{{ $t('favorite') }}</a-radio>
                  <a-radio value="coin">{{ $t('coin') }}</a-radio>
                  <a-radio value="share">{{ $t('share') }}</a-radio>
                  <a-radio value="like">{{ $t('like') }}</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td>{{ $t('filter.sort_order.label') }}</td>
              <td>
                <a-radio-group name="queryParameterDescRadioGroup" v-model:value="queryParameter.desc.value">
                  <a-radio value="0">{{ $t('filter.sort_order.asc') }}</a-radio>
                  <a-radio value="1">{{ $t('filter.sort_order.desc') }}</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td>{{ $t('filter.pubdate.label') }}</td>
              <td>
                <a-date-picker
                  :disabledDate="disabledStartDate"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  :placeholder="$t('start')"
                  v-model:value="queryParameter.start_ts.value"
                  @change="handlePubdateStartChange"
                  @openChange="handlePubdateStartOpenChange"
                />
                ~
                <a-date-picker
                  :disabledDate="disabledEndDate"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  :placeholder="$t('end')"
                  v-model:value="queryParameter.end_ts.value"
                  :open="pubdateEndOpen"
                  @change="handlePubdateEndChange"
                  @openChange="handlePubdateEndOpenChange"
                  style="margin-right: 8px"
                />
                <a-select
                  :style="{ width: $store.getters.i18nLocale === 'en' ? '120px' : '100px' }"
                  :placeholder="$t('filter.pubdate.quick_select.label')"
                  v-model:value="pubdateSelectValue"
                  @change="handlePubdateSelectChange">
                  <a-select-option value="custom">{{ $t("filter.pubdate.quick_select.custom") }}</a-select-option>
                  <a-select-option value="day">{{ $t("filter.pubdate.quick_select.day") }}</a-select-option>
                  <a-select-option value="week">{{ $t("filter.pubdate.quick_select.week") }}</a-select-option>
                  <a-select-option value="month">{{ $t("filter.pubdate.quick_select.month") }}</a-select-option>
                  <a-select-option value="year">{{ $t("filter.pubdate.quick_select.year") }}</a-select-option>
                  <a-select-option value="last_day">{{ $t("filter.pubdate.quick_select.last_day") }}</a-select-option>
                  <a-select-option value="last_week">{{ $t("filter.pubdate.quick_select.last_week") }}</a-select-option>
                  <a-select-option value="last_month">{{ $t("filter.pubdate.quick_select.last_month") }}</a-select-option>
                  <a-select-option value="last_year">{{ $t("filter.pubdate.quick_select.last_year") }}</a-select-option>
                </a-select>
              </td>
            </tr>
            <tr>
              <td>{{ $t('filter.title.label') }}</td>
              <td>
                <a-input v-model:value="queryParameter.title.value" :placeholder="$t('filter.title.label')" allowClear />
              </td>
            </tr>
            <tr>
              <td>{{ $t('filter.member_name.label') }}</td>
              <td>
                <a-input v-model:value="queryParameter.up_name.value" :placeholder="$t('filter.member_name.label')" allowClear />
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
            {{ $t('search') }}
          </a-button>
          <a-popconfirm
            :title="$t('reset_confirm')"
            @confirm="resetQueryParameters"
            :okText="$t('ok')"
            :cancelText="$t('cancel')"
          >
            <a-button icon="reload" style="margin-top: 8px; margin-left: 16px">{{ $t('reset') }}</a-button>
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
            v-model:current="queryParameter.pn.value"
            :total="videoTotalCount"
            :showTotal="total => $t('pagi_total', { total })"
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
  padding-right: 16px;
}
</style>
