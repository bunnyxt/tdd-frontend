<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/about">关于</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>更新动态</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>更新动态</h1>
      <p>本页面记录本项目自创建开始以来的较大更新动态。记录项由站长手动维护，可能有一定的延迟。</p>
      <p>欲知最新的项目动态，请加QQ群：<a target="_blank" href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a><a-icon type="qrcode" style="margin-left: 8px; margin-right: 4px"/><a target="_blank" href="https://img04.sogoucdn.com/app/a/100520146/8890ed5f23adc62b22a1033c403be444">二维码</a> 或移步本项目的 <a target="_blank" href="https://github.com/users/bunnyxt/projects/1">GitHub Project</a> 主页。</p>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <template v-if="isLoadingUpdateLogList">
        <a-spin />
      </template>
      <template v-else>
        <a-timeline style="margin-top: 12px">
          <a-timeline-item
              v-for="updateLog in updateLogList"
              :key="updateLog.added"
              :color="getTimelineItemColor(updateLog.type)"
          >
            <b>{{ $util.tsToDateString(updateLog.added) }}</b> {{ updateLog.content }}
          </a-timeline-item>
        </a-timeline>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpdateLog',
  data: function () {
    return {
      isLoadingUpdateLogList: false,
      updateLogList: []
    }
  },
  methods: {
    fetchUpdateLogList: function () {
      this.isLoadingUpdateLogList = true;
      let last_count = 0; // get all logs
      let url = 'updatelog?last_count=' + last_count;
      let that = this;
      this.$axios.get(url)
        .then(function (response) {
          that.updateLogList = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingUpdateLogList = false;
        });
    },
    getTimelineItemColor: function (type) {
      let timelineItemColorArray = ['blue', 'blue', 'red', 'green'];
      return timelineItemColorArray[type];
    }
  },
  created() {
    this.fetchUpdateLogList();
  }
}
</script>

<style>
  .ant-timeline-item-last {
    padding-bottom: 8px;
  }
</style>