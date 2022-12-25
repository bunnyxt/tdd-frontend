<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "rank_category": {
      "hourly": "小时榜",
      "daily": "日榜",
      "weekly": "周榜",
      "monthly": "月榜",
      "yearly": "年榜"
    },
    "sort_by": "按{rule}",
    "sort_by_rank": "按得分排名",
    "incr_suffix": "增量",
    "real-time_ranking": "实时排行",
    "year_suffix": "年",
    "month": {
      "1": "1月",
      "2": "2月",
      "3": "3月",
      "4": "4月",
      "5": "5月",
      "6": "6月",
      "7": "7月",
      "8": "8月",
      "9": "9月",
      "10": "10月",
      "11": "11月",
      "12": "12月"
    },
    "color_mark": "颜色标记",
    "pagi_total": "第{from}名 - 第{to}名",
    "loading_prompt": "{category}，{arch}, {rule}, 第{pn}页",
    "select_arch_prompt": "请选择排名期数"
  },
  "en": {
    "rank_category": {
      "hourly": "Hourly",
      "daily": "Daily",
      "weekly": "Weekly",
      "monthly": "Monthly",
      "yearly": "Yearly"
    },
    "sort_by": "By {rule}",
    "sort_by_rank": "By Point",
    "incr_suffix": " Increment",
    "real-time_ranking": "Real-time Ranking",
    "year_suffix": " ",
    "month": {
      "1": "Jan",
      "2": "Feb",
      "3": "Mar",
      "4": "Apr",
      "5": "May",
      "6": "Jun",
      "7": "Jul",
      "8": "Aug",
      "9": "Sep",
      "10": "Oct",
      "11": "Nov",
      "12": "Dec"
    },
    "color_mark": "Color Mark",
    "pagi_total": "Rank {from} - {to}",
    "loading_prompt": "{category}, {arch}, {rule}, Page {pn}",
    "select_arch_prompt": "Select Ranking Archive"
  }
}
</i18n>

<template>
  <div>
    <div v-wechat-title="$route.meta.title=$t('page_title.rank', { name: `${archId === 0 ? '' : (rankArchiveOverview.find(x => x.id === archId) ? rankArchiveOverview.find(x => x.id === archId).name : archId) + ' - '}${categories[category[0]]}` })"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('page_name.rank') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <div>
        <div style="display: flex">
          <a-menu
            v-model:selectedKeys="category"
            mode="horizontal"
            @click="categoryClickHandler"
            style="width: calc(100% - 58px)"
          >
            <a-menu-item
              v-for="(val, key) in categories"
              :key="key"
              :disabled="!categoryEnabledList.includes(key)"
            >
              {{ val }}
            </a-menu-item>
          </a-menu>
          <div style="margin-top: 8px; padding-left: 12px; border-bottom: 1px solid #e8e8e8">
            <a-popover v-if="$store.state.clientWidth < 964" placement="bottomRight" trigger="click">
<!--            <a-popover v-if="$store.state.clientWidth < 864" placement="bottom" trigger="click">-->
              <a-button>
                <filter-outlined />
              </a-button>
<!--              <template #content><div style="width: 312px"></template>-->
              <template #content>
                <div :style="$store.state.clientWidth < 472 ? { width: '280px' } : { width: '412px' }">
                  <a-select
                    v-model="orderRule"
                    @change="orderRuleChangeHandler"
                    style="margin-right: 12px; width: 120px"
                  >
                    <a-select-option
                      v-for="(val, key) in orderRules"
                      :key="key"
                      :value="key"
                    >
                      {{ val }}
                    </a-select-option>
                  </a-select>
  <!--                <a-select-->
  <!--                  v-model="archId"-->
  <!--                  @change="archIdChangeHandler"-->
  <!--                  style="width: 180px"-->
  <!--                >-->
  <!--                  <a-select-option-->
  <!--                    v-for="item in rankArchiveOverview"-->
  <!--                    :key="item.id"-->
  <!--                    :value="item.id"-->
  <!--                  >-->
  <!--                    {{ item.name }}-->
  <!--                  </a-select-option>-->
  <!--                </a-select>-->
                  <template v-if="$store.state.clientWidth < 472">
                    <div style="height: 8px" />
                  </template>
                  <a-cascader
                    :allowClear="false"
                    expandTrigger="hover"
                    :value="archIdCascader"
                    :options="rankArchiveOverviewOptions"
                    :disabled="archIdCascader === []"
                    :placeholder="$t('select_arch_prompt')"
                    @change="archIdCascaderChangeHandler"
                    style="width: 280px"
                  />
                </div>
              </template>
            </a-popover>
            <div v-else style="display: flex">
              <a-select
                v-model="orderRule"
                @change="orderRuleChangeHandler"
                style="margin-right: 12px; width: 120px"
              >
                <a-select-option
                  v-for="(val, key) in orderRules"
                  :key="key"
                  :value="key"
                >
                  {{ val }}
                </a-select-option>
              </a-select>
<!--              <a-select-->
<!--                v-model="archId"-->
<!--                @change="archIdChangeHandler"-->
<!--                style="width: 180px"-->
<!--              >-->
<!--                <a-select-option-->
<!--                  v-for="item in rankArchiveOverview"-->
<!--                  :key="item.id"-->
<!--                  :value="item.id"-->
<!--                >-->
<!--                  {{ item.name }}-->
<!--                </a-select-option>-->
<!--              </a-select>-->
              <a-cascader
                :allowClear="false"
                expandTrigger="hover"
                :value="archIdCascader"
                :options="rankArchiveOverviewOptions"
                :disabled="archIdCascader === []"
                :placeholder="$t('select_arch_prompt')"
                @change="archIdCascaderChangeHandler"
                style="width: 280px"
              />
            </div>
          </div>
        </div>
      </div>
      <a-spin :spinning="isLoadingRankList">
        <a-alert
          v-if="isLoadingRankList"
          :message="`${$t('loading')}...`"
          :description="$t('loading_prompt', { category: categories[category[0]], arch: currentArchiveName, rule: orderRules[orderRule], pn })"
          type="info"
          style="margin-top: 12px"
        />
        <div v-else>
          <div v-if="$store.getters.clientMode === 'MOBILE'" style="margin-top: 16px">
            <a-alert style="padding: 0">
              <template #description>
                <a-collapse :bordered="false" style="background-color: rgba(0, 0, 0, 0); border-width: 0">
                  <a-collapse-panel key="1" :header="currentArchiveName">
                    <rank-home-description
                      :rank-name="category[0]"
                      :start-ts="rankStartTs"
                      :end-ts="rankEndTs"
                    />
                  </a-collapse-panel>
                  <a-collapse-panel key="2" :header="$t('color_mark')">
                    <rank-home-color-mark :color="rankColor" />
                  </a-collapse-panel>
                </a-collapse>
              </template>
            </a-alert>
          </div>
          <a-row v-else style="margin-top: 16px" :gutter="16">
            <a-col :sm="12" :lg="10" :xl="8">
              <a-alert>
                <template #message>
                  {{ currentArchiveName }}
                </template>
                <template #description>
                  <rank-home-description
                    :rank-name="category[0]"
                    :start-ts="rankStartTs"
                    :end-ts="rankEndTs"
                  />
                </template>
              </a-alert>
            </a-col>
            <a-col :sm="12" :lg="14" :xl="16">
              <a-alert>
                <template #message>
                  {{ $t('color_mark') }}
                </template>
                <template #description>
                  <rank-home-color-mark :color="rankColor" />
                </template>
              </a-alert>
            </a-col>
          </a-row>
          <tdd-rank-table
            :rank-list="rankList"
            :rank-color="rankColor"
            :arch-id="archId"
            :highlight="highlight"
            :use-index="useIndex"
            style="margin-top: 16px"
          ></tdd-rank-table>
          <a-pagination
            showQuickJumper
            v-model="pn"
            :total="rankTotalCount"
            :showTotal="getPagiTotalPrompt"
            :pageSize="30"
            style="margin-top: 8px"
            @change="pnChangeHandler"
          ></a-pagination>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script>
import TddRankTable from "../../common/TddRankTable";
import RankHomeDescription from "@/components/page/rank/RankHomeDescription";
import RankHomeColorMark from "@/components/page/rank/RankHomeColorMark";
import { FilterOutlined } from "@ant-design/icons-vue";

export default {
  name: 'RankHome',
  components: {
    TddRankTable,
    RankHomeDescription,
    RankHomeColorMark,
    FilterOutlined,
  },
  data: function () {
    return {
      category: ['weekly'],
      categories: {
        'hourly': this.$t('rank_category.hourly'),
        'daily': this.$t('rank_category.daily'),
        'weekly': this.$t('rank_category.weekly'),
        'monthly': this.$t('rank_category.monthly'),
        'yearly': this.$t('rank_category.yearly'),
      },
      categoryEnabledList: ['weekly', 'monthly'],
      archId: 0,
      rankList: [],
      rankTotalCount: 0,
      isLoadingRankList: false,
      rankColor: {},
      rankArchiveOverview: [{ id: 0, name: this.$t('real-time_ranking') }],
      orderRule: 'rank',
      orderRules: {
        'rank': this.$t('sort_by_rank'),
        'incr_view': this.$t('sort_by', { rule: `${this.$t('view')}${this.$t('incr_suffix')}` }),
        'incr_danmaku': this.$t('sort_by', { rule: `${this.$t('danmaku')}${this.$t('incr_suffix')}` }),
        'incr_reply': this.$t('sort_by', { rule: `${this.$t('reply')}${this.$t('incr_suffix')}` }),
        'incr_favorite': this.$t('sort_by', { rule: `${this.$t('favorite')}${this.$t('incr_suffix')}` }),
        'incr_coin': this.$t('sort_by', { rule: `${this.$t('coin')}${this.$t('incr_suffix')}` }),
        'incr_share': this.$t('sort_by', { rule: `${this.$t('share')}${this.$t('incr_suffix')}` }),
        'incr_like': this.$t('sort_by', { rule: `${this.$t('like')}${this.$t('incr_suffix')}` }),
      },
      pn: 1,
    }
  },
  watch: {
    $route: function (routeObj) {
      this.init(routeObj);
    },
  },
  computed: {
    highlight: function () {
      if (this.orderRule.startsWith('incr_')) {
        return this.orderRule.substring(5);
      }
      return undefined;
    },
    useIndex: function () {
      if (this.orderRule.startsWith('incr_')) {
        return true;
      }
      return false;
    },
    rankArchiveOverviewOptions: function () {
      const options = [
        {
          value: 0,
          label: this.$t('real-time_ranking'),
        },
      ];
      
      for (let archive of this.rankArchiveOverview.filter(archive => archive.id !== 0)) {
        const endTsDate = new Date(archive.end_ts * 1000);
        // calc year
        const year = endTsDate.getFullYear();
        
        // get year children list
        let yearChildrenList = options.find(option => option.value === year);
        if (!yearChildrenList) {
          const newYearOption = {
            value: year,
            label: `${year}${this.$t('year_suffix')}`,
            children: [],
          };
          yearChildrenList = newYearOption.children;
          options.push(newYearOption);
        } else {
          yearChildrenList = yearChildrenList.children;
        }
        
        // calc month
        const month = endTsDate.getMonth() + 1;
        
        // get month children list
        let monthChildrenList = yearChildrenList.find(option => option.value === month);
        if (!monthChildrenList) {
          const newMonthOption = {
            value: month,
            label: this.$t(`month.${month}`),
            children: [],
          };
          monthChildrenList = newMonthOption.children;
          yearChildrenList.push(newMonthOption);
        } else {
          monthChildrenList = monthChildrenList.children;
        }
        
        // append new archive option
        monthChildrenList.push({
          value: archive.id,
          label: archive.name,
        });
      }
      
      return options;
    },
    archIdCascader: function () {
      if (this.archId === 0) {
        return [0];
      }
      
      const yearOptions = this.rankArchiveOverviewOptions.filter(archive => archive.value !== 0);
      if (!yearOptions) {
        return [];
      }
      
      let year, month;
      for (let yearOption of yearOptions) {
        year = yearOption.value;
        for (let monthOption of yearOption.children) {
          month = monthOption.value;
          for (let archiveOption of monthOption.children) {
            if (archiveOption.value === this.archId) {
              return [year, month, this.archId];
            }
          }
        }
      }
      
      return [];
    },
    currentArchive: function () {
      return this.rankArchiveOverview.find(a => a.id === this.archId);
    },
    currentArchiveName: function () {
      return this.currentArchive ? this.currentArchive.name : `arch_id=${this.archId}`;
    },
    rankStartTs: function () {
      let startTs;
      if (this.archId === 0) {
        startTs = this.rankList[0].now_added;
      } else {
        startTs = this.currentArchive.start_ts;
      }
      switch (this.category[0]) {
        case 'weekly':
          startTs = this.$util.getLatestSat0300Ts(startTs);
          break;
        case 'monthly':
          startTs = this.$util.getLatestMonth1Day0400Ts(startTs);
          break;
        default:
          break;
      }
      return startTs;
    },
    rankEndTs: function () {
      let endTs;
      if (this.archId === 0) {
        endTs = this.rankList[0].now_added;
      } else {
        endTs = this.currentArchive.end_ts;
      }
      switch (this.category[0]) {
        case 'weekly':
          endTs = this.$util.getLatestHourStartTs(endTs);
          break;
        case 'monthly':
          endTs = this.$util.getLatestHourStartTs(endTs);
          break;
        default:
          break;
      }
      return endTs;
    },
  },
  methods: {
    init: function (routeObj) {
      // set params
      const paramCategory = routeObj.params.category;
      if (!paramCategory) {
        this.category = ['weekly'];
      } else if (this.categoryEnabledList.includes(paramCategory)) {
        this.category = [paramCategory];
      } else {
        // not support category, redirect to default
        this.$router.push('/rank');
      }
      
      const paramArchId = routeObj.params.archId;
      if (!paramArchId) {
        this.archId = 0;
      } else {
        const parsedParamArchId = parseInt(paramArchId);
        if (isNaN(parsedParamArchId) || parsedParamArchId < 0) {
          // invalid archId, redirect to default
          this.$router.push(`/rank/${this.category[0]}`);
        } else {
          this.archId = parsedParamArchId;
        }
      }
      
      const queryOrder = routeObj.query.order;
      if (!queryOrder) {
        this.orderRule = 'rank';
      } else {
        if (!Object.keys(this.orderRules).includes(queryOrder)) {
          // invalid orderRule, redirect to default
          if (this.archId === 0) {
            this.$router.push(`/rank/${this.category[0]}`);
          } else {
            this.$router.push(`/rank/${this.category[0]}/${this.archId}`);
          }
        } else {
          this.orderRule = queryOrder;
        }
      }
      
      const queryPn = routeObj.query.pn;
      if (!queryPn) {
        this.pn = 1;
      } else {
        const parsedQueryPn = parseInt(queryPn);
        if (isNaN(parsedQueryPn) || parsedQueryPn < 1) {
          // invalid pn, redirect to default
          if (this.archId === 0) {
            this.$router.push(`/rank/${this.category[0]}`);
          } else {
            this.$router.push(`/rank/${this.category[0]}/${this.archId}`);
          }
        } else {
          this.pn = parsedQueryPn;
        }
      }
      
      // fetch data
      this.fetchData();
    },
    fetchData: function () {
      this.isLoadingRankList = true;
      
      const that = this;
      const getRankList = function (category, archId, orderRule, pn) {
        return that.$axios.get(
          `/video/record/rank/${category}/${archId === 0 ? 'current' : `archive/${archId}`}?order_rule=${orderRule}&pn=${pn}`
        );
      };
      const getRankColor = function (category, archId) {
        return that.$axios.get(
          `/video/record/rank/${category}/${archId === 0 ? 'current' : `archive/${archId}`}/color`
        );
      };
      const getRankArchiveOverview = function (category) {
        return that.$axios.get(
          `/video/record/rank/${category}/archive/overview`
        );
      };
      this.$axios.all([
        getRankList(this.category[0], this.archId, this.orderRule, this.pn),
        getRankColor(this.category[0], this.archId),
        getRankArchiveOverview(this.category[0]),
      ])
        .then(that.$axios.spread( function (
          rankListResponse, rankColorResponse, rankArchiveOverviewResponse
        ) {
          that.rankList = rankListResponse.data;
          if (that.useIndex) {
            // add index column when index column required
            let index = 30 * (that.pn - 1) + 1;
            for (let i = 0; i < that.rankList.length; i++) {
              that.rankList[i].index = index++;
            }
          }
          that.rankTotalCount = parseInt(rankListResponse.headers['x-total-count']);
          that.rankColor = rankColorResponse.data;
          that.rankArchiveOverview = [{ id: 0, name: that.$t('real-time_ranking') }, ...rankArchiveOverviewResponse.data.reverse()];
        }))
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingRankList = false;
        });
    },
    getPagiTotalPrompt: function () {
      const from = 30 * (this.pn - 1) + 1;
      const to = Math.min(from + 30 - 1, 10000);
      return this.$t('pagi_total', { from, to });
    },
    pushRouter: function (category, archId, order, pn) {
      let url = '/rank';
      if (category) {
        url += `/${category}`;
      }
      if (archId && archId !== 0) {
        url += `/${archId}`;
      }
      
      const paramStrList = [];
      if (order && order !== 'rank') {
        paramStrList.push(`order=${order}`);
      }
      if (pn && pn !== '1') {
        paramStrList.push(`pn=${pn}`);
      }
      if (paramStrList.length > 0) {
        url += '?';
        url += paramStrList.join('&');
      }
      
      this.$router.push(url);
    },
    categoryClickHandler: function ({ key: category }) {
      if (category !== this.category[0]) {
        this.pushRouter(category);
      }
    },
    archIdChangeHandler: function () {
      this.pushRouter(this.category[0], this.archId);
      this.$service.reportInteraction(`rank_change_archid`, JSON.stringify({ rank_name: this.category[0], archId: this.archId }));
    },
    archIdCascaderChangeHandler: function (e) {
      this.archId = e.pop();
      this.archIdChangeHandler();
    },
    orderRuleChangeHandler: function () {
      this.pushRouter(this.category[0], this.archId, this.orderRule);
      this.$service.reportInteraction('rank_change_order', JSON.stringify({ rank_name: this.category[0], orderRule: this.orderRule }));
    },
    pnChangeHandler: function () {
      this.pushRouter(this.category[0], this.archId, this.orderRule, this.pn);
    },
  },
  created() {
    this.init(this.$route);
  }
}
</script>

<style scoped>

</style>
