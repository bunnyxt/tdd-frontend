<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "fetching_video_info_prompt": "正在获取{0}的视频信息...",
    "video_info_not_found_prompt": "没有找到{0}的视频信息",
    "video_not_tracked_prompt": "可能是因为该视频不在本站收录范围内",
    "data_selection": "数据选择",
    "recent_data": "近期数据",
    "last_3_days_hourly_data": "近三日每小时数据",
    "load_all": "加载全部",
    "refresh_data": "刷新数据",
    "data_total_already_loaded_prompt": "共{total}条，已加载{loaded}条",
    "compare_banner": "新功能！想对比多个视频的历史趋势？将此视频{add_to_compare_list}，前往{compare_tool}进行比较",
    "add_to_compare_list": "添加到对比列表",
    "compare_tool": "视频对比工具",
    "compare_banner_click_to": "点此",
    "compare_banner_click_to_add": "添加",
    "compare_banner_added_click_to": "已添加，点此",
    "compare_banner_added_click_to_remove": "移除"
  },
  "en": {
    "fetching_video_info_prompt": "Now fetching info of video {0}...",
    "video_info_not_found_prompt": "Info of video {0} not found.",
    "video_not_tracked_prompt": "It may be due to this video not satisfied the tracking requirements of this site.",
    "data_selection": "Data Selection",
    "recent_data": "Recent Data",
    "last_3_days_hourly_data": "Last 3 Days Hourly Data",
    "load_all": "Load All",
    "refresh_data": "Refresh",
    "data_total_already_loaded_prompt": "{total} records in total, {loaded} already loaded",
    "compare_banner": "New feature! Wanna compare trending between videos? {add_to_compare_list}, then go to {compare_tool} for comparison.",
    "add_to_compare_list": "Add this video to compare list",
    "compare_tool": "video compare tool",
    "compare_banner_click_to": "Click to ",
    "compare_banner_click_to_add": "add",
    "compare_banner_added_click_to": "Added, click to ",
    "compare_banner_added_click_to_remove": "remove"
  }
}
</i18n>

<template>
  <div>
    <div v-wechat-title="$route.meta.title=$t('page_title.video_detail', { title: fromBvid ? `BV${bvid}` : `av${aid}` })"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/video">{{ $t('page_name.video') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item v-if="fromBvid">BV{{ bvid }} - av{{ aid }}</a-breadcrumb-item>
        <a-breadcrumb-item v-else>av{{ aid }} - BV{{ bvid }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div v-if="isLoadingVideo">
      <div class="section-block">
        <a-spin :spinning="true">
          <i18n-t keypath="fetching_video_info_prompt" tag="label">
            <video-detail-video-id-link :aid="aid" :bvid="bvid" :from-bvid="fromBvid" />
          </i18n-t>
        </a-spin>
      </div>
    </div>
    <div v-else>
      <div v-if="!video || Object.keys(video).length === 0">
        <div class="section-block">
          <p>
            <i18n-t keypath="video_info_not_found_prompt" tag="label">
              <video-detail-video-id-link :aid="aid" :bvid="bvid" :from-bvid="fromBvid" />
            </i18n-t>
          </p>
          <p>{{ $t('video_not_tracked_prompt') }}</p>
          <a @click="$router.go(-1)">{{ $t('back_to_previous_page') }}</a>
        </div>
      </div>
      <div v-else>
        <div v-wechat-title="$route.meta.title=$t('page_title.video_detail', { title: video.title })"></div>
        <div class="section-block">
          <a-alert
            v-if="video.code !== 0 && video.code !== -403"
            type="error"
            :message="$t('video_detail.error_not_accessible_prompt', { code: video.code, message: $util.getVideoCodeMessage(video.code) })"
            style="margin-bottom: 12px;"
            banner
          />
          <a-alert
            v-if="video.code === -403"
            type="warning"
            :message="$t('video_detail.error_member_only_prompt')"
            style="margin-bottom: 12px;"
            banner
          />
          <a-alert
            v-if="video.state === -4"
            type="error"
            style="margin-bottom: 12px;"
            banner
          >
            <template #message>
              <i18n-t keypath="video_detail.error_duplicated_prompt" tag="label">
                <a :href="`/video/av${video.forward}`" target="_blank">av{{video.forward}}</a>
              </i18n-t>
            </template>
          </a-alert>
          <div v-if="$store.getters.clientMode === 'MOBILE'">
            <img
              :src="$util.httpS(video.pic)"
              alt="pic"
              width="100%"
              style="margin-bottom: 8px"
            >
          </div>
          <div v-else>
            <img
              :src="$util.httpS(video.pic)"
              alt="pic"
              width="250px"
              style="float: right"
            >
          </div>
          <div :style="titleDivStyle">
            <h3 style="margin-bottom: 14px">{{ video.title }}</h3>
            <div style="overflow: hidden">
              <div style="float: left; margin-right: 20px; margin-bottom: 12px">
                <a-avatar
                  size="small"
                  :src="video.member
                        ? $util.httpS(video.member.face)
                        : 'https://static.hdslb.com/images/member/noface.gif'"
                  style="margin-right:12px"
                />
                <a @click="videoMemberNameClickHandler(video.mid)">
                  {{ video.member ? video.member.name : 'mid_'+video.mid}}
                </a>
              </div>
              <div v-if="video.hasstaff === 1" style="float: left; margin-bottom: 12px">
                <a-dropdown :trigger="['click']" placement="bottomCenter">
                  <a class="ant-dropdown-link" href="#">{{ $t('video_detail.staff') }} ({{ video.staff.length }}) <down-outlined /> </a>
                  <template #overlay>
                    <a-menu>
                      <template v-for="staff in video.staff.filter( s => s.title === 'UP主')" :key="staff.mid">
                        <a-menu-item>
                          <a @click="videoMemberNameClickHandler(staff.mid)">
                            <a-avatar size="small" :src="$util.httpS(staff.face)" style="margin-right: 8px" />
                            {{ staff.name }}<a-tag :color="$util.getStaffTitleColor(staff.title)" style="margin-left: 8px">{{ staff.title }}</a-tag>
                          </a>
                        </a-menu-item>
                      </template>
                      <template v-for="staff in video.staff.filter( s => s.title !== 'UP主')" :key="staff.mid">
                        <a-menu-item>
                          <a @click="videoMemberNameClickHandler(staff.mid)">
                            <a-avatar size="small" :src="$util.httpS(staff.face)" style="margin-right: 8px" />
                            {{ staff.name }}<a-tag :color="$util.getStaffTitleColor(staff.title)" style="margin-left: 8px">{{ staff.title }}</a-tag>
                          </a>
                        </a-menu-item>
                      </template>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </div>
            <p><calendar-outlined style="margin-right: 12px"/>{{ $util.tsToDateString(video.pubdate) }}</p>
            <p><database-outlined style="margin-right: 12px"/>{{ video.tname }}</p>
            <template v-if="$config.enableVideoAttributeFlags && videoAttributeFlags.length > 0 && $store.state.isUserLoggedIn">
              <p>
                <flag-outlined style="margin-right: 12px" />
                <a-tag
                  v-for="flag in videoAttributeFlags"
                  :key="flag.name"
                  color="red"
                  style="margin-bottom: 4px; cursor: pointer"
                >
                  <a-popover>
                    <template #content>
                      {{ flag.message }}
                    </template>
                    {{ flag.name }}
                  </a-popover>
                </a-tag>
                <a-tag
                  color="red"
                  style="margin-bottom: 4px; cursor: pointer"
                >
                  <a-popover>
                    <template #content>
                      {{ $t('video_detail.attribute_prompt') }}<br/>
                      <i18n-t keypath="video_detail.attribute_reference" tag="label" for="video_detail.attribute_reference_here">
                        <a href="https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/video/info.md#获取视频详细信息web端" target="_blank">{{ $t('video_detail.attribute_reference_here') }}</a>
                      </i18n-t>
                    </template>
                    <question-circle-outlined />
                  </a-popover>
                </a-tag>
              </p>
            </template>
            <tdd-video-action-bar :aid="aid" />
            <tdd-moe-girl-wiki-widget v-if="$config.enableMoegirlWikiWidget" type="video" url="https://zh.moegirl.org.cn/普通DISCO" style="margin-bottom: 12px" />
            <div style="margin-bottom: 12px">
              <a-tag v-for="tag in $util.getTagList(video)" :key="tag.title" :color="tag.color" style="margin-bottom: 4px">{{ tag.title }}</a-tag>
              <a-tag>{{ video.videos }}P</a-tag>
            </div>
          </div>
          <a-divider orientation="left">{{ $t('video_detail.introduction') }}</a-divider>
          <tdd-video-description :description="video.desc" />
          <a-divider orientation="left">{{ $t('video_detail.tags') }}</a-divider>
          <a-tag
            v-for="tag in video.tags
                   ? video.tags.split(';').slice(0, -1)
                   : []"
            :key="tag"
            style="margin-bottom: 4px"
          >
            {{ tag }}
          </a-tag>
          <a-divider orientation="left">{{ $t('video_detail.data' )}}</a-divider>
          <tdd-video-data-block
            v-if="video.laststat"
            :stat="video.laststat"
            :size="this.$store.getters.clientMode === 'MOBILE' ? 'middle' : 'large'"
            :bvid="bvid"
          />
          <a-alert v-else type="error" :message="$t('video_detail.no_data')" />
        </div>
        <div class="section-separator"></div>
        <div class="section-block">
          <div v-if="isLoadingCurrentVideoRecordsBrief">
            <a-spin :spinning="true">
              正在获取<video-detail-video-id-link :aid="aid" :bvid="bvid" :from-bvid="fromBvid" />的历史数据
            </a-spin>
          </div>
          <div v-else>
            <div v-if="videoRecords.length === 0">
              <a-alert banner>
                没有找到<video-detail-video-id-link :aid="aid" :bvid="bvid" :from-bvid="fromBvid" />的历史数据
              </a-alert>
            </div>
            <div v-else>
              <a-spin :spinning="isLoadingVideoRecords">
                <div style="margin-bottom: 16px; display: flex">
                  <a-menu
                    v-model="currentDataCategory"
                    mode="horizontal"
                    :style="{ width: `calc(100% - ${$store.getters.clientMode === 'MOBILE' ? 46 : 122}px)` }"
                  >
                    <a-menu-item key="recordChart"> <line-chart-outlined />{{ $t('video_detail.history_trending') }} </a-menu-item>
                    <a-menu-item key="recordTable"> <table-outlined />{{ $t('video_detail.detailed_data') }} </a-menu-item>
                    <a-menu-item key="zkCalc"> <calculator-outlined />{{ $t('video_detail.zk_calc') }} </a-menu-item>
                    <a-menu-item key="recordSaver"> <download-outlined />{{ $t('video_detail.data_download') }} </a-menu-item>
                  </a-menu>
                  <div style="margin-top: 8px; padding-left: 12px; border-bottom: 1px solid #e8e8e8">
                    <a-popover placement="bottomRight" trigger="click">
                      <a-button>
                        <filter-outlined /> {{ $store.getters.clientMode === 'MOBILE' ? '' : $t('data_selection') }}
                      </a-button>
                      <template #content>
                        <div>
                          <a-spin :spinning="isLoadingVideoRecords">
                            <div style="margin-bottom: 12px">
                              <a-checkbox
                                v-model="enableCurrentVideoRecords"
                                @change="enableCurrentVideoRecordsCheckboxChangeHandler"
                                style="margin-bottom: 4px"
                              >{{ $t('recent_data') }}</a-checkbox>
                              <div style="margin-bottom: 4px">
                                {{ $t('data_total_already_loaded_prompt', { total: currentVideoRecordsTotalCount, loaded: currentVideoRecords.length }) }}
                              </div>
                              <div>
                                <a-button
                                  type="link"
                                  size="small"
                                  :disabled="currentVideoRecordsTotalLoaded"
                                  @click="getCurrentVideoRecordsTotal(aid)"
                                >{{ $t('load_all') }}</a-button>
                                <a-button
                                  type="link"
                                  size="small"
                                  @click="updateCurrentVideoRecords(aid)"
                                >{{ $t('refresh_data') }}</a-button>
                              </div>
                            </div>
                            <div>
                              <a-checkbox
                                v-model="enableHourlyVideoRecords"
                                :disabled="hourlyVideoRecords.length === 0"
                                @change="enableHistoryVideoRecordsCheckboxChangeHandler"
                                style="margin-bottom: 4px"
                              >{{ $t('last_3_days_hourly_data') }}</a-checkbox>
                              <div v-if="hourlyVideoRecords.length > 0" style="margin-bottom: 4px">
                                {{ $t('data_total_already_loaded_prompt', { total: hourlyVideoRecords.length, loaded: hourlyVideoRecords.length }) }}
                              </div>
                              <div>
                                <a-button
                                  type="link"
                                  size="small"
                                  :disabled="hourlyVideoRecords.length !== 0"
                                  @click="getHistoryVideoRecords(aid)"
                                >{{ $t('load_all') }}</a-button>
                                <a-button
                                  type="link"
                                  size="small"
                                  :disabled="hourlyVideoRecords.length === 0"
                                  @click="getHistoryVideoRecords(aid)"
                                >{{ $t('refresh_data') }}</a-button>
                              </div>
                            </div>
                          </a-spin>
                        </div>
                      </template>
                    </a-popover>
                  </div>
                </div>
                <div v-show="currentDataCategory.indexOf('recordChart') !== -1">
                  <template v-if="recordChartEnterCount">
                    <a-alert type="info" banner style="margin-bottom: 12px" closable>
                      <template #message>
                        <i18n-t keypath="compare_banner">
                          <a-popover place="add_to_compare_list" placement="bottom">
                            <template #content>
                              <template v-if="inVideoCompareList">
                                {{ $t('compare_banner_added_click_to') }}<a @click="removeFromVideoCompareListHandler">{{ $t('compare_banner_added_click_to_remove') }}</a>
                              </template>
                              <template v-else>
                                {{ $t('compare_banner_click_to') }}<a @click="addToVideoCompareListHandler">{{ $t('compare_banner_click_to_add') }}</a>
                              </template>
                            </template>
                            <a>{{ $t('add_to_compare_list') }}</a>
                          </a-popover>
                          <router-link place="compare_tool" to="/tool/compare">{{ $t('compare_tool') }}</router-link>
                        </i18n-t>
                      </template>
                    </a-alert>
                    <tdd-video-history-line-chart :videoRecords="videoRecords" :pubdate="video ? video.pubdate : 0" />
                  </template>
                </div>
                <div v-show="currentDataCategory.indexOf('recordTable') !== -1">
                  <video-detail-history-table :video-records="videoRecords" />
                </div>
                <div v-show="currentDataCategory.indexOf('zkCalc') !== -1">
                  <tdd-video-record-zk-calc :video-records="videoRecords" :page="video ? video.videos : 1" :pubdate="video ? video.pubdate : null" />
                </div>
                <div v-show="currentDataCategory.indexOf('recordSaver') !== -1">
                  <tdd-video-record-saver :video-records="videoRecords" />
                </div>
              </a-spin>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoDetailHistoryTable from "./VideoDetailHistoryTable";
import TddVideoRecordSaver from "../../common/TddVideoRecordSaver";
import TddVideoRecordZkCalc from "../../common/TddVideoRecordZkCalc";
import TddVideoDescription from "../../common/TddVideoDescription";
import TddVideoActionBar from "../../common/TddVideoActionBar";
import TddVideoDataBlock from "@/components/common/TddVideoDataBlock";
import TddVideoHistoryLineChart from "@/components/chart/TddVideoHistoryLineChart";
import TddMoeGirlWikiWidget from "@/components/common/TddMoeGirlWikiWidget";
import VideoDetailVideoIdLink from "@/components/page/video/VideoDetailVideoIdLink";
import { DownOutlined, CalendarOutlined, DatabaseOutlined, FlagOutlined, QuestionCircleOutlined, LineChartOutlined, TableOutlined, CalculatorOutlined, DownloadOutlined, FilterOutlined } from "@ant-design/icons-vue";

export default {
  name: 'VideoDetail',
  components: {
    VideoDetailHistoryTable,
    TddVideoRecordSaver,
    TddVideoRecordZkCalc,
    TddVideoDescription,
    TddVideoActionBar,
    TddVideoDataBlock,
    TddVideoHistoryLineChart,
    TddMoeGirlWikiWidget,
    VideoDetailVideoIdLink,
    DownOutlined,
    CalendarOutlined,
    DatabaseOutlined,
    FlagOutlined,
    QuestionCircleOutlined,
    LineChartOutlined,
    TableOutlined,
    CalculatorOutlined,
    DownloadOutlined,
    FilterOutlined,
  },
  data: function() {
    return {
      video: null,
      isLoadingVideo: false,
      // video records related
      // currentVideoRecords
      currentVideoRecords: [],
      isLoadingCurrentVideoRecordsBrief: false,
      currentVideoRecordsTotalCount: 0,
      isLoadingCurrentVideoRecordsTotal: false,
      currentVideoRecordsTotalLoaded: false,
      enableCurrentVideoRecords: true,
      // hourlyVideoRecords
      hourlyVideoRecords: [],
      isLoadingHourlyVideoRecords: false,
      enableHourlyVideoRecords: true,
      // video records related end
      currentDataCategory: ['recordChart'],
      recordChartEnterCount: 1,
      // video compare list related
      inVideoCompareList: false,
    }
  },
  computed: {
    videoRecords: function () {
      let records = [];
      if (this.enableCurrentVideoRecords) {
        records = records.concat(this.currentVideoRecords);
      }
      if (this.enableHourlyVideoRecords) {
        const addedList = records.map(record => record.added);
        this.hourlyVideoRecords.forEach(record => {
          if (!addedList.includes(record.added)) {
            records.push(record);
          }
        });
      }
      return records.sort((a, b) => a.added - b.added);
    },
    isLoadingVideoRecords: function () {
      return this.isLoadingCurrentVideoRecordsBrief
        || this.isLoadingCurrentVideoRecordsTotal
        || this.isLoadingHourlyVideoRecords;
    },
    fromBvid: function () {
      return !!this.$route.params.bvid;
    },
    aid: function() {
      if (this.fromBvid) {
        return parseInt(this.$util.b2a(this.$route.params.bvid));
      } else {
        return parseInt(this.$route.params.aid);
      }
    },
    bvid: function () {
      return this.$util.a2b(this.aid);
    },
    titleDivStyle: function () {
      let style = {};
      if (this.$store.getters.clientMode !== 'MOBILE') {
        style['float'] = 'left';
        style['width'] = 'calc(100% - 250px - 12px)';
      }
      return style;
    },
    _clientMode: function () {
      return this.$store.getters.clientMode;
    },
    videoAttributeFlags: function () {
      if (this.video && this.video.attribute) {
        return this.$util.getVideoAttributeFlags(this.video.attribute);
      } else {
        return [];
      }
    },
  },
  watch: {
    aid: function(newAid) {
      this.getVideoInfo(newAid);
      this.initCurrentVideoRecords(newAid);
      this.getHistoryVideoRecords(newAid);
      this.addVisitHistoryVideo(newAid);
      this.initVideoCompareListRelated(newAid);
    },
    videoRecords: function() {

    },
    currentDataCategory: function () {
      if (this.currentDataCategory.indexOf('recordChart') !== -1) {
        this.recordChartEnterCount++;
      }
    },
    _clientMode: function () {
      this.recordChartEnterCount = 0;
      if (this.currentDataCategory.indexOf('recordChart') !== -1) {
        this.recordChartEnterCount++;
      }
    }
  },
  methods: {
    addVisitHistoryVideo: function (bvid) {
      // TODO make bvid version
      // let that = this;
      console.log(bvid);
      // this.$axios.post('/visit/history/video/BV' + bvid)
      //   .then(function (response) {
      //     if (!response) {
      //       console.log(response);
      //     }
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   })
      //   .finally(function () {
      //
      //   });
    },
    getVideoInfo: function(aid, checkVideoFromStore=false) {
      this.isLoadingVideo = true;

      // check video from store
      let videoLoadedFromStore = false;
      if (checkVideoFromStore) {
        let video = this.$store.state.videoDetailVideo;
        if (video && video.aid === aid) {
          this.video = video;
          // this.$store.commit('setVideoDetailVideo', null);
          videoLoadedFromStore = true;
          this.isLoadingVideo = false;
        }
      }

      let that = this;
      if (!videoLoadedFromStore) {
        this.$axios.get('video/' + aid)
          .then(function (response) {
            that.video = response.data;
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            that.isLoadingVideo = false;
          });
      }
    },
    initCurrentVideoRecords: function (aid) {
      this.isLoadingCurrentVideoRecordsBrief = true;
      
      const that = this;
      this.$axios.get(`video/${aid}/record?last_count=1000`)
        .then(function (response) {
          that.currentVideoRecords = response.data;
          that.currentVideoRecordsTotalCount = response.headers['x-total-count'];
          that.currentVideoRecordsTotalLoaded = that.currentVideoRecordsTotalCount <= 1000;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingCurrentVideoRecordsBrief = false;
        });
    },
    getCurrentVideoRecordsTotal: function (aid) {
      this.isLoadingCurrentVideoRecordsTotal = true;
      this.$service.reportInteraction('video_detail_get_current_video_records_total',
        JSON.stringify({ aid }));
      
      const that = this;
      this.$axios.get(`video/${aid}/record`)
        .then(function (response) {
          that.currentVideoRecords = response.data;
          that.currentVideoRecordsTotalCount = response.headers['x-total-count'];
          that.currentVideoRecordsTotalLoaded = true;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingCurrentVideoRecordsTotal = false;
        });
    },
    updateCurrentVideoRecords: function (aid) {
      this.isLoadingCurrentVideoRecordsTotal = true;
      this.$service.reportInteraction('video_detail_update_current_video_records',
        JSON.stringify({ aid, total: this.currentVideoRecordsTotalLoaded }));
      
      const that = this;
      const url = this.currentVideoRecordsTotalLoaded ? `video/${aid}/record` : `video/${aid}/record?last_count=1000`;
      this.$axios.get(url)
        .then(function (response) {
          that.currentVideoRecords = response.data;
          that.currentVideoRecordsTotalCount = response.headers['x-total-count'];
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingCurrentVideoRecordsTotal = false;
        });
    },
    getHistoryVideoRecords: function (aid) {
      this.isLoadingHourlyVideoRecords = true;
      if (this.hourlyVideoRecords.length > 0) {
        this.$service.reportInteraction('video_detail_update_history_video_records',
          JSON.stringify({ aid }));
      }
      
      const that = this;
      this.$axios.get(`video/${aid}/record/hourly`)
        .then(function (response) {
          that.hourlyVideoRecords = response.data.map(record => ({
            ...record,
            id: -record.added,  // add unique id
            aid: aid,  // add aid
          }));
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingHourlyVideoRecords = false;
        });
    },
    videoMemberNameClickHandler: function (mid) {
      this.$router.push('/member/' + mid);
    },
    addToVideoCompareListHandler: function () {
      const videoCompareListString = localStorage.getItem('videoCompareList') || '[]';
      const videoCompareList = JSON.parse(videoCompareListString);
      const newVideo = {
        aid: this.aid,
        video: this.video,
        // records: [],
        records: this.videoRecords.slice(-200),
        config: {
          title: `av${this.aid}`,
          props: ['view'],
        },
      }
      const newVideoCompareList = [...videoCompareList.filter(video => video.aid !== newVideo.aid), newVideo];
      localStorage.setItem('videoCompareList', JSON.stringify(newVideoCompareList));
      this.inVideoCompareList = true;
      this.$service.reportInteraction('video_add_to_compare_list', JSON.stringify({ aid: this.aid }));
    },
    removeFromVideoCompareListHandler: function () {
      const videoCompareListString = localStorage.getItem('videoCompareList') || '[]';
      const videoCompareList = JSON.parse(videoCompareListString);
      const newVideoCompareList = videoCompareList.filter(video => video.aid !== this.aid);
      localStorage.setItem('videoCompareList', JSON.stringify(newVideoCompareList));
      this.inVideoCompareList = false;
    },
    initVideoCompareListRelated: function (aid) {
      const videoCompareListString = localStorage.getItem('videoCompareList');
      if (videoCompareListString) {
        const videoCompareList = JSON.parse(videoCompareListString);
        this.inVideoCompareList = !!videoCompareList.find(x => x.aid === aid);
      } else {
        localStorage.setItem('videoCompareList', '[]');
        this.inVideoCompareList = false;
      }
    },
    enableCurrentVideoRecordsCheckboxChangeHandler: function () {
      if (this.videoRecords.length === 0) {
        this.enableCurrentVideoRecords = true;
      } else {
        this.$service.reportInteraction('video_detail_change_current_video_records_checkbox',
          JSON.stringify({ aid: this.aid, to: this.enableCurrentVideoRecords }));
      }
    },
    enableHistoryVideoRecordsCheckboxChangeHandler: function () {
      if (this.videoRecords.length === 0) {
        this.enableHourlyVideoRecords = true;
      } else {
        this.$service.reportInteraction('video_detail_change_hourly_video_records_checkbox',
          JSON.stringify({ aid: this.aid, to: this.enableHourlyVideoRecords }));
      }
    },
  },
  created: function() {
    this.getVideoInfo(this.aid, true);
    this.initCurrentVideoRecords(this.aid);
    this.getHistoryVideoRecords(this.aid);
    this.addVisitHistoryVideo(this.aid);
    this.initVideoCompareListRelated(this.aid);
  },
  mounted: function () {

  }
}
</script>

<style scoped>
.stat-item {
  white-space: nowrap;
}
.stat-item-icon {
  margin-right: 8px;
}
</style>
