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
        <a-list itemLayout="vertical" size="large" :dataSource="videoList">
          <a-list-item
              slot="renderItem"
              slot-scope="item"
              key="item.id"
          >
            <div class="video-item" @click="videoItemClickHandler(item.id)">
            <a-row >
              <a-col :xs="24" :sm="8" :md="6" :xl="4" style="padding: 8px">
                <img width="100%" height="100%" alt="pic" :src="item.pic"/>
              </a-col>
              <a-col :xs="24" :sm="16" :md="18" :xl="20" style="padding: 8px">
                <a-tooltip placement="topLeft" >
                  <template slot="title">
                    {{ item.title }}
                  </template>
                  <h3 class="video-title" style="">{{ item.title }}</h3>
                </a-tooltip>
                <p>
                  <a-icon type="user" style="margin-right: 4px"/>
                  {{ item.member ? item.member.name : 'mid'+item.mid}}
                  <a-icon type="calendar" style="margin-left: 8px; margin-right: 4px"/>
                  {{ tsToStr(item.pubdate) }}
                </p>
<!--                <p>TODO: latest stat info</p>-->
                <p></p>
              </a-col>
            </a-row>
            </div>
          </a-list-item>
        </a-list>
        <a-pagination
            showQuickJumper
            v-model="pagiCurrent"
            :total="videoTotalCount"
            :pageSize="20"
            @change="onPagiChange"
        />
      </a-spin>
    </div>
    <div v-if="videoDetailDrawerCurrentVideo">
      <a-drawer
          :title="'av' + videoDetailDrawerCurrentVideo.aid.toString()"
          placement="right"
          :closable="true"
          @close="videoDetailDrawerCloseHandler"
          :visible="videoDetailDrawerVisible"
      >
        <h3>{{ videoDetailDrawerCurrentVideo.title }}</h3>
        <p>
          <a-avatar size="small" :src="videoDetailDrawerCurrentVideo.member.face" style="margin-right:12px"/>
          <a :href="'https://space.bilibili.com/'+videoDetailDrawerCurrentVideo.mid" target="_blank">
            {{ videoDetailDrawerCurrentVideo.member.name }}
          </a>
        </p>
        <p><a-icon type="calendar" style="margin-right: 12px"/>{{ tsToStr(videoDetailDrawerCurrentVideo.pubdate) }}</p>
        <p><a-icon type="database" style="margin-right: 12px"/>{{ videoDetailDrawerCurrentVideo.tname }}</p>
        <a-divider orientation="left">简介</a-divider>
        {{ videoDetailDrawerCurrentVideo.desc }}
        <a-divider orientation="left">标签</a-divider>
        <a-tag
            v-for="tag in videoDetailDrawerCurrentVideo.tags.split(';').slice(0, -1)"
            :key="tag"
            style="margin-bottom: 4px"
        >
          {{ tag }}
        </a-tag>
        <div class="fake-drawer-footer"></div>
        <div class="drawer-footer">
          <div @click="videoDetailClickHandler(videoDetailDrawerCurrentVideo.aid)">
              <a-icon type="line-chart" title="视频详情" style="margin-right: 8px"/>视频详情
          </div>
          <div @click="videoViewClickHandler(videoDetailDrawerCurrentVideo.aid)">
            <a-icon type="play-circle" title="观看视频" style="margin-right: 8px"/>观看视频
          </div>
        </div>
      </a-drawer>
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
        isvcValue: 2,
        orderValue: 1,
        pubdateStartValue: null,
        pubdateEndValue: null,
        pubdateEndOpen: false,
        titleValue: '',
        memberNameValue: '',
        pagiCurrent: 1,
        videoTotalCount: 20,
        videoDetailDrawerVisible: false,
        videoDetailDrawerCurrentIndex: 0
      }
    },
    computed: {
      videoDetailDrawerCurrentVideo: function() {
        if (this.videoList[this.videoDetailDrawerCurrentIndex]) {
          return this.videoList[this.videoDetailDrawerCurrentIndex];
        } else {
          return null;
        }
      }
    },
    methods: {
      checkParams: function() {
        // TODO
        return true;
      },
      assembleQueryUrl: function() {
        let url = "https://api.bunnyxt.com/tdd/v2/video?";
        // vc
        if (this.isvcValue === 2) {
          url += 'vc=1&';
        }
        // start_ts
        if (this.pubdateStartValue) {
          url += 'start_ts=' + Math.floor(this.pubdateStartValue.toDate().valueOf() / 1000) + '&';
        }
        // end_ts
        if (this.pubdateStartValue) {
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
        fetch(url)
          .then(response => {
            this.videoTotalCount = parseInt(response.headers.get("x-total-count"));
            return response
          })
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
          this.pagiCurrent = 1;
          this.fetchVideoList();
        }
      },
      onPagiChange: function (pagiClick) {
        this.pagiCurrent = pagiClick;
        this.fetchVideoList();
      },
      videoDetailDrawerCloseHandler: function() {
        this.videoDetailDrawerVisible = false;
      },
      videoItemClickHandler: function(id) {
        this.videoDetailDrawerVisible = true;
        for (let i = 0; i < this.videoTotalCount; i++) {
          if (this.videoList[i].id === id) {
            this.videoDetailDrawerCurrentIndex = i;
            break;
          }
        }
      },
      videoDetailClickHandler: function(aid) {
        this.$router.push('/video/av'+aid);
      },
      videoViewClickHandler: function(aid) {
        window.open('https://www.bilibili.com/video/av'+aid);
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
  .video-item {
    transition: all .3s;
  }
  .video-item:hover {
    cursor: pointer;
    -webkit-box-shadow: 0 2px 8px rgba(0,0,0,.09);
    -moz-box-shadow: 0 2px 8px rgba(0,0,0,.09);
    box-shadow: 0 2px 8px rgba(0,0,0,.09);
    border-color: rgba(0,0,0,.09);
  }
  .drawer-footer {
    position: fixed;
    bottom: 0;
    background: #FAFAFA;
    width: 100%;
    margin-left: -24px;
    border-top: 1px solid #e8e8e8;
    cursor: pointer;
  }
  .drawer-footer div {
    float: left;
    width: 128px;
    height: 48px;
    text-align: center;
    border-left: 1px solid #e8e8e8;
    padding-top: 14px;
  }
  .fake-drawer-footer {
    height: 48px;
  }
</style>