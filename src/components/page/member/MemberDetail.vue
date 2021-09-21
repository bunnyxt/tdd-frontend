<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "fetching_member_info_prompt": "正在获取用户{0}的信息...",
    "member_info_not_found_prompt": "没有找到用户{0}的信息",
    "member_not_tracked_prompt": "可能是因为该用户的视频投稿不在本站收录范围内",
    "statistics_summary": "数据总计",
    "info_history": "信息变更",
    "fetching_member_info_history_prompt": "正在获取用户{0}的个人信息变更历史数据...",
    "member_info_history_prompt": "UP主信息不定时更新；若您是本UP主且不希望自己的历史信息变更记录被公开，请{0}",
    "contact_admin": "联系站长",
    "member_info_history_visibility_prompt": "历史信息变更记录仅{0}后可见哦~",
    "followers_trending": "粉丝趋势",
    "statistics_summary_trending": "数据总计趋势",
    "fetching_member_follower_history_prompt": "正在获取用户{0}的历史粉丝数据...",
    "fetching_member_statistics_summary_history_prompt": "正在获取用户{0}的历史数据总计数据...",
    "pagi_total": "共 {total} 个视频",
    "filter": {
      "sort_by": {
        "label": "排序依据"
      },
      "sort_order": {
        "label": "排序顺序",
        "asc": "从小到大",
        "desc": "从大到小"
      }
    },
    "reset_confirm": "确定重置所有条件？"
  },
  "en": {
    "fetching_member_info_prompt": "Now fetching info of member {0}...",
    "member_info_not_found_prompt": "Info of member {0} not found.",
    "member_not_tracked_prompt": "It may be due to this member's videos not satisfied the tracking requirements of this site.",
    "statistics_summary": "Statistics Summary",
    "info_history": "Info History",
    "fetching_member_info_history_prompt": "Now fetching info history of member {0}...",
    "member_info_history_prompt": "Uploader Info updated from time to time. If you are the uploader and do not want these info be public, please {0}.",
    "contact_admin": "contact admin",
    "member_info_history_visibility_prompt": "Info history only available after {0}.",
    "followers_trending": "Followers Trending",
    "statistics_summary_trending": "Statistics Summary Trending",
    "fetching_member_follower_history_prompt": "Now fetching follower history of member {0}...",
    "fetching_member_statistics_summary_history_prompt": "Now fetching statistics summary history of member {0}...",
    "pagi_total": "{total} videos in total",
    "filter": {
      "sort_by": {
        "label": "Sort By"
      },
      "sort_order": {
        "label": "Sort Order",
        "asc": "Asc",
        "desc": "Desc"
      }
    },
    "reset_confirm": "Reset all search filters?"
  }
}
</i18n>

<template>
  <div>
    <div v-wechat-title="$route.meta.title=$t('page_title.member_detail', { name: `mid_${this.$route.params.mid}` })"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/member">{{ $t('page_name.member') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ this.$route.params.mid }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div v-if="isLoadingMember">
      <div class="section-block">
        <a-spin :spinning="true">
          <i18n path="fetching_member_info_prompt" tag="label">
            <a :href="'https://space.bilibili.com/' + this.$route.params.mid" target="_blank">{{ 'mid_'+this.$route.params.mid }}</a>
          </i18n>
        </a-spin>
      </div>
    </div>
    <div v-else>
      <div v-if="!member || Object.keys(member).length === 0">
        <div class="section-block">
          <i18n path="member_info_not_found_prompt" tag="label">
            <a :href="'https://space.bilibili.com/' + this.$route.params.mid" target="_blank">{{ 'mid_'+this.$route.params.mid }}</a>
          </i18n>
          <p>{{ $t('member_not_tracked_prompt') }}</p>
          <a @click="$router.go(-1)">{{ $t('back_to_previous_page') }}</a>
        </div>
      </div>
      <div v-else>
        <div v-wechat-title="$route.meta.title=$t('page_title.member_detail', { name: member.name })"></div>
        <div class="section-block">
          <div class="tdd-member-detail-header">
            <a-avatar
              class="tdd-member-detail-header-avatar"
              :src="member.face ? $util.httpS(member.face) : 'https://static.hdslb.com/images/member/noface.gif'"
              :size="48"
            />
            <div class="tdd-member-detail-header-content">
              <div class="tdd-member-detail-header-title">
                <span style="font-size: 1.17em; color: rgba(0, 0, 0, 0.85); font-weight: 500">{{ member.name }}</span>
                <template v-if="member.sex === '男'">
                  <span class="tdd-member-detail-header-title-sex" style="color: #00b5f6">
                    <icon-font type="icon-xingbie-nan" />
                  </span>
                </template>
                <template v-else-if="member.sex === '女'">
                  <span class="tdd-member-detail-header-title-sex" style="color: #f9a9f8">
                    <icon-font type="icon-xingbie-nv" />
                  </span>
                </template>
                <template v-else-if="member.sex === '保密'">
                  <span class="tdd-member-detail-header-title-sex" style="color: rgba(183,183,183,0.95)">
                    <icon-font type="icon-xingbie-weizhi" />
                  </span>
                </template>
              </div>
              <div class="tdd-member-detail-header-video-count-follower">
                <a-icon type="video-camera" class="stat-item-icon" style="margin-right: 4px" />
                {{ member.video_count.toLocaleString() }}
                <a-icon type="team" class="stat-item-icon" style="margin-left: 12px; margin-right: 4px" />
                {{ member.last_follower ? member.last_follower.follower.toLocaleString() : -1 }}
              </div>
            </div>
          </div>
          <div style="margin-top: 8px">
            <p>{{ member.sign }}</p>
            <tdd-member-action-bar :mid="mid" />
          </div>
          <a-menu v-model="currentInfoCategory" mode="horizontal" style="margin-bottom: 16px">
            <a-menu-item key="overview"> <a-icon type="line-chart" />{{ $t('statistics_summary') }} </a-menu-item>
            <a-menu-item key="history"> <a-icon type="history" />{{ $t('info_history') }} </a-menu-item>
          </a-menu>
          <div v-show="currentInfoCategory.indexOf('overview') !== -1">
            <tdd-video-stat-bar :stat="member.last_total_stat" :mode="'vertical'" :show-name="true" />
            *{{ $util.tsToDateString(member.last_total_stat.added) }}{{ $t('updated_suffix') }}
          </div>
          <div v-show="currentInfoCategory.indexOf('history') !== -1">
            <div v-if="isLoadingMemberLogs">
              <a-spin :spinning="true">
                <i18n path="fetching_member_info_history_prompt" tag="label">
                  <a :href="'https://space.bilibili.com/' + this.$route.params.mid" target="_blank">{{ 'mid_'+this.$route.params.mid }}</a>
                </i18n>
              </a-spin>
            </div>
            <div v-else>
              <template v-if="$store.state.isUserLoggedIn">
                <a-alert type="warning" banner closable style="margin-bottom: 16px">
                  <template slot="message">
                    <i18n path="member_info_history_prompt" tag="label">
                      <router-link to="/about/contactus">{{ $t('contact_admin') }}</router-link>
                    </i18n>
                  </template>
                </a-alert>
                <tdd-member-log-table :member-logs="memberLogs" />
              </template>
              <template v-else>
                <a-alert type="error" banner>
                  <template slot="message">
                    <i18n path="member_info_history_visibility_prompt" tag="label">
                      <a @click="() => this.$store.commit('changeLoginSliderVisibility')">{{ $t('login') }}</a>
                    </i18n>
                  </template>
                </a-alert>
              </template>
            </div>
          </div>
        </div>
        <div class="section-separator"></div>
        <div class="section-block">
          <a-menu v-model="currentDataCategory" mode="horizontal" style="margin-bottom: 16px">
            <a-menu-item key="follower"> <a-icon type="team" />{{ $t('followers_trending') }} </a-menu-item>
            <a-menu-item key="totalStat"> <a-icon type="line-chart" />{{ $t('statistics_summary_trending') }} </a-menu-item>
          </a-menu>
          <div v-show="currentDataCategory.indexOf('follower') !== -1">
            <div v-if="isLoadingFollowerRecords">
              <a-spin :spinning="true">
                <i18n path="fetching_member_follower_history_prompt" tag="label">
                  <a :href="'https://space.bilibili.com/' + this.$route.params.mid" target="_blank">{{ 'mid_'+this.$route.params.mid }}</a>
                </i18n>
              </a-spin>
            </div>
            <div v-else>
              <div v-if="followerCategoryEnterCount > 0">
                <tdd-member-follower-history-line-chart :follower-records="followerRecords" />
              </div>
            </div>
          </div>
          <div v-show="currentDataCategory.indexOf('totalStat') !== -1">
            <div v-if="isLoadingTotalStatRecords">
              <a-spin :spinning="true">
                <i18n path="fetching_member_statistics_summary_history_prompt" tag="label">
                  <a :href="'https://space.bilibili.com/' + this.$route.params.mid" target="_blank">{{ 'mid_'+this.$route.params.mid }}</a>
                </i18n>
              </a-spin>
            </div>
            <div v-else>
              <div v-if="totalStatCategoryEnterCount > 0">
                <tdd-member-total-stat-history-line-chart :total-stat-records="totalStatRecords" />
              </div>
            </div>
          </div>
        </div>
        <div class="section-separator"></div>
        <div class="section-block">
          <a-collapse :activeKey="[1]" style="margin-bottom: 8px">
            <a-collapse-panel :header="$t('search_filter')" key="1">
              <table class="filter-table">
                <tr>
                  <td class="filter-table-label">
                    {{ $t('filter.sort_by.label') }}
                  </td>
                  <td>
                    <a-radio-group name="orderSelector" v-model="orderValue">
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
                  <td class="filter-table-label">
                    {{ $t('filter.sort_order.label') }}
                  </td>
                  <td>
                    <a-radio-group name="orderDescSelector" v-model="orderDescValue">
                      <a-radio :value="0">{{ $t('filter.sort_order.asc') }}</a-radio>
                      <a-radio :value="1">{{ $t('filter.sort_order.desc') }}</a-radio>
                    </a-radio-group>
                  </td>
                </tr>
              </table>
              <a-button
                type="primary"
                icon="search"
                :loading="isLoadingMemberVideos"
                @click="handleSearchButtonClick"
                style="margin-top: 8px"
              >
                {{ $t('search') }}
              </a-button>
              <a-popconfirm
                :title="$t('reset_confirm')"
                @confirm="handleReloadButtonClick"
                :okText="$t('ok')"
                :cancelText="$t('cancel')"
              >
                <a-button
                  icon="reload"
                  style="margin-top: 8px; margin-left: 16px"
                >
                  {{ $t('reset') }}
                </a-button>
              </a-popconfirm>
            </a-collapse-panel>
          </a-collapse>
          <a-spin :spinning="isLoadingMemberVideos">
            <tdd-video-list
              :video-list="memberVideoList"
              :mode="'grid'"
              @item-clicked="videoListItemClickedHandler"
            />
            <a-pagination
              showQuickJumper
              v-model="pagiCurrent"
              :total="memberVideoTotalCount"
              :showTotal="total => $t('pagi_total', { total })"
              :pageSize="20"
              style="margin-top: 8px"
              @change="onPagiChange"
            />
          </a-spin>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue';
import TddVideoList from "../../common/TddVideoList";
import TddVideoStatBar from "../../common/TddVideoStatBar";
import TddMemberActionBar from "../../common/TddMemberActionBar";
import TddMemberLogTable from "../../common/TddMemberLogTable";
import TddMemberFollowerHistoryLineChart from "@/components/chart/TddMemberFollowerHistoryLineChart";
import TddMemberTotalStatHistoryLineChart from "@/components/chart/TddMemberTotalStatHistoryLineChart";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1640736_mzfdr5d9c2h.js',
});

export default {
  name: 'MemberDetail',
  data: function () {
    return {
      member: null,
      memberVideoList: [],
      isLoadingMember: false,
      isLoadingMemberVideos: false,
      pagiCurrent: 1,
      memberVideoTotalCount: 0,
      orderValue: 'pubdate',
      orderDescValue: 1,
      followerRecords: [],
      isLoadingFollowerRecords: false,
      totalStatRecords: [],
      isLoadingTotalStatRecords: false,
      currentInfoCategory: ['overview'],
      isLoadingMemberLogs: false,
      memberLogs: [],
      currentDataCategory: ['follower'],
      followerCategoryEnterCount: 1,
      totalStatCategoryEnterCount: 0
    }
  },
  components: {
    TddMemberFollowerHistoryLineChart,
    TddVideoList,
    IconFont,
    TddVideoStatBar,
    TddMemberActionBar,
    TddMemberLogTable,
    TddMemberTotalStatHistoryLineChart,
  },
  computed: {
    mid: function () {
      return parseInt(this.$route.params.mid);
    },
    _clientMode: function () {
      return this.$store.getters.clientMode;
    }
  },
  watch: {
    mid: function () {
      this.getMemberInfo(this.mid, true);
      this.getMemberLogs(this.mid);
      this.getFollowerRecords(this.mid);
      this.getTotalStatRecords(this.mid);
      this.fetchVideoList();
    },
    currentDataCategory: function () {
      if (this.currentDataCategory.indexOf('totalStat') !== -1) {
        this.totalStatCategoryEnterCount++;
      } else if (this.currentDataCategory.indexOf('follower') !== -1) {
        this.followerCategoryEnterCount++;
      }
    },
    _clientMode: function () {
      this.totalStatCategoryEnterCount = 0;
      this.followerCategoryEnterCount = 0;
      if (this.currentDataCategory.indexOf('totalStat') !== -1) {
        this.totalStatCategoryEnterCount++;
      } else if (this.currentDataCategory.indexOf('follower') !== -1) {
        this.followerCategoryEnterCount++;
      }
    }
  },
  methods: {
    getMemberInfo: function(mid, checkMemberFromStore=false) {
      this.isLoadingMember = true;

      // check video from store
      let memberLoadedFromStore = false;
      if (checkMemberFromStore) {
        let member = this.$store.state.memberDetailMember;
        if (member && member.mid === mid) {
          this.member = member;
          memberLoadedFromStore = true;
          this.isLoadingMember = false;
        }
      }

      let that = this;
      if (!memberLoadedFromStore) {
        this.$axios.get('member/' + mid)
          .then(function (response) {
            that.member = response.data;
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            that.isLoadingMember = false;
          });
      }
    },
    getFollowerRecords: function (mid) {
      this.isLoadingFollowerRecords = true;

      let that = this;
      this.$axios.get('member/' + mid + '/follower')
        .then(function (response) {
          that.followerRecords = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingFollowerRecords = false;
        });
    },
    getTotalStatRecords: function (mid) {
      this.isLoadingTotalStatRecords = true;

      let that = this;
      this.$axios.get('member/' + mid + '/totalstat')
        .then(function (response) {
          that.totalStatRecords = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingTotalStatRecords = false;
        });
    },
    getMemberLogs: function (mid) {
      if (this.$store.state.isUserLoggedIn === false) {
        // only get log when user logged in
        this.memberLogs = [];
        return;
      }
      this.isLoadingMemberLogs = true;

      let that = this;
      this.$axios.get('member/log?mid=' + mid)
        .then(function (response) {
          that.memberLogs = response.data.reverse();
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingMemberLogs = false;
        });
    },
    assemblyQuery: function () {
      let url = 'member/' + this.mid + '/video?';
      // order_by
      url += 'order_by=' + this.orderValue + '&';
      // desc
      if (this.orderDescValue === 0) {
        url += 'desc=0&';
      } else {
        url += 'desc=1&';
      }
      // pn
      url += 'pn=' + this.pagiCurrent;
      return url;
    },
    fetchVideoList: function () {
      this.isLoadingMemberVideos = true;

      let that = this;
      let url = this.assemblyQuery();
      this.$axios.get(url)
        .then(function (response) {
          that.memberVideoList = response.data;
          that.memberVideoTotalCount = parseInt(response.headers['x-total-count']);
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingMemberVideos = false;
        });
    },
    videoListItemClickedHandler: function (item) {
      this.$store.commit('setVideoDetailDrawerVideo', item);
      this.$store.commit('setVideoDetailDrawerVisibility', true);
    },
    onPagiChange: function (pagiClick) {
      this.pagiCurrent = pagiClick;
      this.fetchVideoList();
    },
    handleSearchButtonClick: function () {
      if (!this.isLoadingMemberVideos) {
        this.pagiCurrent = 1;
        this.fetchVideoList();
      }
    },
    handleReloadButtonClick: function() {
      this.orderValue = 'pubdate';
      this.orderDescValue = 1;
    }
  },
  created: function() {
    this.getMemberInfo(this.mid, true);
    this.getMemberLogs(this.mid);
    this.getFollowerRecords(this.mid);
    this.getTotalStatRecords(this.mid);
    this.fetchVideoList();
  },
}
</script>

<style scoped>
.filter-table td {
  height: 40px;
}
.filter-table-label {
  width: 80px;
  white-space: nowrap;
}

.tdd-member-detail-header {
  overflow: hidden;
}
.tdd-member-detail-header-avatar {
  float: left;
  margin-right: 12px;
}
.tdd-member-detail-header-content {
  float: left;
  width: calc(100% - 60px);
}
.tdd-member-detail-header-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tdd-member-detail-header-title-sex {
  font-size: 1.17em;
  margin-top: 4px;
  margin-left: 8px;
}
.tdd-member-detail-header-video-count-follower {
  margin-top: 4px;
}
</style>
