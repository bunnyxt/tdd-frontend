<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "page_intro_updatelog": "本页面记录本项目自创建开始以来的较大更新动态。记录项由站长手动维护，可能有一定的延迟。",
    "know_more_update_prompt": "欲知最新的项目动态，请加QQ群：{0} {1} {2} 或移步本项目的 {3} 主页。"
  },
  "en": {
    "page_intro_updatelog": "Major updates of this site. Records are manually maintained by the webmaster so some delay may occur.",
    "know_more_update_prompt": "Please join QQ group: {0} {1} {2} or visit {3} for more detailed updated info."
  }
}
</i18n>

<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/about">{{ $t('page_name.about') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('page_name.about_updatelog') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>{{ $t('page_name.about_updatelog') }}</h1>
      <p>{{ $t('page_intro_updatelog') }}</p>
      <p>
        <i18n path="know_more_update_prompt" tag="label">
          <a target="_blank" href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a>
          <a-icon type="qrcode" style="margin-left: 8px; margin-right: 4px"/>
          <a target="_blank" :href="qqgroup_qrcode">{{ $t('qr_code') }}</a>
          <a target="_blank" href="https://github.com/users/bunnyxt/projects/1">GitHub Project</a>
        </i18n>
      </p>
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
import qqgroup_qrcode from '../../../assets/img/qrcode_1580391374617.jpg'

export default {
  name: 'UpdateLog',
  data: function () {
    return {
      qqgroup_qrcode: qqgroup_qrcode,
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
