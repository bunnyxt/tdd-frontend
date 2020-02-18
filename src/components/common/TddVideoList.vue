<template>
  <a-list
      :itemLayout="(mode === 'list' || $store.getters.clientMode === 'MOBILE') ? 'vertical' : ''"
      :grid="(mode === 'grid' && $store.getters.clientMode !== 'MOBILE') ? { gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 } : null"
      :dataSource="videoList"
  >
    <a-list-item
        slot="renderItem"
        slot-scope="item"
        key="item.id"
        @click="$emit('item-clicked', item)"
    >
      <template v-if="$store.getters.clientMode === 'MOBILE'">
        <div class="tdd-video-item-mobile">
<!--          <div style="width: 108px; height: 65px; float: left; margin-right: 8px">-->
<!--            <tdd-video-cover :src="item.pic" :video="item" />-->
<!--          </div>-->
          <img class="tdd-video-item-mobile-cover-pic" width="108px" height="65px" alt="pic" :src="item.pic"/>
          <div class="tdd-video-item-mobile-right-content">
            <div class="tdd-video-item-mobile-title">
              {{ item.title }}
            </div>
            <div class="tdd-video-item-mobile-right-content-footer">
              <div :style="{ width: showMobileView?'50%':'100%' }">
                <a-avatar
                    :src="item.member ? item.member.face : 'https://static.hdslb.com/images/member/noface.gif'"
                    :size="16"
                    style="margin-right: 4px; margin-bottom: 1px"
                />
                {{ item.member ? item.member.name : 'mid'+item.mid }}
              </div>
              <div v-if="showMobileView">
                <template v-if="mainProp === 'view'">
                  <a-icon type="play-circle" class="stat-item-icon" />
                  {{ item.laststat ? item.laststat.view : -1 }}
                </template>
                <template v-else-if="mainProp === 'danmaku'">
                  <a-icon type="profile" class="stat-item-icon" />
                  {{ item.laststat ? item.laststat.danmaku : -1 }}
                </template>
                <template v-else-if="mainProp === 'reply'">
                  <a-icon type="message" class="stat-item-icon" />
                  {{ item.laststat ? item.laststat.reply : -1 }}
                </template>
                <template v-else-if="mainProp === 'favorite'">
                  <a-icon type="star" class="stat-item-icon" />
                  {{ item.laststat ? item.laststat.favorite : -1 }}
                </template>
                <template v-else-if="mainProp === 'coin'">
                  <a-icon type="dollar" class="stat-item-icon" />
                  {{ item.laststat ? item.laststat.coin : -1 }}
                </template>
                <template v-else-if="mainProp === 'share'">
                  <a-icon type="share-alt" class="stat-item-icon" />
                  {{ item.laststat ? item.laststat.share : -1 }}
                </template>
                <template v-else-if="mainProp === 'like'">
                  <a-icon type="like" class="stat-item-icon" />
                  {{ item.laststat ? item.laststat.like : -1 }}
                </template>
                <template v-else-if="mainProp === 'pubdate'">
                  <a-icon type="calendar" class="stat-item-icon" />
                  {{ $util.tsToDateString(item.pubdate, 'HH:mm:ss') }}
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="tdd-video-item-mobile-bottom-content">
          <div class="tdd-video-item-mobile-sprint-board">
            <div style="margin-top: 4px" v-if="showSprintBoard">
              <div style="overflow: hidden">
                <div style="width: 50%; float: left">
                  当前播放：{{ item.last_record ? item.last_record.view : -1 }}
                </div>
                <div style="width: 50%; float: left">
                  昨日增加：{{ item.one_day_view ? item.one_day_view : -1}}
                </div>
              </div>
              <div style="overflow: hidden">
                <div style="width: 50%; float: left">
                  已用时间：{{ calcTimeSpanString(Math.floor(new Date().valueOf() / 1000) - item.created) }}
                </div>
                <div style="width: 50%; float: left">
                  预计剩余：{{ item.last_record && item.one_day_view > 0 ? calcTimeSpanString((1000000 - item.last_record.view) / item.one_day_view * 24 * 60 * 60) : -1}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <template v-if="mode === 'list'">
          <a-row>
            <a-col :xs="24" :sm="8" :md="6" :lg="5" :xl="4" style="padding-left: 12px">
              <tdd-video-cover :src="item.pic" :video="item" />
            </a-col>
            <a-col :xs="24" :sm="16" :md="18" :lg="19" :xl="20" style="padding-left: 12px">
              <h3 class="tdd-video-item-desktop-list-title">{{ item.title }}</h3>
              <div>
                <a-avatar
                    :src="item.member ? item.member.face : 'https://static.hdslb.com/images/member/noface.gif'"
                    :size="16"
                    style="margin-right: 4px; margin-bottom: 1px"
                />
                {{ item.member ? item.member.name : 'mid'+item.mid}}
                <a-icon type="calendar" style="margin-left: 8px; margin-right: 4px"/>
                {{ $util.tsToDateString(item.pubdate) }}
              </div>
              <div v-if="showStatBar">
                <tdd-video-stat-bar :stat="item.laststat" :show-name="false" :mode="'bar'"></tdd-video-stat-bar>
              </div>
              <div v-if="showSprintBoard">
                <div style="overflow: hidden">
                  <div style="width: 140px; float: left">
                    当前播放：{{ item.last_record ? item.last_record.view: -1 }}
                  </div>
                  <div style="width: 140px; float: left">
                    昨日增加：{{ item.one_day_view ? item.one_day_view : -1}}
                  </div>
                </div>
                <div style="overflow: hidden">
                  <div style="width: 140px; float: left">
                    已用时间：{{ calcTimeSpanString(Math.floor(new Date().valueOf() / 1000) - item.created) }}
                  </div>
                  <div style="width: 140px; float: left">
                    预计剩余：{{ item.last_record && item.one_day_view > 0 ? calcTimeSpanString((1000000 - item.last_record.view) / item.one_day_view * 24 * 60 * 60) : -1}}
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </template>
        <template v-if="mode === 'grid'">
          <div class="tdd-video-item-desktop-grid-card">
            <tdd-video-cover :src="item.pic" :video="item" />
            <div style="padding: 12px">
              <h3 class="tdd-video-item-desktop-grid-title">{{ item.title }}</h3>
              <div>
                <a-avatar
                    :src="item.member ? item.member.face : 'https://static.hdslb.com/images/member/noface.gif'"
                    :size="16"
                    style="margin-right: 4px; margin-bottom: 1px"
                />
                {{ item.member ? item.member.name : 'mid'+item.mid}}<br>
                <a-icon type="calendar" style="margin-right: 4px"/>
                {{ $util.tsToDateString(item.pubdate) }}
              </div>
              <div v-if="showStatBar">
                <tdd-video-stat-bar
                    class="tdd-video-item-desktop-grid-video-stat-bar"
                    :stat="item.laststat"
                    :show-name="false"
                    :mode="'bar'"
                ></tdd-video-stat-bar>
              </div>
              <div v-if="showSprintBoard">
                <div style="overflow: hidden">
                  <div style="width: 140px; float: left">
                    当前播放：{{ item.last_record ? item.last_record.view: -1 }}
                  </div>
                  <div style="width: 140px; float: left">
                    昨日增加：{{ item.one_day_view ? item.one_day_view : -1}}
                  </div>
                </div>
                <div style="overflow: hidden">
                  <div style="width: 140px; float: left">
                    已用时间：{{ calcTimeSpanString(Math.floor(new Date().valueOf() / 1000) - item.created) }}
                  </div>
                  <div style="width: 140px; float: left">
                    预计剩余：{{ item.last_record && item.one_day_view > 0 ? calcTimeSpanString((1000000 - item.last_record.view) / item.one_day_view * 24 * 60 * 60) : -1}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </a-list-item>
  </a-list>
</template>

<script>
  import TddVideoStatBar from "./TddVideoStatBar.vue";
  import TddVideoCover from "./TddVideoCover";

  export default {
    name: 'TddVideoList',
    props: {
      videoList: {
        type: Array,
        required: true
      },
      mode: {
        type: String,
        default: 'list'
      },
      mainProp: {
        type: String,
        default: function () {
          return 'view';
        }
      },
      showStatBar: {
        type: Boolean,
        default: true
      },
      showMobileView: {
        type: Boolean,
        default: true
      },
      showSprintBoard: {
        type: Boolean,
        default: false
      }
    },
    components: {
      TddVideoStatBar,
      TddVideoCover
    },
    data: function () {
      return {

      }
    },
    methods: {
      calcTimeSpanString: function (ts) {
        if (ts < 60) {
          return ts + '秒';
        } else if (ts < 60 * 60) {
          return Math.floor(ts / 60) + '分';
        } else if (ts < 60 * 60 * 24) {
          return Math.floor(ts / 60 / 60) + '时';
        } else {
          return Math.floor(ts / 60 / 60 / 24) + '日';
        }
      }
    }
  }
</script>

<style scoped>
  .tdd-video-item-mobile {
    overflow: hidden;
    width: 100%;
  }
  .tdd-video-item-mobile-cover-pic {
    float: left;
    margin-right: 8px;
  }
  .tdd-video-item-mobile-right-content {
    float: left;
    width: calc(100% - 116px);
  }
  .tdd-video-item-mobile-title {
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
  .tdd-video-item-mobile-right-content-footer {
    overflow: hidden;
    width: 100%;
  }
  .tdd-video-item-mobile-right-content-footer > div {
    float: left;
    width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 4px;
  }

  .tdd-video-item-desktop-list-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tdd-video-item-desktop-grid-card {
    transition: all .2s;
    border: 1px solid #e8e8e8;
  }
  .tdd-video-item-desktop-grid-card:hover {
    cursor: pointer;
    -webkit-box-shadow: 0 2px 8px rgba(0,0,0,.09);
    -moz-box-shadow: 0 2px 8px rgba(0,0,0,.09);
    box-shadow: 0 2px 8px rgba(0,0,0,.09);
    border-color: rgba(0,0,0,.09);
  }
  .tdd-video-item-desktop-grid-title {
    height: 48px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .tdd-video-item-desktop-grid-video-stat-bar {
    height: 42px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .stat-item-icon {
    margin-right: 4px;
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
</style>