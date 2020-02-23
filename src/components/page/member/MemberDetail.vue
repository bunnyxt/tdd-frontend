<template>
  <div>
    <div v-wechat-title="$route.meta.title='mid_'+mid+' - UP主详情 - 天钿Daily'"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/member">UP主</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ mid }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div v-if="isLoadingMember">
      <div class="section-block">
        <a-spin :spinning="true">
          正在获取用户<a :href="'https://space.bilibili.com/' + this.$route.params.mid" target="_blank">{{ 'mid_'+this.$route.params.mid }}</a>的信息
        </a-spin>
      </div>
    </div>
    <div v-else>
      <div v-if="!member || Object.keys(member).length === 0">
        <div class="section-block">
          <p>没有找到用户<a :href="'https://space.bilibili.com/' + this.$route.params.mid" target="_blank">{{ 'mid_'+this.$route.params.mid }}</a>的信息</p>
          <p>可能是因为改用户的视频投稿不在本站收录范围内</p>
          <a @click="$router.go(-1)">返回上一页</a>
        </div>
      </div>
      <div v-else>
        <div v-wechat-title="$route.meta.title=member.name+' - UP主详情 - 天钿Daily'"></div>
        <div class="section-block">
          <div class="tdd-member-detail-header">
            <a-avatar
                class="tdd-member-detail-header-avatar"
                :src="member.face ? member.face : 'https://static.hdslb.com/images/member/noface.gif'"
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
                {{ member.video_count }}
                <a-icon type="team" class="stat-item-icon" style="margin-left: 12px; margin-right: 4px" />
                {{ member.last_follower ? member.last_follower.follower : -1 }}
              </div>
            </div>
          </div>
          <div style="margin-top: 8px">
            <p>{{ member.sign }}</p>
            <p><a-icon type="home" style="margin-right: 12px"/><a :href="'https://space.bilibili.com/'+member.mid" target="_blank">前往UP主B站个人空间</a></p>
          </div>
          <a-divider orientation="left">数据总计</a-divider>
          <tdd-video-stat-bar :stat="member.last_total_stat" :mode="'vertical'" :show-name="true" />
          *{{ $util.tsToDateString(member.last_total_stat.added) }}更新
        </div>
        <div class="section-separator"></div>
        <div class="section-block">
          <a-menu v-model="currentDataCategory" mode="horizontal" style="margin-bottom: 16px">
            <a-menu-item key="follower"> <a-icon type="team" />粉丝趋势 </a-menu-item>
            <a-menu-item key="totalStat"> <a-icon type="line-chart" />数据总计趋势 </a-menu-item>
          </a-menu>
          <div v-show="currentDataCategory.indexOf('follower') !== -1">
            <div v-if="isLoadingFollowerRecords">
              <a-spin :spinning="true">
                正在获取用户<a :href="'https://space.bilibili.com/' + this.$route.params.mid" target="_blank">{{ 'mid_'+this.$route.params.mid }}</a>的历史粉丝数据
              </a-spin>
            </div>
            <div v-else>
              <div v-if="followerCategoryEnterCount > 0">
                <member-detail-follower-history-line-chart :follower-records="followerRecords" />
              </div>
            </div>
          </div>
          <div v-show="currentDataCategory.indexOf('totalStat') !== -1">
            <div v-if="isLoadingTotalStatRecords">
              <a-spin :spinning="true">
                正在获取用户<a :href="'https://space.bilibili.com/' + this.$route.params.mid" target="_blank">{{ 'mid_'+this.$route.params.mid }}</a>的历史数据总计数据
              </a-spin>
            </div>
            <div v-else>
              <div v-if="totalStatCategoryEnterCount > 0">
                <member-detail-total-stat-history-line-chart :total-stat-records="totalStatRecords" />
              </div>
            </div>
          </div>
        </div>
        <div class="section-separator"></div>
        <div class="section-block">
          <a-collapse :activeKey="[1]" style="margin-bottom: 8px">
            <a-collapse-panel header="筛选搜索" key="1">
              <table class="filter-table">
                <tr>
                  <td class="filter-table-label">
                    排序依据
                  </td>
                  <td>
                    <a-radio-group name="orderSelector" v-model="orderValue">
                      <a-radio :value="'pubdate'">投稿时间</a-radio>
                      <a-radio :value="'view'">播放</a-radio>
                      <a-radio :value="'danmaku'">弹幕</a-radio>
                      <a-radio :value="'reply'">评论</a-radio>
                      <a-radio :value="'favorite'">收藏</a-radio>
                      <a-radio :value="'coin'">硬币</a-radio>
                      <a-radio :value="'share'">分享</a-radio>
                      <a-radio :value="'like'">点赞</a-radio>
                    </a-radio-group>
                  </td>
                </tr>
                <tr>
                  <td class="filter-table-label">
                    排序顺序
                  </td>
                  <td>
                    <a-radio-group name="orderDescSelector" v-model="orderDescValue">
                      <a-radio :value="0">从小到大</a-radio>
                      <a-radio :value="1">从大到小</a-radio>
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
                搜索
              </a-button>
              <a-popconfirm
                  title="确定重置所有条件？"
                  @confirm="handleReloadButtonClick"
                  okText="确定"
                  cancelText="取消"
              >
                <a-button
                    icon="reload"
                    style="margin-top: 8px; margin-left: 16px"
                >
                  重置
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
                :showTotal="total => `共 ${total} 个视频`"
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
  import MemberDetailFollowerHistoryLineChart from "./MemberDetailFollowerHistoryLineChart";
  import MemberDetailTotalStatHistoryLineChart from "./MemberDetailTotalStatHistoryLineChart";
  import TddVideoStatBar from "../../common/TddVideoStatBar";

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
        currentDataCategory: ['follower'],
        followerCategoryEnterCount: 1,
        totalStatCategoryEnterCount: 0
      }
    },
    components: {
      TddVideoList,
      IconFont,
      MemberDetailFollowerHistoryLineChart,
      MemberDetailTotalStatHistoryLineChart,
      TddVideoStatBar
    },
    computed: {
      mid: function () {
        return this.$route.params.mid;
      },
      _clientMode: function () {
        return this.$store.getters.clientMode;
      }
    },
    watch: {
      mid: function () {
        this.getMemberInfo(this.mid, true);
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
        this.orderValue = 1;
        this.orderDescValue = 1;
      }
    },
    created: function() {
      this.getMemberInfo(this.mid, true);
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