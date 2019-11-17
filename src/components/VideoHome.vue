<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/video">所有视频</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div class="section-block">
      <h1>所有视频</h1>
      <p>天钿Daily收录B站<a href="https://www.bilibili.com/v/music/vocaloid/" target="_blank">VOCALOID·UTAU</a>分区下的所有视频和部分其他分区中的VC视频。</p>
      <a-collapse>
        <a-collapse-panel header="筛选搜索">
          <table class="filter-table">
            <tr>
              <td class="filter-table-label">
                视频分类
              </td>
              <td>
                <a-radio-group name="isvcSelector" v-model="isvcValue">
                  <a-radio :value="1">全部</a-radio>
                  <a-radio :value="2">仅VC</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td class="filter-table-label">
                排序
              </td>
              <td>
                <a-radio-group name="orderSelector" v-model="orderValue">
                  <a-radio :value="1">投稿时间</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td class="filter-table-label">
                投稿时间
              </td>
              <td>
                <a-date-picker
                    :disabledDate="disabledStartDate"
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="开始"
                    v-model="pubdateStartValue"
                    @openChange="handlePubdateStartOpenChange"
                />
                 ~
                <a-date-picker
                    :disabledDate="disabledEndDate"
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="结束"
                    v-model="pubdateEndValue"
                    :open="pubdateEndOpen"
                    @openChange="handlePubdateEndOpenChange"
                />
              </td>
            </tr>
            <tr>
              <td class="filter-table-label">
                视频标题
              </td>
              <td>
                <a-input
                    v-model="titleValue"
                    placeholder="视频标题"
                    allowClear
                />
              </td>
            </tr>
            <tr>
              <td class="filter-table-label">
                UP主
              </td>
              <td>
                <a-input
                    v-model="memberNameValue"
                    placeholder="UP主"
                    allowClear
                />
              </td>
            </tr>
          </table>
          <a-button
              type="primary"
              icon="search"
              :loading="isLoadingVideoList"
              @click="handleSearchButtonClick"
              style="margin-top: 8px"
          >
            搜索
          </a-button>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div class="section-seperator"></div>
    <div class="section-block">
      <a-spin :spinning="isLoadingVideoList">
        <a-list itemLayout="vertical" size="large" :pagination="pagination" :dataSource="videoList">
          <a-list-item slot="renderItem" slot-scope="item" key="item.id">
            <a-row>
              <a-col :xs="24" :sm="8" :md="6" :xl="4" style="padding: 8px">
                <img width="100%" height="100%" alt="pic" :src="item.pic"/>
              </a-col>
              <a-col :xs="24" :sm="16" :md="18" :xl="20" style="padding: 8px">
                <a-tooltip placement="topLeft" >
                  <template slot="title">
                    {{ item.title }}
                  </template>
                  <h3 class="video-title" style="">{{item.title}}</h3>
                </a-tooltip>
                <p>
                  <a-icon type="user" style="margin-right: 4px"/>
                  {{item.mid}}
                  <a-icon type="calendar" style="margin-left: 8px; margin-right: 4px"/>
                  {{tsToStr(item.pubdate)}}
                </p>
              </a-col>
            </a-row>
          </a-list-item>
        </a-list>
      </a-spin>
    </div>
  </div>
</template>

<script>
  export default {
    name: "VideoHome",
    components: {

    },
    data: function() {
      return {
        videoList: [],
        isLoadingVideoList: false,
        lastLoadVideoListDate: null,
        pagination: {

        },
        isvcValue: 2,
        orderValue: 1,
        pubdateStartValue: null,
        pubdateEndValue: null,
        pubdateEndOpen: false,
        titleValue: '',
        memberNameValue: ''
      }
    },
    computed: {

    },
    methods: {
      checkParams: function() {
        return true;
      },
      fetchVideoList: function () {
        this.isLoadingVideoList = true;
        if (!this.checkParams()) {
          this.isLoadingVideoList = false;
          return;
        }
        // TODO prepare params

        // TODO assemble url
        let url = "https://api.bunnyxt.com/tdd/v2/videos/vc";

        fetch(url)
          .then(response => response.json())
          .then(json => this.videoList = json)
          .then(() => this.lastLoadVideoListDate = new Date())
          .then(() => this.isLoadingVideoList = false);
      },
      addZero: function(value) {
        return value < 10 ? "0" + value : "" + value;
      },
      tsToStr: function (ts) {
        let date = new Date(ts * 1000);
        let dateString = "";
        dateString += date.getFullYear() + "-";
        dateString += this.addZero(date.getMonth() + 1) + "-";
        dateString += this.addZero(date.getDate()) + " ";
        dateString += this.addZero(date.getHours()) + ":";
        dateString += this.addZero(date.getMinutes()) + ":";
        dateString += this.addZero(date.getSeconds());
        return dateString;
      },
      disabledStartDate(startValue) {
        const endValue = this.pubdateEndValue;
        if (!startValue || !endValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
      },
      disabledEndDate(endValue) {
        const startValue = this.pubdateStartValue;
        if (!endValue || !startValue) {
          return false;
        }
        return startValue.valueOf() >= endValue.valueOf();
      },
      handlePubdateStartOpenChange(open) {
        if (!open) {
          this.pubdateEndOpen = true;
        }
      },
      handlePubdateEndOpenChange(open) {
        this.pubdateEndOpen = open;
      },
      handleSearchButtonClick: function () {
        if (!this.isLoadingVideoList) {
          this.fetchVideoList();
        }
      }
    },
    created() {
      this.isLoadingVideoList = false;
      this.fetchVideoList();
    }
  }
</script>

<style scoped>
  .video-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .filter-table td {
    height: 40px;
  }
  .filter-table-label {
    width: 80px;
    white-space: nowrap;
  }
</style>