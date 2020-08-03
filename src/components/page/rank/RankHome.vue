<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>排行</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <a-alert message="WORK IN PROGRESS" style="margin-bottom: 16px" banner/>
      <a-menu v-model="category" mode="horizontal">
        <a-menu-item key="hourly" disabled>小时榜</a-menu-item>
        <a-menu-item key="daily" disabled>日榜</a-menu-item>
        <a-menu-item key="weekly">周榜</a-menu-item>
        <a-menu-item key="monthly" disabled>月榜</a-menu-item>
        <a-menu-item key="yearly" disabled>年榜</a-menu-item>
      </a-menu>
      <a-spin :spinning="isLoadingRankCurrentList">
        <tdd-rank-current-table
            :rank-current-list="rankCurrentList"
            :rank-current-color="rankCurrentColor"
            style="margin-top: 16px"
        ></tdd-rank-current-table>
        <a-pagination
            showQuickJumper
            v-model="pagiCurrent"
            :total="rankCurrentTotalCount"
            :showTotal="getPagiTotalPrompt"
            :pageSize="30"
            style="margin-top: 8px"
            @change="onPagiChange"
        ></a-pagination>
      </a-spin>
<!--      <keep-alive>-->
<!--        <router-view v-if="$route.meta.keepAlive" v-wechat-title="$route.meta.title"></router-view>-->
<!--      </keep-alive>-->
<!--      <router-view v-if="!$route.meta.keepAlive" v-wechat-title="$route.meta.title"></router-view>-->
    </div>
  </div>
</template>

<script>
import TddRankCurrentTable from "../../common/TddRankCurrentTable";

export default {
  name: 'RankHome',
  data: function () {
    return {
      category: ['weekly'],
      rankCurrentList: [],
      rankCurrentTotalCount: 0,
      isLoadingRankCurrentList: false,
      rankCurrentColor: {},
      pagiCurrent: 1,
    }
  },
  components: {
    TddRankCurrentTable
  },
  watch: {
    // category: function () {
    //   this.$router.push('/rank/' + this.category[0])
    // }
  },
  methods: {
    fetchRankCurrentList: function () {
      this.isLoadingRankCurrentList = true;
      let url = `/video/record/rank/${this.category[0]}/current?pn=${this.pagiCurrent}`;
      let that = this;
      let getRankCurrentList = function () {
        return that.$axios.get(url);
      };
      let getRankCurrentColor = function () {
        return that.$axios.get(`/video/record/rank/${that.category[0]}/current/color`);
      };
      this.$axios.all([getRankCurrentList(), getRankCurrentColor()])
          .then(that.$axios.spread( function (rankCurrentListResponse, rankCurrentColorResponse) {
            that.rankCurrentList = rankCurrentListResponse.data;
            that.rankCurrentTotalCount = parseInt(rankCurrentListResponse.headers['x-total-count']);
            that.rankCurrentColor = rankCurrentColorResponse.data;
          }))
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            that.isLoadingRankCurrentList = false;
          });
    },
    onPagiChange: function (pagiClick) {
      this.pagiCurrent = pagiClick;
      this.fetchRankCurrentList();
    },
    getPagiTotalPrompt: function () {
      let from = 30 * (this.pagiCurrent - 1) + 1;
      let to = from + 30 - 1;
      if (to > 10000) {
        to = 10000;
      }
      return `第${from}名 - 第${to}名`;
    }
  },
  mounted() {
    this.fetchRankCurrentList();
  }
}
</script>

<style scoped>

</style>
