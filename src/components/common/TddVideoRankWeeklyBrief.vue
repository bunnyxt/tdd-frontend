<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "fetching_weekly_rank_info_prompt": "正在获取BV{bvid}的周榜排行信息...",
    "use_zk_calc_prompt": "请使用视频详情页下方\"周刊算分\"功能计算得分"
  },
  "en": {
    "fetching_weekly_rank_info_prompt": "Now fetching weekly rank info of video BV{bvid}...",
    "use_zk_calc_prompt": "Please use 'Weekly Point Calc' below to calc point."
  }
}
</i18n>

<template>
  <div>
    <div v-if="isLoading">
      <a-spin :spinning="true">
        {{ $t('fetching_weekly_rank_info_prompt', { bvid }) }}
      </a-spin>
    </div>
    <div v-else>
      <div v-if="Object.keys(rankInfo).length === 0">
        <div class="rank-point-bar">
          <div style="display: flex; flex-wrap: nowrap">
            <a-statistic :title="$t('rank_order')" value="10,000+" style="margin-right: 16px" />
            <a-statistic :title="$t('point')" value="***" />
          </div>
        </div>
        *{{ $t('use_zk_calc_prompt') }}
      </div>
      <div v-else>
        <div class="rank-point-bar">
          <div style="display: flex; flex-wrap: nowrap; justify-content: space-between">
            <a-statistic :title="$t('rank_order')" :value="rankInfo" style="margin-right: 16px" >
              <template slot="formatter">
                <div style="min-width: 28px">
                  {{ rankInfo.rank.toLocaleString() }}
                </div>
              </template>
            </a-statistic>
            <a-statistic :title="$t('point')" :value="rankInfo" style="margin-right: 16px">
              <template slot="formatter">
                <div style="min-width: 28px">
                  <span :class="[getColorClass('point', rankInfo.point)]">
                    {{ rankInfo.point.toLocaleString() }}
                  </span>
                </div>
              </template>
            </a-statistic>
            <a-statistic :title="$t('xiu_a')" :value="rankInfo" style="margin-right: 16px">
              <template slot="formatter">
                <div style="min-width: 38px">
                  {{ rankInfo.xiua.toLocaleString() }}
                </div>
              </template>
            </a-statistic>
            <a-statistic :title="$t('xiu_b')" :value="rankInfo.xiub">
              <template slot="formatter">
                <div style="min-width: 38px">
                  {{ rankInfo.xiub.toLocaleString() }}
                </div>
              </template>
            </a-statistic>
          </div>
        </div>
        <a-carousel autoplay>
          <a-statistic :title="$t('view')" :value="rankInfo">
            <template slot="formatter">
              <div class="rank-prop">
                {{ rankInfo.now_view.toLocaleString() }} (
                <span :class="[getColorClass('incr_view', rankInfo.incr_view)]">
                  {{rankInfo.incr_view > 0 ? '+' : ''}}{{ rankInfo.incr_view.toLocaleString() }}
                </span>)
              </div>
            </template>
          </a-statistic>
          <a-statistic :title="$t('danmaku')" :value="rankInfo">
            <template slot="formatter">
              <div class="rank-prop">
                {{ rankInfo.now_danmaku.toLocaleString() }} (
                <span :class="[getColorClass('incr_danmaku', rankInfo.incr_danmaku)]">
                  {{rankInfo.incr_danmaku > 0 ? '+' : ''}}{{ rankInfo.incr_danmaku.toLocaleString() }}
                </span>)
              </div>
            </template>
          </a-statistic>
          <a-statistic :title="$t('reply')" :value="rankInfo">
            <template slot="formatter">
              <div class="rank-prop">
                {{ rankInfo.now_reply.toLocaleString() }} (
                <span :class="[getColorClass('incr_reply', rankInfo.incr_reply)]">
                  {{rankInfo.incr_reply > 0 ? '+' : ''}}{{ rankInfo.incr_reply.toLocaleString() }}
                </span>)
              </div>
            </template>
          </a-statistic>
          <a-statistic :title="$t('favorite')" :value="rankInfo">
            <template slot="formatter">
              <div class="rank-prop">
                {{ rankInfo.now_favorite.toLocaleString() }} (
                <span :class="[getColorClass('incr_favorite', rankInfo.incr_favorite)]">
                  {{rankInfo.incr_favorite > 0 ? '+' : ''}}{{ rankInfo.incr_favorite.toLocaleString() }}
                </span>)
              </div>
            </template>
          </a-statistic>
          <a-statistic :title="$t('coin')" :value="rankInfo">
            <template slot="formatter">
              <div class="rank-prop">
                {{ rankInfo.now_coin.toLocaleString() }} (
                <span :class="[getColorClass('incr_coin', rankInfo.incr_coin)]">
                  {{rankInfo.incr_coin > 0 ? '+' : ''}}{{ rankInfo.incr_coin.toLocaleString() }}
                </span>)
              </div>
            </template>
          </a-statistic>
          <a-statistic :title="$t('share')" :value="rankInfo">
            <template slot="formatter">
              <div class="rank-prop">
                {{ rankInfo.now_share.toLocaleString() }} (
                <span :class="[getColorClass('incr_share', rankInfo.incr_share)]">
                  {{rankInfo.incr_share > 0 ? '+' : ''}}{{ rankInfo.incr_share.toLocaleString() }}
                </span>)
              </div>
            </template>
          </a-statistic>
          <a-statistic :title="$t('like')" :value="rankInfo">
            <template slot="formatter">
              <div class="rank-prop">
                {{ rankInfo.now_like.toLocaleString() }} (
                <span :class="[getColorClass('incr_like', rankInfo.incr_like)]">
                  {{rankInfo.incr_like > 0 ? '+' : ''}}{{ rankInfo.incr_like.toLocaleString() }}
                </span>)
              </div>
            </template>
          </a-statistic>
        </a-carousel>
        *{{ $util.tsToDateString(rankInfo.now_added) }}{{ $t('updated_suffix') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TddVideoWeeklyRankBrief',
  props: {
    bvid: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      rankInfo: {},
      rankColor: {},
      isLoading: false
    }
  },
  watch: {
    bvid: function () {
      this.getRank();
    }
  },
  methods: {
    getRank: function () {
      this.isLoading = true;
      let that = this;
      
      let getRankInfo = function () {
        return that.$axios.get(`video/record/rank/weekly/current/BV${that.bvid}`);
      };
      let getRankColor = function () {
        return that.$axios.get(`/video/record/rank/weekly/current/color`);
      };
      this.$axios.all([getRankInfo(), getRankColor()])
        .then(that.$axios.spread(function (rankInfoResponse, rankColorResponse) {
          that.rankInfo = rankInfoResponse.data;
          that.rankColor = rankColorResponse.data;
        }))
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoading = false;
        });
    },
    getColorClass: function (property, value) {
      let abcd = this.rankColor[property];
      if (!abcd) {
        return 'color-0';
      } else {
        if (value <= abcd.a) {
          return 'color-1';
        } else if (value <= abcd.b) {
          return 'color-2';
        } else if (value <= abcd.c) {
          return 'color-3';
        } else if (value <= abcd.d) {
          return 'color-4';
        } else {
          return 'color-5';
        }
      }
    }
  },
  created() {
    this.getRank();
  }
}
</script>

<style scoped>
.ant-carousel >>> .slick-slide {
  height: 84px;
  overflow: hidden;
}
.ant-carousel >>> .slick-dots li.slick-active button {
  background: #192c3e;
}
.ant-carousel >>> .slick-dots li button {
  background: #364d79;
}

.rank-point-bar {
  width: 100%;
  height: 64px;
  overflow-x: auto;
  overflow-y: hidden;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
.rank-point-bar::-webkit-scrollbar{
  display:none;
}
.rank-prop {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
