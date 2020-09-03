<template>
  <a-table
    :columns="columns"
    :rowKey="item => item.rank"
    :dataSource="rankCurrentList"
    :pagination="false"
    :scroll="{ x: 1400 }"
    size="small"
  >
    <template slot="pic" slot-scope="item">
      <div style="position: relative">
        <img
          width="108px"
          height="65px"
          alt="pic"
          :src="$util.httpS(item.video.pic)"
          @click="videoPicClickHandler(item.video.aid)"
          style="cursor: pointer"
        />
        <a-tag v-if="item.video.videos > 1" style="position: absolute; bottom: 2px; right: -9px">{{ item.video.videos }}P</a-tag>
      </div>
    </template>
    <template slot="videoTitleMember" slot-scope="item">
      <div class="video-title">
        <a @click="videoTitleClickHandler(item.video.aid)">{{ item.video.title }}</a>
      </div>
      <div class="video-title-member">
        <a-avatar
          :src="item.video.member ? $util.httpS(item.video.member.face) : 'https://static.hdslb.com/images/member/noface.gif'"
          :size="16"
          style="margin-right: 4px"
        />
        <a @click="memberNameClickHandler(item.video.mid)">{{ item.video.member ? item.video.member.name : '' }}</a>
      </div>
    </template>
    <template slot="added" slot-scope="added">
      {{ $util.tsToDateString(added) }}
    </template>
    <template slot="value" slot-scope="value">
      {{ value.toLocaleString() }}
    </template>
    <template slot="view_value" slot-scope="item">
      {{ item.now_view.toLocaleString() }} <br>
      (<span :class="[getColorClass('incr_view', item.incr_view)]">{{item.incr_view > 0 ? '+' : ''}}{{ item.incr_view.toLocaleString() }}</span>)
    </template>
    <template slot="danmaku_value" slot-scope="item">
      {{ item.now_danmaku.toLocaleString() }} <br>
      (<span :class="[getColorClass('incr_danmaku', item.incr_danmaku)]">{{item.incr_danmaku > 0 ? '+' : ''}}{{ item.incr_danmaku.toLocaleString() }}</span>)
    </template>
    <template slot="reply_value" slot-scope="item">
      {{ item.now_reply.toLocaleString() }} <br>
      (<span :class="[getColorClass('incr_reply', item.incr_reply)]">{{item.incr_reply > 0 ? '+' : ''}}{{ item.incr_reply.toLocaleString() }}</span>)
    </template>
    <template slot="favorite_value" slot-scope="item">
      {{ item.now_favorite.toLocaleString() }} <br>
      (<span :class="[getColorClass('incr_favorite', item.incr_favorite)]">{{item.incr_favorite > 0 ? '+' : ''}}{{ item.incr_favorite.toLocaleString() }}</span>)
    </template>
    <template slot="coin_value" slot-scope="item">
      {{ item.now_coin.toLocaleString() }} <br>
      (<span :class="[getColorClass('incr_coin', item.incr_coin)]">{{item.incr_coin > 0 ? '+' : ''}}{{ item.incr_coin.toLocaleString() }}</span>)
    </template>
    <template slot="share_value" slot-scope="item">
      {{ item.now_share.toLocaleString() }} <br>
      (<span :class="[getColorClass('incr_share', item.incr_share)]">{{item.incr_share > 0 ? '+' : ''}}{{ item.incr_share.toLocaleString() }}</span>)
    </template>
    <template slot="like_value" slot-scope="item">
      {{ item.now_like.toLocaleString() }} <br>
      (<span :class="[getColorClass('incr_like', item.incr_like)]">{{item.incr_like > 0 ? '+' : ''}}{{ item.incr_like.toLocaleString() }}</span>)
    </template>
    <template slot="more">
      更多
    </template>
  </a-table>
</template>

<script>
export default {
  name: 'TddRankCurrentTable',
  props: {
    rankCurrentList: {
      type: Array,
      required: true
    },
    rankCurrentColor: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      columns: [
        {
          title: '排名',
          dataIndex: 'rank',
          scopedSlots: { customRender: 'value' },
          width: '72px',
          fixed: 'left',
        }, {
          title: '封面',
          scopedSlots: { customRender: 'pic' },
          width: '120px',
        }, {
          title: '标题',
          scopedSlots: { customRender: 'videoTitleMember' },
          // width: '200px',
        },
        // {
        //   title: '投稿时间',
        //   dataIndex: 'video.pubdate',
        //   scopedSlots: { customRender: 'added' },
        //   width: '108px',
        // },
        {
          title: '播放',
          scopedSlots: { customRender: 'view_value' },
          width: '108px',
        }, {
          title: '弹幕',
          scopedSlots: { customRender: 'danmaku_value' },
          width: '96px',
        }, {
          title: '评论',
          scopedSlots: { customRender: 'reply_value' },
          width: '96px',
        }, {
          title: '收藏',
          scopedSlots: { customRender: 'favorite_value' },
          width: '96px',
        }, {
          title: '硬币',
          scopedSlots: { customRender: 'coin_value' },
          width: '96px',
        }, {
          title: '分享',
          scopedSlots: { customRender: 'share_value' },
          width: '96px',
        }, {
          title: '点赞',
          scopedSlots: { customRender: 'like_value' },
          width: '96px',
        }, {
          title: '得分',
          dataIndex: 'point',
          scopedSlots: { customRender: 'value' },
          width: '96px',
        }, {
          title: '修正A',
          dataIndex: 'xiua',
          scopedSlots: { customRender: 'value' },
          width: '64px',
        }, {
          title: '修正B',
          dataIndex: 'xiub',
          scopedSlots: { customRender: 'value' },
          width: '64px',
        },
        // {
        //   title: '更多',
        //   scopedSlots: { customRender: 'more' },
        //   width: '64px',
        // }
      ]
    }
  },
  methods: {
    videoPicClickHandler: function (aid) {
      window.open('/video/av' + aid);
    },
    videoTitleClickHandler: function (aid) {
      window.open('/video/av' + aid);
    },
    memberNameClickHandler: function (mid) {
      window.open('/member/' + mid);
    },
    getColorClass: function (property, value) {
      let abcd = this.rankCurrentColor[property];
      if (!abcd) {
        return 'color-0';
      } else {
        if (value <= abcd.a) {
          return 'color-1';
        } else if (value <= abcd.b) {
          return 'color-2';
        } else if (value <= abcd.c) {
          return 'color-3';
        } else if (value <= abcd.d) {
          return 'color-4';
        } else {
          return 'color-5';
        }
      }
    }
  }
}
</script>

<style scoped>
.video-title {
  height: 42px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.video-title-member {
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 4px;
}
a {
  color: rgba(0, 0, 0, 0.65);
}
a:hover {
  color: #1890ff
}
</style>
