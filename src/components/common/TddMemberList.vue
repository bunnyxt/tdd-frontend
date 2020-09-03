<template>
  <a-list
    :data-source="memberList"
    :itemLayout="$store.getters.clientMode === 'MOBILE' ? 'vertical' : ''"
    :grid="$store.getters.clientMode !== 'MOBILE' ? { gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 } : null"
  >
    <a-list-item
      slot="renderItem"
      slot-scope="item"
      key="item.id"
      @click="$emit('item-clicked', item)"
    >
      <template v-if="$store.getters.clientMode === 'MOBILE'">
        <div class="tdd-member-item-mobile">
          <a-avatar
            class="tdd-member-item-mobile-avatar"
            :src="item.face ? $util.httpS(item.face) : 'https://static.hdslb.com/images/member/noface.gif'"
            :size="48"
          />
          <div class="tdd-member-item-mobile-content">
            <div class="tdd-member-item-mobile-title" :title="item.name">
              <span style="color: rgba(0, 0, 0, 0.85); margin-right: 8px">{{ item.name }}</span>
              <template v-if="item.sex === '男'">
                <span style="color: #00b5f6">
                  <icon-font type="icon-xingbie-nan" />
                </span>
              </template>
              <template v-else-if="item.sex === '女'">
                <span style="color: #f9a9f8">
                  <icon-font type="icon-xingbie-nv" />
                </span>
              </template>
              <template v-else-if="item.sex === '保密'">
                <span style="color: rgba(183,183,183,0.95)">
                  <icon-font type="icon-xingbie-weizhi" />
                </span>
              </template>
            </div>
            <div class="tdd-member-item-mobile-right-content-footer">
              <div style="width: 40%">
                <a-icon type="video-camera" class="stat-item-icon" />
                {{ item.video_count.toLocaleString() }}
              </div>
              <div style="width: 60%">
                <template v-if="mainProp === 'sr_view'">
                  <a-icon type="play-circle" class="stat-item-icon" />
                  {{ item.last_total_stat ? item.last_total_stat.view.toLocaleString() : -1 }}
                </template>
                <template v-else-if="mainProp === 'sr_danmaku'">
                  <a-icon type="profile" class="stat-item-icon" />
                  {{ item.last_total_stat ? item.last_total_stat.danmaku.toLocaleString() : -1 }}
                </template>
                <template v-else-if="mainProp === 'sr_reply'">
                  <a-icon type="message" class="stat-item-icon" />
                  {{ item.last_total_stat ? item.last_total_stat.reply.toLocaleString() : -1 }}
                </template>
                <template v-else-if="mainProp === 'sr_favorite'">
                  <a-icon type="star" class="stat-item-icon" />
                  {{ item.last_total_stat ? item.last_total_stat.favorite.toLocaleString() : -1 }}
                </template>
                <template v-else-if="mainProp === 'sr_coin'">
                  <a-icon type="dollar" class="stat-item-icon" />
                  {{ item.last_total_stat ? item.last_total_stat.coin.toLocaleString() : -1 }}
                </template>
                <template v-else-if="mainProp === 'sr_share'">
                  <a-icon type="share-alt" class="stat-item-icon" />
                  {{ item.last_total_stat ? item.last_total_stat.share.toLocaleString() : -1 }}
                </template>
                <template v-else-if="mainProp === 'sr_like'">
                  <a-icon type="like" class="stat-item-icon" />
                  {{ item.last_total_stat ? item.last_total_stat.like.toLocaleString() : -1 }}
                </template>
                <template v-else-if="mainProp === 'v_pubdate'">
                  <a-icon type="calendar" class="stat-item-icon" />
                  {{ $util.tsToDateString(item.last_video ? item.last_video.pubdate : 0, 'MM-dd HH:mm:ss') }}
                </template>
                <template v-else-if="mainProp === 'fr_follower'">
                  <a-icon type="team" class="stat-item-icon" />
                  {{ item.last_follower ? item.last_follower.follower.toLocaleString() : -1 }}
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="tdd-member-item-desktop-grid-card">
          <div class="tdd-member-item-desktop-grid-header">
            <a-avatar
              class="tdd-member-item-desktop-grid-avatar"
              :src="item.face ? $util.httpS(item.face) : 'https://static.hdslb.com/images/member/noface.gif'"
              :size="48"
            />
            <div class="tdd-member-item-desktop-grid-content">
              <div class="tdd-member-item-desktop-grid-title" :title="item.name">
                <span style="font-size: 1.17em; color: rgba(0, 0, 0, 0.85); font-weight: 500">{{ item.name }}</span>
                <template v-if="item.sex === '男'">
                  <span class="tdd-member-item-desktop-grid-title-sex" style="color: #00b5f6">
                    <icon-font type="icon-xingbie-nan" />
                  </span>
                </template>
                <template v-else-if="item.sex === '女'">
                  <span class="tdd-member-item-desktop-grid-title-sex" style="color: #f9a9f8">
                    <icon-font type="icon-xingbie-nv" />
                  </span>
                </template>
                <template v-else-if="item.sex === '保密'">
                  <span class="tdd-member-item-desktop-grid-title-sex" style="color: rgba(183,183,183,0.95)">
                    <icon-font type="icon-xingbie-weizhi" />
                  </span>
                </template>
              </div>
              <div class="tdd-member-item-desktop-grid-follower">
                <a-icon type="video-camera" class="stat-item-icon" />
                {{ item.video_count.toLocaleString() }}
                <a-icon type="team" class="stat-item-icon" style="margin-left: 12px" />
                {{ item.last_follower ? item.last_follower.follower.toLocaleString() : -1 }}
              </div>
            </div>
          </div>
          <a-tooltip>
            <template slot="title">
              <tdd-video-stat-bar :stat="item.last_total_stat" />
            </template>
            <div class="tdd-member-item-desktop-grid-stat-bar" style="margin-top: 8px">
              <tdd-video-stat-bar :stat="item.last_total_stat" />
            </div>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">
              {{ item.last_video ? item.last_video.title : '' }}<br>
              <a-icon type="calendar" style="margin-right: 4px" />
              {{ $util.tsToDateString(item.last_video ? item.last_video.pubdate : 0) }}
              <tdd-video-stat-bar :stat="item.last_video ? item.last_video.laststat : null" style="margin: 8px 0" />
              点击查看视频详情
            </template>
            <div
              class="tdd-member-item-desktop-grid-last-video"
              @click.stop="itemLastVideoClickHandler(item.last_video ? item.last_video.aid : -1)"
              style="margin-top: 8px"
            >
              <img
                class="tdd-member-item-desktop-grid-last-video-cover-pic"
                width="108px" height="65px" alt="pic" :src="item.last_video ? $util.httpS(item.last_video.pic) : ''"
              />
              <div class="tdd-member-item-desktop-grid-last-video-right-content">
                <div class="tdd-member-item-desktop-grid-last-video-title">
                  {{ item.last_video ? item.last_video.title : null }}
                </div>
                <div class="tdd-member-item-desktop-grid-last-video-pubdate">
                  <a-icon type="calendar" style="margin-right: 4px" />
                  {{ $util.tsToDateString(item.last_video ? item.last_video.pubdate : 0) }}
                </div>
              </div>
            </div>
          </a-tooltip>
        </div>
      </template>
    </a-list-item>
  </a-list>
</template>

<script>
import { Icon } from 'ant-design-vue';
import TddVideoStatBar from "./TddVideoStatBar";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1640736_mzfdr5d9c2h.js',
});

export default {
  name: 'TddMemberList',
  props: {
    memberList: {
      type: Array,
      required: true
    },
    mainProp: {
      type: String,
      default: function () {
        return 'sr_view';
      }
    }
  },
  components: {
    IconFont,
    TddVideoStatBar
  },
  data: function () {
    return {

    }
  },
  methods: {
    itemLastVideoClickHandler: function (aid) {
      this.$router.push('video/av' + aid);
    }
  }
}
</script>

<style scoped>
.tdd-member-item-mobile {
  width: 100%;
  overflow: hidden;
}
.tdd-member-item-mobile-avatar {
  float: left;
  margin-right: 12px;
}
.tdd-member-item-mobile-content {
  float: left;
  width: calc(100% - 60px);
  overflow: hidden;
}
.tdd-member-item-mobile-title {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tdd-member-item-mobile-right-content-footer {
  margin-top: 6px;
  overflow: hidden;
}
.tdd-member-item-mobile-right-content-footer div {
  float: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.stat-item-icon {
  margin-right: 4px;
}

.tdd-member-item-desktop-grid-card {
  transition: all .2s;
  border: 1px solid #e8e8e8;
  padding: 12px;
}
.tdd-member-item-desktop-grid-card:hover {
  cursor: pointer;
  -webkit-box-shadow: 0 2px 8px rgba(0,0,0,.09);
  -moz-box-shadow: 0 2px 8px rgba(0,0,0,.09);
  box-shadow: 0 2px 8px rgba(0,0,0,.09);
  border-color: rgba(0,0,0,.09);
}
.tdd-member-item-desktop-grid-header {
  overflow: hidden;
}
.tdd-member-item-desktop-grid-avatar {
  float: left;
  margin-right: 12px;
}
.tdd-member-item-desktop-grid-content {
  float: left;
  width: calc(100% - 60px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tdd-member-item-desktop-grid-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tdd-member-item-desktop-grid-title-sex {
  font-size: 1.17em;
  margin-top: 4px;
  margin-left: 8px;
}
.tdd-member-item-desktop-grid-follower {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tdd-member-item-desktop-grid-stat-bar {
  height: 63px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.tdd-member-item-desktop-grid-last-video {
  overflow: hidden;
}
.tdd-member-item-desktop-grid-last-video-cover-pic {
  float: left;
  margin-right: 8px;
}
.tdd-member-item-desktop-grid-last-video-right-content {
  float: left;
  width: calc(100% - 116px);
}
.tdd-member-item-desktop-grid-last-video-title {
  height: 40px;
  width: 100%;
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.85);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.tdd-member-item-desktop-grid-last-video-pubdate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* overwrite ant design style */
/* add list item hover shadow */
.ant-list-item {
  transition: all .2s;
}
.ant-list-item:hover {
  cursor: pointer;
  -webkit-box-shadow: 0 2px 8px rgba(0,0,0,.09);
  -moz-box-shadow: 0 2px 8px rgba(0,0,0,.09);
  box-shadow: 0 2px 8px rgba(0,0,0,.09);
  border-color: rgba(0,0,0,.09);
}
.ant-divider-inner-text {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}
</style>
