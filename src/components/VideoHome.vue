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
      <p>注意：播放、弹幕等数据并非时时数据，一般每天更新一次；点击视频列表查看详细信息。</p>
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
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <a-spin :spinning="isLoadingVideoList">
        <a-list itemLayout="vertical" size="large" :dataSource="videoList">
          <a-list-item
              slot="renderItem"
              slot-scope="item"
              key="item.id"
          >
            <div class="video-item" @click="videoItemClickHandler(item.id)">
              <div v-if="$store.getters.clientMode === 'MOBILE'">
                <div style="float: left; width: 116px">
                  <img width="108px" height="65px" alt="pic" :src="item.pic"/>
                </div>
                <div style="height: 65px">
                  <span class="video-title-mobile" style="margin-bottom: 4px">
                    {{ item.title }}
                  </span>
                  <span>
                    <a-icon type="user" class="stat-item-icon"/>
                    {{ item.member ? item.member.name : 'mid'+item.mid}}
                    <a-icon type="play-circle" class="stat-item-icon" style="margin-left: 8px;"/>
                    {{ item.laststat ? item.laststat.view: -1 }}
                  </span>
                </div>
              </div>
              <div v-else>
                <a-row >
                  <a-col :xs="24" :sm="8" :md="6" :xl="4" style="padding: 8px">
                    <img width="100%" height="100%" alt="pic" :src="item.pic"/>
                  </a-col>
                  <a-col :xs="24" :sm="16" :md="18" :xl="20" style="padding: 8px">
                    <h3 class="video-title" style="">{{ item.title }}</h3>
                    <p>
                      <a-icon type="user" style="margin-right: 4px"/>
                      {{ item.member ? item.member.name : 'mid'+item.mid}}
                      <a-icon type="calendar" style="margin-left: 8px; margin-right: 4px"/>
                      {{ tsToStr(item.pubdate) }}
                      <br/>
                      <span class="stat-item"><a-icon type="play-circle" class="stat-item-icon" />{{ item.laststat ? item.laststat.view: -1 }} </span><span class="vertical-separator">|</span>
                      <span class="stat-item"><a-icon type="profile" class="stat-item-icon" />{{ item.laststat ? item.laststat.danmaku: -1 }} </span><span class="vertical-separator">|</span>
                      <span class="stat-item"><a-icon type="message" class="stat-item-icon" />{{ item.laststat ? item.laststat.reply: -1 }} </span><span class="vertical-separator">|</span>
                      <span class="stat-item"><a-icon type="star" class="stat-item-icon" />{{ item.laststat ? item.laststat.favorite: -1 }} </span><span class="vertical-separator">|</span>
                      <span class="stat-item"><a-icon type="dollar" class="stat-item-icon" />{{ item.laststat ? item.laststat.coin: -1 }} </span><span class="vertical-separator">|</span>
                      <span class="stat-item"><a-icon type="share-alt" class="stat-item-icon" />{{ item.laststat ? item.laststat.share: -1 }} </span><span class="vertical-separator">|</span>
                      <span class="stat-item"><a-icon type="like" class="stat-item-icon" />{{ item.laststat ? item.laststat.like: -1 }} </span>
                    </p>
                  </a-col>
                </a-row>
              </div>
            </div>
          </a-list-item>
        </a-list>
        <div v-if="$store.getters.clientMode === 'MOBILE'">
          <div style="height: 8px" />
        </div>
        <a-pagination
            showQuickJumper
            v-model="pagiCurrent"
            :total="videoTotalCount"
            :showTotal="total => `共 ${total} 个视频`"
            :pageSize="20"
            @change="onPagiChange"
        />
      </a-spin>
    </div>
    <div v-if="videoDetailDrawerCurrentVideo">
      <a-drawer
          :title="'av' + videoDetailDrawerCurrentVideo.aid.toString()"
          placement="right"
          :closable="false"
          @close="videoDetailDrawerCloseHandler"
          :visible="videoDetailDrawerVisible"
          :width="videoDetailDrawerWidth + 'px'"
      >
        <h3>{{ videoDetailDrawerCurrentVideo.title }}</h3>
        <p>
          <a-avatar
              size="small"
              :src="videoDetailDrawerCurrentVideo.member
                ? videoDetailDrawerCurrentVideo.member.face
                : 'https://static.hdslb.com/images/member/noface.gif'"
              style="margin-right:12px"
          />
          <a :href="'https://space.bilibili.com/'+videoDetailDrawerCurrentVideo.mid" target="_blank">
            {{ videoDetailDrawerCurrentVideo.member ? videoDetailDrawerCurrentVideo.member.name : 'mid'+videoDetailDrawerCurrentVideo.mid}}
          </a>
        </p>
        <p><a-icon type="calendar" style="margin-right: 12px"/>{{ tsToStr(videoDetailDrawerCurrentVideo.pubdate) }}</p>
        <p><a-icon type="database" style="margin-right: 12px"/>{{ videoDetailDrawerCurrentVideo.tname }}</p>
        <a-divider orientation="left">简介</a-divider>
        {{ videoDetailDrawerCurrentVideo.desc }}
        <a-divider orientation="left">标签</a-divider>
        <a-tag
            v-for="tag in videoDetailDrawerCurrentVideo.tags
              ? videoDetailDrawerCurrentVideo.tags.split(';').slice(0, -1)
              : []"
            :key="tag"
            style="margin-bottom: 4px"
        >
          {{ tag }}
        </a-tag>
        <a-divider orientation="left">数据</a-divider>
        <div v-if="videoDetailDrawerCurrentVideo.laststat">
          <ul style="padding-left: 20px">
            <li><a-icon type="play-circle" class="stat-item-icon" />播放：{{ videoDetailDrawerCurrentVideo.laststat.view }}</li>
            <li><a-icon type="profile" class="stat-item-icon" />弹幕：{{ videoDetailDrawerCurrentVideo.laststat.danmaku }}</li>
            <li><a-icon type="message" class="stat-item-icon" />评论：{{ videoDetailDrawerCurrentVideo.laststat.reply }}</li>
            <li><a-icon type="star" class="stat-item-icon" />收藏：{{ videoDetailDrawerCurrentVideo.laststat.favorite }}</li>
            <li><a-icon type="dollar" class="stat-item-icon" />硬币：{{ videoDetailDrawerCurrentVideo.laststat.coin }}</li>
            <li><a-icon type="share-alt" class="stat-item-icon" />分享：{{ videoDetailDrawerCurrentVideo.laststat.share }}</li>
            <li><a-icon type="like" class="stat-item-icon" />点赞：{{ videoDetailDrawerCurrentVideo.laststat.like }}</li>
          </ul>
          *{{ tsToStr(videoDetailDrawerCurrentVideo.laststat.added) }}更新
        </div>
        <div v-else>
          <a-alert type="error" message="暂无数据" />
        </div>
        <a-divider orientation="left">其他</a-divider>
        <div v-if="videoDetailDrawerCurrentVideo.isvc == 1">
          <a-tag color="pink">VC</a-tag>
        </div>
        <div class="fake-drawer-footer"></div>
        <div class="drawer-footer">
          <div @click="$router.push('/video/av'+videoDetailDrawerCurrentVideo.aid)"
               :style="{ width: videoDetailDrawerWidth / 2 + 'px'}">
              <a-icon type="line-chart" title="详细数据" style="margin-right: 8px"/>详细数据
          </div>
          <div @click="videoViewClickHandler(videoDetailDrawerCurrentVideo.aid)"
               :style="{ width: videoDetailDrawerWidth / 2 + 'px'}">
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
        orderDescValue: 1,
        pubdateStartValue: null,
        pubdateEndValue: null,
        pubdateEndOpen: false,
        titleValue: '',
        memberNameValue: '',
        pagiCurrent: 1,
        videoTotalCount: 0,
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
      },
      videoDetailDrawerWidth: function() {
        return Math.min(this.$store.state.clientWidth * 0.7, 512);
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
          if (this.pubdateStartValue != null && this.pubdateEndValue == null) {
            this.pubdateEndOpen = true;
          }
        }
      },
      handlePubdateEndOpenChange(open) {
        this.pubdateEndOpen = open;
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
        this.titleValue = '';
        this.memberNameValue = '';
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
  .video-title-mobile {
    height: 40px;
    color: rgba(0, 0, 0, 0.85);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
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
  .vertical-separator {
    color: #e8e8e8;
    margin-left: 4px;
    margin-right: 8px;
  }
  .stat-item {
    white-space: nowrap;
  }
  .stat-item-icon {
    margin-right: 8px;
  }
  .drawer-footer {
    position: fixed;
    bottom: 0;
    background: #fafafa;
    width: 100%;
    margin-left: -24px;
    border-top: 1px solid #e8e8e8;
    cursor: pointer;
  }
  .drawer-footer div {
    float: left;
    height: 48px;
    text-align: center;
    border-left: 1px solid #e8e8e8;
    padding-top: 14px;
  }
  .drawer-footer div:hover {
    background: #e8e8e8;
  }
  .fake-drawer-footer {
    height: 48px;
  }
  /* MOBILE version */
  @media only screen and (max-width: 576px) {
    .stat-item-icon {
      margin-right: 4px;
    }
  }
</style>

<style>
  :global(.ant-pagination-options) {
    display: inline-block;
  }
  :global(.ant-pagination li) {
    margin-bottom: 8px;
  }
</style>