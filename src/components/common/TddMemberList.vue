<template>
  <a-list
      :data-source="memberList"
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
              :src="item.face ? item.face : 'https://static.hdslb.com/images/member/noface.gif'"
              :size="48"
          />
          <div class="tdd-member-item-mobile-content">
            <div class="tdd-member-item-mobile-title">
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
                {{ item.video_count }}
              </div>
              <div style="width: 60%">
                <template v-if="mainProp === 'sr_view'">
                  <a-icon type="play-circle" class="stat-item-icon" />
                  {{ item.last_total_stat ? item.last_total_stat.view : -1 }}
                </template>
                <template v-else-if="mainProp === 'sr_danmaku'">
                  <a-icon type="profile" class="stat-item-icon" />
                  {{ item.last_total_stat ? item.last_total_stat.danmaku : -1 }}
                </template>
                <template v-else-if="mainProp === 'sr_reply'">
                  <a-icon type="message" class="stat-item-icon" />
                  {{ item.last_total_stat ? item.last_total_stat.reply : -1 }}
                </template>
                <template v-else-if="mainProp === 'sr_favorite'">
                  <a-icon type="star" class="stat-item-icon" />
                  {{ item.last_total_stat ? item.last_total_stat.favorite : -1 }}
                </template>
                <template v-else-if="mainProp === 'sr_coin'">
                  <a-icon type="dollar" class="stat-item-icon" />
                  {{ item.last_total_stat ? item.last_total_stat.coin : -1 }}
                </template>
                <template v-else-if="mainProp === 'sr_share'">
                  <a-icon type="share-alt" class="stat-item-icon" />
                  {{ item.last_total_stat ? item.last_total_stat.share : -1 }}
                </template>
                <template v-else-if="mainProp === 'sr_like'">
                  <a-icon type="like" class="stat-item-icon" />
                  {{ item.last_total_stat ? item.last_total_stat.like : -1 }}
                </template>
                <template v-else-if="mainProp === 'v_pubdate'">
                  <a-icon type="calendar" class="stat-item-icon" />
                  {{ $util.tsToDateString(item.last_video ? item.last_video.pubdate : 0, 'MM-dd HH:mm:ss') }}
                </template>
                <template v-else-if="mainProp === 'fr_follower'">
                  <a-icon type="team" class="stat-item-icon" />
                  {{ item.last_follower ? item.last_follower.follower : -1 }}
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        {{ item.name }}
      </template>
    </a-list-item>
  </a-list>
</template>

<script>
  import { Icon } from 'ant-design-vue';

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
      IconFont
    },
    data: function () {
      return {

      }
    },
    methods: {

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