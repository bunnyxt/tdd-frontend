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
        <tdd-rank-current-table :rank-current-list="rankCurrentList" style="margin-top: 16px"></tdd-rank-current-table>
        <a-pagination
            showQuickJumper
            v-model="pagiCurrent"
            :total="rankCurrentTotalCount"
            :showTotal="total => `共 ${total} 个视频`"
            :pageSize="20"
            style="margin-top: 8px"
            @change="onPagiChange"
        />
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
        this.$axios.get(url)
          .then(function (response) {
            that.rankCurrentList = response.data;
            that.rankCurrentTotalCount = parseInt(response.headers['x-total-count']);
          })
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
    },
    mounted() {
      this.fetchRankCurrentList();
    }
  }
</script>

<style scoped>

</style>
