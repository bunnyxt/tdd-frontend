<template>
  <a-table
    :columns="columns"
    :rowKey="member => member.id"
    :dataSource="memberList"
    :pagination="false"
    :scroll="{ x: 1300 }"
    size="small"
  >
    <template slot="face" slot-scope="item">
      <router-link :to="'/member/'+item.mid">
        <a-avatar
          :src="item.face ? item.face : 'https://static.hdslb.com/images/member/noface.gif'"
          :size="48"
        />
      </router-link>
    </template>
    <template slot="name" slot-scope="item">
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
    <template slot="added" slot-scope="added">
      {{ $util.tsToDateString(added) }}
    </template>
    <template slot="value" slot-scope="value">
      {{ value.toLocaleString() }}
    </template>
    <template slot="lastVideo" slot-scope="video">
      <a-tooltip>
        <template slot="title">
          {{ video ? video.title : '' }}<br>
          <a-icon type="calendar" style="margin-right: 4px" />
          {{ $util.tsToDateString(video ? video.pubdate : 0) }}
          <tdd-video-stat-bar :stat="video ? video.laststat : null" style="margin: 8px 0" />
          点击查看视频详情
        </template>
        <img
          width="108px"
          height="65px"
          alt="pic"
          :src="video.pic"
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
          title: '头像',
          scopedSlots: { customRender: 'face' },
          width: '68px',
          fixed: 'left',
        }, {
          title: '昵称',
          scopedSlots: { customRender: 'name' },
        }, {
          title: '粉丝数',
          dataIndex: 'last_follower.follower',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: '总投稿数',
          dataIndex: 'video_count',
          scopedSlots: { customRender: 'value' },
          width: '80px'
        }, {
          title: '总播放',
          dataIndex: 'last_total_stat.view',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: '总弹幕',
          dataIndex: 'last_total_stat.danmaku',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: '总评论',
          dataIndex: 'last_total_stat.reply',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: '总收藏',
          dataIndex: 'last_total_stat.favorite',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: '总硬币',
          dataIndex: 'last_total_stat.coin',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: '总分享',
          dataIndex: 'last_total_stat.share',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: '总点赞',
          dataIndex: 'last_total_stat.like',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: '最新投稿',
          dataIndex: 'last_video',
          scopedSlots: { customRender: 'lastVideo' },
          width: '120px',
        }, {
          title: '关注时间',
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
