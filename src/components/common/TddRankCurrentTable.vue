<template>
  <a-table
      :columns="columns"
      :rowKey="item => item.rank"
      :dataSource="rankCurrentList"
      :pagination="false"
      :scroll="{ x: 700 }"
      size="small"
  >
    <template slot="pic" slot-scope="item">
      <img
          width="108px"
          height="65px"
          alt="pic"
          :src="item.video.pic"
          @click="videoPicClickHandler(item.video.aid)"
          style="cursor: pointer"
      />
    </template>
    <template slot="videoTitle" slot-scope="item">
      <div class="video-title">
        <a @click="videoTitleClickHandler(item.video.aid)">{{ item.video.title }}</a>
      </div>
    </template>
    <template slot="member" slot-scope="item">
      <a @click="memberNameClickHandler(item.video.mid)">{{ item.video.member ? item.video.member.name : '' }}</a>
    </template>
    <template slot="added" slot-scope="added">
      {{ $util.tsToDateString(added) }}
    </template>
    <template slot="value" slot-scope="value">
      {{ value.toLocaleString() }}
    </template>
    <template slot="view_value" slot-scope="item">
      {{ item.now_view.toLocaleString() }} <br>
      ({{item.incr_view > 0 ? '+' : ''}}{{ item.incr_view.toLocaleString() }})
    </template>
    <template slot="danmaku_value" slot-scope="item">
      {{ item.now_danmaku.toLocaleString() }} <br>
      ({{item.incr_danmaku > 0 ? '+' : ''}}{{ item.incr_danmaku.toLocaleString() }})
    </template>
    <template slot="reply_value" slot-scope="item">
      {{ item.now_reply.toLocaleString() }} <br>
      ({{item.incr_reply > 0 ? '+' : ''}}{{ item.incr_reply.toLocaleString() }})
    </template>
    <template slot="favorite_value" slot-scope="item">
      {{ item.now_favorite.toLocaleString() }} <br>
      ({{item.incr_favorite > 0 ? '+' : ''}}{{ item.incr_favorite.toLocaleString() }})
    </template>
    <template slot="coin_value" slot-scope="item">
      {{ item.now_coin.toLocaleString() }} <br>
      ({{item.incr_coin > 0 ? '+' : ''}}{{ item.incr_coin.toLocaleString() }})
    </template>
    <template slot="share_value" slot-scope="item">
      {{ item.now_share.toLocaleString() }} <br>
      ({{item.incr_share > 0 ? '+' : ''}}{{ item.incr_share.toLocaleString() }})
    </template>
    <template slot="like_value" slot-scope="item">
      {{ item.now_like.toLocaleString() }} <br>
      ({{item.incr_like > 0 ? '+' : ''}}{{ item.incr_like.toLocaleString() }})
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
      }
    },
    data: function () {
      return {
        columns: [
          {
            title: '排名',
            dataIndex: 'rank',
            scopedSlots: { customRender: 'value' },
            width: '48px',
            fixed: 'left',
          }, {
            title: '封面',
            scopedSlots: { customRender: 'pic' },
            width: '112px',
          }, {
            title: '标题',
            scopedSlots: { customRender: 'videoTitle' },
          }, {
            title: 'UP主',
            scopedSlots: { customRender: 'member' },
          }, {
            title: '投稿时间',
            dataIndex: 'video.pubdate',
            scopedSlots: { customRender: 'added' },
            width: '108px',
          }, {
            title: '播放',
            scopedSlots: { customRender: 'view_value' },
          }, {
            title: '弹幕',
            scopedSlots: { customRender: 'danmaku_value' },
          }, {
            title: '评论',
            scopedSlots: { customRender: 'reply_value' },
          }, {
            title: '收藏',
            scopedSlots: { customRender: 'favorite_value' },
          }, {
            title: '硬币',
            scopedSlots: { customRender: 'coin_value' },
          }, {
            title: '分享',
            scopedSlots: { customRender: 'share_value' },
          }, {
            title: '点赞',
            scopedSlots: { customRender: 'like_value' },
          }, {
            title: '得分',
            dataIndex: 'point',
            scopedSlots: { customRender: 'value' },
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
          }
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
      }
    }
  }
</script>

<style scoped>
  .video-title {
    height: 65px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
  a {
    color: rgba(0, 0, 0, 0.65);
  }
  a:hover {
    color: #1890ff
  }
</style>
