<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "click_view_video_detail_prompt": "点击查看视频详情"
  },
  "en": {
    "click_view_video_detail_prompt": "Click to view video detail."
  }
}
</i18n>

<template>
  <a-table
    :columns="columns"
    :rowKey="member => member.id"
    :dataSource="memberList"
    :pagination="false"
    :scroll="{ x: 1300 }"
    size="small"
  >
    <template #face="item">
      <router-link :to="'/member/'+item.mid">
        <a-avatar
          :src="item.face ? $util.httpS(item.face) : 'https://static.hdslb.com/images/member/noface.gif'"
          :size="48"
        />
      </router-link>
    </template>
    <template #name="item">
      <div class="tdd-member-table-title">
        <router-link :to="'/member/'+item.mid">
          <span :title="item.sign">{{ item.name }}</span>
          <template v-if="item.sex === '男'">
            <span class="tdd-member-table-title-sex" style="color: #00b5f6">
              <icon-font type="icon-xingbie-nan" />
            </span>
          </template>
          <template v-else-if="item.sex === '女'">
            <span class="tdd-member-table-title-sex" style="color: #f9a9f8">
              <icon-font type="icon-xingbie-nv" />
            </span>
          </template>
          <template v-else-if="item.sex === '保密'">
            <span class="tdd-member-table-title-sex" style="color: rgba(183,183,183,0.95)">
              <icon-font type="icon-xingbie-weizhi" />
            </span>
          </template>
        </router-link>
      </div>
    </template>
    <template #added="added">
      {{ $util.tsToDateString(added) }}
    </template>
    <template #value="value">
      {{ value.toLocaleString() }}
    </template>
    <template #lastVideo="video">
      <a-tooltip>
        <template #title>
          {{ video ? video.title : '' }}<br>
          <a-icon type="calendar" style="margin-right: 4px" />
          {{ $util.tsToDateString(video ? video.pubdate : 0) }}
          <tdd-video-stat-bar :stat="video ? video.laststat : null" style="margin: 8px 0" />
          {{ $t('click_view_video_detail_prompt') }}
        </template>
        <img
          width="108px"
          height="65px"
          alt="pic"
          :src="$util.httpS(video.pic)"
          @click="() => $router.push('/video/av'+video.aid)"
          style="cursor: pointer"
        />
      </a-tooltip>
    </template>
  </a-table>
</template>

<script>
import { Icon } from 'ant-design-vue';
import TddVideoStatBar from "./TddVideoStatBar";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1640736_mzfdr5d9c2h.js',
});

export default {
  name: 'TddMemberTable',
  props: {
    memberList: {
      type: Array,
      required: true
    }
  },
  components: {
    IconFont,
    TddVideoStatBar
  },
  data: function () {
    return {
      columns: [
        {
          title: this.$t('face'),
          scopedSlots: { customRender: 'face' },
          width: '68px',
          fixed: 'left',
        }, {
          title: this.$t('name'),
          scopedSlots: { customRender: 'name' },
        }, {
          title: `${this.$t('follower_count')}`,
          dataIndex: 'last_follower.follower',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: `${this.$t('total_prefix')}${this.$t('video_count')}`,
          dataIndex: 'video_count',
          scopedSlots: { customRender: 'value' },
          width: '80px'
        }, {
          title: `${this.$t('total_prefix')}${this.$t('view')}`,
          dataIndex: 'last_total_stat.view',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: `${this.$t('total_prefix')}${this.$t('danmaku')}`,
          dataIndex: 'last_total_stat.danmaku',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: `${this.$t('total_prefix')}${this.$t('reply')}`,
          dataIndex: 'last_total_stat.reply',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: `${this.$t('total_prefix')}${this.$t('favorite')}`,
          dataIndex: 'last_total_stat.favorite',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: `${this.$t('total_prefix')}${this.$t('coin')}`,
          dataIndex: 'last_total_stat.coin',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: `${this.$t('total_prefix')}${this.$t('share')}`,
          dataIndex: 'last_total_stat.share',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: `${this.$t('total_prefix')}${this.$t('like')}`,
          dataIndex: 'last_total_stat.like',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: this.$t('latest_video'),
          dataIndex: 'last_video',
          scopedSlots: { customRender: 'lastVideo' },
          width: '120px',
        }, {
          title: this.$t('tdd_favorite_time'),
          dataIndex: 'favorite_added',
          scopedSlots: { customRender: 'added' },
          width: '108px',
        }
      ]
    }
  },
  methods: {
    videoPicClickHandler: function (item) {
      this.$store.commit('setVideoDetailDrawerVideo', item);
      this.$store.commit('setVideoDetailDrawerVisibility', true);
    }
  }
}
</script>

<style scoped>
.tdd-member-table-title {
  min-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.tdd-member-table-title-sex {
  margin-top: 4px;
  margin-left: 4px;
}
</style>
