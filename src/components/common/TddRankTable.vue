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
      <tdd-rank-table-incr-cell
        :incr="item.incr_view"
        :total="archId === 0 ? item.now_view : item.arch_view"
        :separator="rankColor['incr_view']"
      />
    </template>
    <template slot="danmaku_value" slot-scope="item">
      <tdd-rank-table-incr-cell
        :incr="item.incr_danmaku"
        :total="archId === 0 ? item.now_danmaku : item.arch_danmaku"
        :separator="rankColor['incr_danmaku']"
      />
    </template>
    <template slot="reply_value" slot-scope="item">
      <tdd-rank-table-incr-cell
        :incr="item.incr_reply"
        :total="archId === 0 ? item.now_reply : item.arch_reply"
        :separator="rankColor['incr_reply']"
      />
    </template>
    <template slot="favorite_value" slot-scope="item">
      <tdd-rank-table-incr-cell
        :incr="item.incr_favorite"
        :total="archId === 0 ? item.now_favorite : item.arch_favorite"
        :separator="rankColor['incr_favorite']"
      />
    </template>
    <template slot="coin_value" slot-scope="item">
      <tdd-rank-table-incr-cell
        :incr="item.incr_coin"
        :total="archId === 0 ? item.now_coin : item.arch_coin"
        :separator="rankColor['incr_coin']"
      />
    </template>
    <template slot="share_value" slot-scope="item">
      <tdd-rank-table-incr-cell
        :incr="item.incr_share"
        :total="archId === 0 ? item.now_share : item.arch_share"
        :separator="rankColor['incr_share']"
      />
    </template>
    <template slot="like_value" slot-scope="item">
      <tdd-rank-table-incr-cell
        :incr="item.incr_like"
        :total="archId === 0 ? item.now_like : item.arch_like"
        :separator="rankColor['incr_like']"
      />
    </template>
    <template slot="point_value" slot-scope="item">
      <tdd-rank-table-point-cell
        :point="item.point"
        :xiua="item.xiua"
        :xiub="item.xiub"
        :separator="rankColor['point']"
      />
    </template>
    <template slot="more">
      更多
    </template>
  </a-table>
</template>

<script>
import TddRankTableIncrCell from "@/components/common/TddRankTableIncrCell";
import TddRankTablePointCell from "@/components/common/TddRankTablePointCell";

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
  components: {
    TddRankTableIncrCell,
    TddRankTablePointCell,
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
          title: '得分（修正A/B）',
          scopedSlots: { customRender: 'point_value' },
          width: '126px',
        }
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
          width: '76px',
          fixed: this.useIndex ? '' : 'left',
        },
      ]
      if (this.useIndex) {
        headerColumns = [
          {
            title: '排名',
            dataIndex: 'index',
            scopedSlots: { customRender: 'value' },
            width: '76px',
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
      window.open(`https://www.bilibili.com/video/av${aid}`);
    },
    videoTitleClickHandler: function (aid) {
      window.open(`/video/av${aid}`);
    },
    memberNameClickHandler: function (mid) {
      window.open(`/member/${mid}`);
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
