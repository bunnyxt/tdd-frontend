<template>
  <div>
    <div v-wechat-title="$route.meta.title=`${archId === 0 ? '' : (rankArchiveOverview.find(x => x.id === archId) ? rankArchiveOverview.find(x => x.id === archId).name : archId) + ' - '}${categories[category[0]]} - 排行 - 天钿Daily`"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>排行</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <a-alert message="WORK IN PROGRESS" style="margin-bottom: 16px" banner/>
      <div>
        <div style="display: flex">
          <a-menu
            v-model="category"
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
            <a-popover v-if="$store.state.clientWidth < 964" placement="bottom" trigger="click">
<!--            <a-popover v-if="$store.state.clientWidth < 864" placement="bottom" trigger="click">-->
              <a-button>
                <a-icon type="filter" />
              </a-button>
<!--              <div slot="content" style="width: 312px">-->
              <div slot="content" :style="$store.state.clientWidth < 472 ? { width: '280px' } : { width: '412px' }">
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
                  placeholder="请选择排名期数"
                  @change="archIdCascaderChangeHandler"
                  style="width: 280px"
                />
              </div>
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
                placeholder="请选择排名期数"
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
          message="加载中..."
          :description="`${categories[category[0]]}，${rankArchiveOverview.find(a => a.id === archId) ? rankArchiveOverview.find(a => a.id === archId).name : `arch_id=${archId}`}，${orderRules[orderRule]}，第${pn}页`"
          type="info"
          style="margin-top: 12px"
        />
        <div v-else>
          <a-row style="margin-top: 16px">
            <a-col :xs="24" :sm="12" :lg="8">
              <a-alert>
                <template slot="message">
                  {{ rankArchiveOverview.find(a => a.id === archId) ? rankArchiveOverview.find(a => a.id === archId).name : `arch_id=${archId}` }}
                </template>
                <template slot="description">
                  <template v-if="archId === 0">
                    开始时间：{{ $util.tsToDateString($util.getLatestSat0300Ts(rankList[0].now_added)) }}<br/>
                    统计时间：{{ $util.tsToDateString($util.getLatestHourStartTs(rankList[0].now_added)) }}
                  </template>
                  <template v-else>
                    开始时间：{{ $util.tsToDateString(rankArchiveOverview.find(a => a.id === archId).start_ts) }}<br/>
                    统计时间：{{ $util.tsToDateString(rankArchiveOverview.find(a => a.id === archId).end_ts) }}
                  </template>
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

export default {
  name: 'RankHome',
  data: function () {
    return {
      category: ['weekly'],
      categories: {
        'hourly': '小时榜',
        'daily': '日榜',
        'weekly': '周榜',
        'monthly': '月榜',
        'yearly': '年榜',
      },
      categoryEnabledList: ['weekly'],
      archId: 0,
      rankList: [],
      rankTotalCount: 0,
      isLoadingRankList: false,
      rankColor: {},
      rankArchiveOverview: [{ id: 0, name: '实时排行' }],
      orderRule: 'rank',
      orderRules: {
        'rank': '按得分排名',
        'incr_view': '按播放增量',
        'incr_danmaku': '按弹幕增量',
        'incr_reply': '按评论增量',
        'incr_favorite': '按收藏增量',
        'incr_coin': '按硬币增量',
        'incr_share': '按分享增量',
        'incr_like': '按点赞增量',
      },
      pn: 1,
    }
  },
  components: {
    TddRankTable,
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
          label: '实时排行',
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
            label: `${year}年`,
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
            label: `${month}月`,
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
          that.rankArchiveOverview = [{ id: 0, name: '实时排行' }, ...rankArchiveOverviewResponse.data.reverse()];
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
      return `第${from}名 - 第${to}名`;
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
    categoryClickHandler: function () {
      this.pushRouter(this.category[0]);
    },
    archIdChangeHandler: function () {
      this.pushRouter(this.category[0], this.archId);
      this.$service.reportInteraction('rank_weekly_change_archid', JSON.stringify({ archId: this.archId }));
    },
    archIdCascaderChangeHandler: function (e) {
      this.archId = e.pop();
      this.archIdChangeHandler();
    },
    orderRuleChangeHandler: function () {
      this.pushRouter(this.category[0], this.archId, this.orderRule);
      this.$service.reportInteraction('rank_weekly_change_order', JSON.stringify({ orderRule: this.orderRule }));
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
