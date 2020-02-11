<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>所有视频</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>所有视频</h1>
      <p>天钿Daily收录B站<a href="https://www.bilibili.com/v/music/vocaloid/" target="_blank">VOCALOID·UTAU</a>分区下的所有视频和部分其他分区中的VC视频。</p>
      <a-alert style="margin-bottom: 8px" message="播放、弹幕等数据并非时时数据，最低每24小时更新一次" banner />
      <a-alert style="margin-bottom: 8px" message="点击视频列表查看详细信息" banner type="info"/>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <a-auto-complete
          placeholder="视频aid"
          v-model="videoAidInput"
          @change="onAidInputChange"
          optionLabelProp="text"
          allowClear
          style="width: calc(100% - 72px); margin-right: 8px"
      >
        <template slot="dataSource">
          <a-select-option v-for="item in videoAidTitleListStringified" :key="item.aid" :text="item.aid" >
            {{ item.aid }} - {{ item.title }}
          </a-select-option>
        </template>
      </a-auto-complete>
      <a-button type="primary" @click="goAidJump">跳转</a-button>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <a-collapse :activeKey="[1]" style="margin-bottom: 8px">
        <a-collapse-panel header="筛选搜索" key="1">
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
                活跃程度
              </td>
              <td>
                <a-radio-group name="activitySelector" v-model="activityValue">
                  <a-radio :value="0">所有视频</a-radio>
                  <a-radio :value="1">活跃视频</a-radio>
                  <a-radio :value="2">热门视频</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td class="filter-table-label">
                最近投稿
              </td>
              <td>
                <a-radio-group name="recentSelector" v-model="recentValue">
                  <a-radio :value="0">所有视频</a-radio>
                  <a-radio :value="1">本周新作</a-radio>
                  <a-radio :value="2">本日新作</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td class="filter-table-label">
                排序依据
              </td>
              <td>
                <a-radio-group name="orderSelector" v-model="orderValue">
                  <a-radio :value="1">投稿时间</a-radio>
                  <a-radio :value="2">播放</a-radio>
                  <a-radio :value="3">弹幕</a-radio>
                  <a-radio :value="4">评论</a-radio>
                  <a-radio :value="5">收藏</a-radio>
                  <a-radio :value="6">硬币</a-radio>
                  <a-radio :value="7">分享</a-radio>
                  <a-radio :value="8">点赞</a-radio>
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
                    @change="handlePubdateStartChange"
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
                    @change="handlePubdateEndChange"
                    @openChange="handlePubdateEndOpenChange"
                    style="margin-right: 8px"
                />
                <a-select
                    style="width: 100px"
                    placeholder="快速选择"
                    v-model="pubdateSelectValue"
                    @change="handlePubdateSelectChange">
                  <a-select-option value="custom">自定义</a-select-option>
                  <a-select-option value="day">本日</a-select-option>
                  <a-select-option value="week">本周</a-select-option>
                  <a-select-option value="month">本月</a-select-option>
                  <a-select-option value="year">本年</a-select-option>
                </a-select>
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
      <a-spin :spinning="isLoadingVideoList">
        <tdd-video-list
            :video-list="videoList"
            mode="grid"
            @item-clicked="videoListItemClickedHandler"
        ></tdd-video-list>
        <a-pagination
            showQuickJumper
            v-model="pagiCurrent"
            :total="videoTotalCount"
            :showTotal="total => `共 ${total} 个视频`"
            :pageSize="20"
            style="margin-top: 8px"
            @change="onPagiChange"
        />
      </a-spin>
    </div>
  </div>
</template>

<script>
  import { Modal } from 'ant-design-vue';
  import moment from 'moment';
  import TddVideoList from "./common/TddVideoList";

  export default {
    name: "VideoHome",
    components: {
      TddVideoList
    },
    data: function() {
      return {
        videoAidInput: undefined,
        isLoadingVideoAidTitleList: false,
        videoAidTitleList: [],
        videoList: [],
        isLoadingVideoList: false,
        lastLoadVideoListDate: null,
        isvcValue: 2,
        activityValue: 0,
        recentValue: 0,
        orderValue: 1,
        orderDescValue: 1,
        pubdateStartValue: null,
        pubdateEndValue: null,
        pubdateEndOpen: false,
        pubdateSelectValue: undefined,
        titleValue: '',
        memberNameValue: '',
        pagiCurrent: 1,
        videoTotalCount: 0
      }
    },
    computed: {
      videoAidTitleListStringified: function () {
        return this.videoAidTitleList.map(x => {
          let obj = {};
          obj.aid = '' + x.aid;
          obj.title = x.title;
          return obj;
        });
      }
    },
    methods: {
      goAidJump: function () {
        if (this.videoAidInput) {
          this.$router.push('/video/av' + this.videoAidInput);
        }
      },
      onAidInputChange: function () {
        if (this.videoAidInput && this.videoAidInput.length >= 4) {
          this.fetchVideoAidTileList();
        } else {
          this.videoAidTitleList = [];
        }
      },
      fetchVideoAidTileList: function () {
        this.isLoadingVideoAidTitleList = true;
        if ('' + parseInt(this.videoAidInput) !== this.videoAidInput) {
          this.isLoadingVideoAidTitleList = false;
          return;
        }
        let url = 'video/aidtitle?aid=' + this.videoAidInput;
        let that = this;
        this.$axios.get(url)
          .then(function (response) {
            that.videoAidTitleList = response.data;
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            that.isLoadingVideoAidTitleList = false;
          });
      },
      videoListItemClickedHandler: function (item) {
        this.$store.commit('setVideoDetailDrawerVideo', item);
        this.$store.commit('setVideoDetailDrawerVisibility', true);
      },
      checkParams: function() {
        // TODO
        return true;
      },
      assembleQueryUrl: function() {
        let url = "video?";
        // vc
        if (this.isvcValue === 2) {
          url += 'vc=1&';
        }
        // activity
        if (this.activityValue) {
          url += 'activity=' + this.activityValue + '&';
        }
        // recent
        if (this.recentValue) {
          url += 'recent=' + this.recentValue + '&';
        }
        // start_ts
        if (this.pubdateStartValue) {
          url += 'start_ts=' + Math.floor(this.pubdateStartValue.toDate().valueOf() / 1000) + '&';
        }
        // end_ts
        if (this.pubdateEndValue) {
          url += 'end_ts=' + Math.floor(this.pubdateEndValue.toDate().valueOf() / 1000) + '&';
        }
        // title
        if (this.titleValue) {
          url += 'title=' + this.titleValue + '&';
        }
        // up
        if (this.memberNameValue) {
          url += 'up='+ this.memberNameValue + '&';
        }
        // order_by
        switch (this.orderValue) {
          case 2:
            url += 'order_by=view&';
            break;
          case 3:
            url += 'order_by=danmaku&';
            break;
          case 4:
            url += 'order_by=reply&';
            break;
          case 5:
            url += 'order_by=favorite&';
            break;
          case 6:
            url += 'order_by=coin&';
            break;
          case 7:
            url += 'order_by=share&';
            break;
          case 8:
            url += 'order_by=like&';
            break;
          case 1:
          default:
            url += 'order_by=pubdate&';
            break;
        }
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
        this.isLoadingVideoList = true;
        if (!this.checkParams()) {
          this.isLoadingVideoList = false;
          return;
        }

        let url = this.assembleQueryUrl();
        let that = this;
        this.$axios.get(url)
          .then(function (response) {
            that.videoList = response.data;
            that.videoTotalCount = parseInt(response.headers['x-total-count']);
            that.lastLoadVideoListDate = new Date();
          })
          .catch(function (error) {
            let title = error.response.data.code + ' - ' + error.response.data.message;
            let content = JSON.stringify(error.response.data.detail);
            if (error.response.data.code === 40001) {
              title = '请求参数出错';
              content = '请检查筛选搜索条件。' + JSON.stringify(error.response.data);
            }
            Modal.error({
              title: title,
              content: content
            });
          })
          .finally(function () {
            that.isLoadingVideoList = false;
          });
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
      handlePubdateStartChange() {
        if (this.pubdateSelectValue !== 'custom') {
          this.pubdateSelectValue = 'custom';
        }
      },
      handlePubdateStartOpenChange(open) {
        if (!open) {
          if (this.pubdateStartValue != null && this.pubdateEndValue == null) {
            this.pubdateEndOpen = true;
          }
        }
      },
      handlePubdateEndChange() {
        if (this.pubdateSelectValue !== 'custom') {
          this.pubdateSelectValue = 'custom';
        }
      },
      handlePubdateEndOpenChange(open) {
        this.pubdateEndOpen = open;
      },
      handlePubdateSelectChange(value) {
        switch (value) {
          case 'custom':
            this.pubdateStartValue = null;
            this.pubdateEndValue = null;
            break;
          case 'day':
          case 'week':
          case 'month':
          case 'year':
            this.pubdateStartValue = moment().startOf(value);
            this.pubdateEndValue = moment().endOf(value);
            break;
          default:
            break;
        }
      },
      handleSearchButtonClick: function() {
        if (!this.isLoadingVideoList) {
          this.pagiCurrent = 1;
          this.fetchVideoList();
        }
      },
      handleReloadButtonClick: function() {
        this.isvcValue = 2;
        this.orderValue = 1;
        this.orderDescValue = 1;
        this.pubdateStartValue = null;
        this.pubdateEndValue = null;
        this.pubdateEndOpen = false;
        this.pubdateSelectValue = undefined;
        this.titleValue = '';
        this.memberNameValue = '';
      },
      onPagiChange: function (pagiClick) {
        this.pagiCurrent = pagiClick;
        this.fetchVideoList();
      },
    },
    created() {
      this.fetchVideoList();
    }
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


</style>