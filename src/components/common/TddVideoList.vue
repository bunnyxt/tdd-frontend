<template>
  <a-list
      :itemLayout="displayMode === 'list' ? 'vertical' : ''"
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
          <img class="tdd-video-item-mobile-cover-pic" width="108px" height="65px" alt="pic" :src="item.pic"/>
          <div class="tdd-video-item-mobile-right-content">
            <div class="tdd-video-item-mobile-title">
              {{ item.title }}
            </div>
            <div class="tdd-video-item-mobile-right-content-footer">
              <div>
                <a-avatar
                    :src="item.member ? item.member.face : 'https://static.hdslb.com/images/member/noface.gif'"
                    :size="16"
                    style="margin-right: 4px; margin-bottom: 1px"
                />
                {{ item.member ? item.member.name : 'mid'+item.mid }}
              </div>
              <div>
                <a-icon type="play-circle" class="stat-item-icon"/>
                {{ item.laststat ? item.laststat.view : -1 }}
              </div>
            </div>
          </div>
        </div>
        <div class="tdd-video-item-mobile-bottom-content">
          <slot name="bottom-content"></slot>
        </div>
      </template>
      <template v-else>
        <template v-if="displayMode === 'list'">
          <a-row>
            <a-col :xs="24" :sm="8" :md="6" :lg="5" :xl="4" style="padding-left: 12px">
              <img width="100%" height="100%" alt="pic" :src="item.pic"/>
            </a-col>
            <a-col :xs="24" :sm="16" :md="18" :lg="19" :xl="20" style="padding-left: 12px">
              <h3 class="tdd-video-item-desktop-title">{{ item.title }}</h3>
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
              <video-stat-bar :stat="item.laststat" :show-name="false" :mode="'bar'"></video-stat-bar>
            </a-col>
          </a-row>
        </template>
        <template v-if="displayMode === 'grid'">

        </template>
      </template>
    </a-list-item>
  </a-list>
</template>

<script>
  import VideoStatBar from "./VideoStatBar.vue";
  export default {
    name: 'TddVideoList',
    props: {
      videoList: Array,
      mode: String
    },
    components: {
      VideoStatBar
    },
    data: function () {
      return {

      }
    },
    computed: {
      displayMode: function () {
        if (this.mode === 'grid') {
          return 'grid';
        } else {
          return 'list';
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

  .tdd-video-item-desktop-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }


</style>