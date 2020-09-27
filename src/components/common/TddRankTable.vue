<template>
  <a-table
    :columns="columnsToShow"
    :rowKey="item => item.rank"
    :dataSource="rankList"
    :pagination="false"
    :scroll="{ x: 1400 }"
    size="small"
  >
    <template slot="pic" slot-scope="item">
      <div v-if="item.video">
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
      </div>
      <div v-else>
        <div style="position: relative">
          <img
            width="108px"
            height="65px"
            alt="pic"
            src="https://i0.hdslb.com/bfs/archive/be27fd62c99036dce67efface486fb0a88ffed06.jpg"
            style="cursor: pointer"
          />
        </div>
      </div>
    </template>
    <template slot="videoTitleMember" slot-scope="item">
      <div v-if="item.video">
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
      </div>
      <div v-else>
        <div class="video-title">
          __不再收录的视频__
          <a-popover title="__不再收录的视频__">
            <template slot="content">
              <a :href="`https://www.bilibili.com/video/BV${item.bvid}`" target="_blank" style="color: #1890ff">此视频</a>现在已不再符合本站收录条件，故不再显示
            </template>
            <a-icon type="question-circle" />
          </a-popover>
        </div>
        <div class="video-title-member">
          <a-avatar
            src='https://static.hdslb.com/images/member/noface.gif'
            :size="16"
            style="margin-right: 4px"
          />
          __不再收录的视频的UP主__
        </div>
      </div>
    </template>
    <template slot="added" slot-scope="added">
      {{ $util.tsToDateString(added) }}
    </template>
    <template slot="value" slot-scope="value">
      {{ value.toLocaleString() }}
    </template>
    <template slot="view_value" slot-scope="item">
      {{ archId === 0 ? item.now_view.toLocaleString() : item.arch_view.toLocaleString() }} <br>
      (<span :class="[getColorClass('incr_view', item.incr_view)]">{{item.incr_view > 0 ? '+' : ''}}{{ item.incr_view.toLocaleString() }}</span>)
    </template>
    <template slot="danmaku_value" slot-scope="item">
      {{ archId === 0 ? item.now_danmaku.toLocaleString() : item.arch_danmaku.toLocaleString() }} <br>
      (<span :class="[getColorClass('incr_danmaku', item.incr_danmaku)]">{{item.incr_danmaku > 0 ? '+' : ''}}{{ item.incr_danmaku.toLocaleString() }}</span>)
    </template>
    <template slot="reply_value" slot-scope="item">
      {{ archId === 0 ? item.now_reply.toLocaleString() : item.arch_reply.toLocaleString() }} <br>
      (<span :class="[getColorClass('incr_reply', item.incr_reply)]">{{item.incr_reply > 0 ? '+' : ''}}{{ item.incr_reply.toLocaleString() }}</span>)
    </template>
    <template slot="favorite_value" slot-scope="item">
      {{ archId === 0 ? item.now_favorite.toLocaleString() : item.arch_favorite.toLocaleString() }} <br>
      (<span :class="[getColorClass('incr_favorite', item.incr_favorite)]">{{item.incr_favorite > 0 ? '+' : ''}}{{ item.incr_favorite.toLocaleString() }}</span>)
    </template>
    <template slot="coin_value" slot-scope="item">
      {{ archId === 0 ? item.now_coin.toLocaleString() : item.arch_coin.toLocaleString() }} <br>
      (<span :class="[getColorClass('incr_coin', item.incr_coin)]">{{item.incr_coin > 0 ? '+' : ''}}{{ item.incr_coin.toLocaleString() }}</span>)
    </template>
    <template slot="share_value" slot-scope="item">
      {{ archId === 0 ? item.now_share.toLocaleString() : item.arch_share.toLocaleString() }} <br>
      (<span :class="[getColorClass('incr_share', item.incr_share)]">{{item.incr_share > 0 ? '+' : ''}}{{ item.incr_share.toLocaleString() }}</span>)
    </template>
    <template slot="like_value" slot-scope="item">
      {{ archId === 0 ? item.now_like.toLocaleString() : item.arch_like.toLocaleString() }} <br>
      (<span :class="[getColorClass('incr_like', item.incr_like)]">{{item.incr_like > 0 ? '+' : ''}}{{ item.incr_like.toLocaleString() }}</span>)
    </template>
    <template slot="more">
      更多
    </template>
  </a-table>
</template>

<script>
export default {
  name: 'TddRankTable',
  props: {
    rankList: {
      type: Array,
      required: true,
    },
    rankColor: {
      type: Object,
      required: true,
    },
    archId: {
      type: Number,
      default: 0,
    },
    highlight: {
      type: String,
    },
    useIndex: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      columns: [
        {
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
          // customCell: () => {
          //   return {
          //     class: { 'tr-highlight': true }
          //   };
          // },
          customHeaderCell: () => {
            return this.highlight === 'view' ? {
              style: {
                backgroundColor: '#E6F7FF'
              }
            } : {};
          },
          customCell: () => {
            return this.highlight === 'view' ? {
              style: {
                backgroundColor: '#E6F7FF'
              }
            } : {};
          },
        }, {
          title: '弹幕',
          scopedSlots: { customRender: 'danmaku_value' },
          width: '96px',
          customHeaderCell: () => {
            return this.highlight === 'danmaku' ? {
              style: {
                backgroundColor: '#E6F7FF'
              }
            } : {};
          },
          customCell: () => {
            return this.highlight === 'danmaku' ? {
              style: {
                backgroundColor: '#E6F7FF'
              }
            } : {};
          },
        }, {
          title: '评论',
          scopedSlots: { customRender: 'reply_value' },
          width: '96px',
          customHeaderCell: () => {
            return this.highlight === 'reply' ? {
              style: {
                backgroundColor: '#E6F7FF'
              }
            } : {};
          },
          customCell: () => {
            return this.highlight === 'reply' ? {
              style: {
                backgroundColor: '#E6F7FF'
              }
            } : {};
          },
        }, {
          title: '收藏',
          scopedSlots: { customRender: 'favorite_value' },
          width: '96px',
          customHeaderCell: () => {
            return this.highlight === 'favorite' ? {
              style: {
                backgroundColor: '#E6F7FF'
              }
            } : {};
          },
          customCell: () => {
            return this.highlight === 'favorite' ? {
              style: {
                backgroundColor: '#E6F7FF'
              }
            } : {};
          },
        }, {
          title: '硬币',
          scopedSlots: { customRender: 'coin_value' },
          width: '96px',
          customHeaderCell: () => {
            return this.highlight === 'coin' ? {
              style: {
                backgroundColor: '#E6F7FF'
              }
            } : {};
          },
          customCell: () => {
            return this.highlight === 'coin' ? {
              style: {
                backgroundColor: '#E6F7FF'
              }
            } : {};
          },
        }, {
          title: '分享',
          scopedSlots: { customRender: 'share_value' },
          width: '96px',
          customHeaderCell: () => {
            return this.highlight === 'share' ? {
              style: {
                backgroundColor: '#E6F7FF'
              }
            } : {};
          },
          customCell: () => {
            return this.highlight === 'share' ? {
              style: {
                backgroundColor: '#E6F7FF'
              }
            } : {};
          },
        }, {
          title: '点赞',
          scopedSlots: { customRender: 'like_value' },
          width: '96px',
          customHeaderCell: () => {
            return this.highlight === 'like' ? {
              style: {
                backgroundColor: '#E6F7FF'
              }
            } : {};
          },
          customCell: () => {
            return this.highlight === 'like' ? {
              style: {
                backgroundColor: '#E6F7FF'
              }
            } : {};
          },
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
      ],
    }
  },
  computed: {
    columnsToShow: function () {
      let headerColumns = [
        {
          title: '得分排名',
          dataIndex: 'rank',
          scopedSlots: { customRender: 'value' },
          width: '72px',
          fixed: this.useIndex ? '' : 'left',
        },
      ]
      if (this.useIndex) {
        headerColumns = [
          {
            title: '排名',
            dataIndex: 'index',
            scopedSlots: { customRender: 'value' },
            width: '72px',
            fixed: 'left',
          },
          ...headerColumns
        ]
      }
      return [
        ...headerColumns,
        ...this.columns
      ];
    },
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
      let abcd = this.rankColor[property];
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
