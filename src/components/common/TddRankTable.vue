<template>
  <a-table
    :columns="columnsToShow"
    :rowKey="item => item.rank"
    :dataSource="rankList"
    :pagination="false"
    :scroll="{ x: $store.getters.clientMode === 'MOBILE' ? 1200 : useIndex ? 1300 : 1260 }"
    size="small"
  >
    <template slot="rank" slot-scope="item">
      <div
        :title="`${item.index ? `增量排名：#${item.index}；` : ''}得分排名：#${item.rank}`"
        style="cursor: help"
      >
        <span v-if="item.index">
          <span :class="[`color-${$util.colorLevelOfIndex(item.index)}`]">
            {{ `#${item.index}` }}
          </span>
          /
        </span>
        <span :class="[`color-${$util.colorLevel(item.point, rankColor['point'])}`]">
          {{ `#${item.rank}` }}
        </span>
      </div>
    </template>
    <template slot="pic" slot-scope="item">
      <div v-if="item.video">
        <div class="to-bilibili-content" style="position: relative">
          <img
            width="108px"
            height="65px"
            alt="pic"
            :src="$util.httpS(item.video.pic)"
          />
          <a-tag v-if="item.video.videos > 1" style="position: absolute; bottom: 2px; right: -7px">{{ item.video.videos }}P</a-tag>
          <div
            v-if="$store.getters.clientMode === 'MOBILE'"
            :class="[`bg-color-${$util.colorLevel(item.point, rankColor['point'])}`]"
            :title="`${item.index ? `增量排名：#${item.index}；` : ''}得分排名：#${item.rank}`"
            style="background: #fafafa; border-radius: 4px; border: 1px solid #d9d9d9; font-size: 12px; padding: 0 4px; position: absolute; top: 2px; left: 2px"
          >
            <span v-if="item.index">
              <span :class="[`color-${$util.colorLevelOfIndex(item.index)}`]">
                {{ `#${item.index}` }}
              </span>
              /
            </span>
            <span :class="[`color-${$util.colorLevel(item.point, rankColor['point'])}`]">
              {{ `#${item.rank}` }}
            </span>
          </div>
          <div
            class="to-bilibili-cover"
            :title="`点击前往BiliBili「${item.video.title}」视频播放页面`"
            @click="videoPicClickHandler(item.video.aid)"
          >
            <div class="to-bilibili-cover-background"></div>
            <a-icon class="to-bilibili-cover-play-icon" type="play-circle"></a-icon>
          </div>
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
    <template slot="videoTitleMemberPubdate" slot-scope="item">
      <div v-if="item.video">
        <div
          :title="`点击前往天钿Daily「${item.video.title}」视频详情页面`"
          class="video-title"
        >
          <a @click="videoTitleClickHandler(item.video.aid)">{{ item.video.title }}</a>
        </div>
        <div style="margin-top: 4px; width: 100%; display: flex">
          <span
            class="video-title-member"
            style="flex-grow: 1; margin-right: 8px"
            :title="`UP主：${item.video.member ? item.video.member.name : ''}`"
          >
            <a-avatar
              :src="item.video.member ? $util.httpS(item.video.member.face) : 'https://static.hdslb.com/images/member/noface.gif'"
              :size="16"
              style="margin-right: 4px"
            />
            <a @click="memberNameClickHandler(item.video.mid)">{{ item.video.member ? item.video.member.name : '' }}</a>
          </span>
          <span
            :title="`投稿日期：${$util.tsToDateString(item.video.pubdate)}
统计时间：${$util.tsToDateString(archId === 0 ? item.now_added : item.arch_added)}
总计时长：${$util.getTimespanStr(item.video.pubdate, archId === 0 ? item.now_added : item.arch_added)}`"
            style="flex-shrink: 0; cursor: help"
          >
            <a-icon type="calendar" style="margin-right: 4px" />
            {{ $util.tsToDateString(item.video.pubdate, 'yyyy-MM-dd') }}
          </span>
          <span
            v-if="showTimespanString"
            :title="`投稿日期：${$util.tsToDateString(item.video.pubdate)}
统计时间：${$util.tsToDateString(archId === 0 ? item.now_added : item.arch_added)}
总计时长：${$util.getTimespanStr(item.video.pubdate, archId === 0 ? item.now_added : item.arch_added)}`"
            style="flex-shrink: 0; margin-left: 16px; width: 118px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; cursor: help"
          >
            <a-icon type="hourglass" style="margin-right: 4px" />
            {{ $util.getTimespanStr(item.video.pubdate, archId === 0 ? item.now_added : item.arch_added) }}
          </span>
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
          fixed: 'left',
        }, {
          title: '标题',
          scopedSlots: { customRender: 'videoTitleMemberPubdate' },
          // width: '200px',
        },
        {
          title: '播放',
          scopedSlots: { customRender: 'view_value' },
          width: '108px',
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
        },
      ],
    }
  },
  computed: {
    columnsToShow: function () {
      let columns = [];
      
      // add rank column
      if (this.$store.getters.clientMode !== 'MOBILE') {
        columns.push({
          title: '排名',
          scopedSlots: { customRender: 'rank' },
          width: this.useIndex ? '108px' : '60px',
          fixed: 'left',
        });
      }
      
      // add middle columns
      columns = columns.concat(this.columns)
      
      // add point column
      columns.push({
        title: '得分 (修正A/B)',
        scopedSlots: { customRender: 'point_value' },
        width: '144px',
        fixed: this.$store.getters.clientMode !== 'MOBILE' ? 'right' : null,
      });
      
      return columns;
    },
    showTimespanString: function () {
      return this.$store.state.clientWidth > 1580;
    },
  },
  methods: {
    videoPicClickHandler: function (aid) {
      window.open(`https://www.bilibili.com/video/av${aid}`);
      this.$service.reportInteraction('rank_click_video_pic', JSON.stringify({ aid }));
    },
    videoTitleClickHandler: function (aid) {
      window.open(`/video/av${aid}`);
      this.$service.reportInteraction('rank_click_video_title', JSON.stringify({ aid }));
    },
    memberNameClickHandler: function (mid) {
      window.open(`/member/${mid}`);
    },
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.to-bilibili-content {
  transition: all .2s;
}
.to-bilibili-content:hover {
  /*box-shadow: 0 0 20px #fc82a5;*/
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
}
.to-bilibili-cover-background {
  width: 108px;
  height: 65px;
  position: absolute;
  top: 0;
  left: 0;
  transition: all .2s;
  cursor: pointer;
}
.to-bilibili-cover:hover .to-bilibili-cover-background {
  background-color: rgba(0, 0, 0, 0.65);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.65);
}
.to-bilibili-cover-play-icon {
  position: absolute;
  top: 17px;
  left: 39px;
  font-size: 30px;
  transition: all .2s;
  color: rgba(0, 0, 0, 0);
  cursor: pointer;
}
.to-bilibili-cover:hover .to-bilibili-cover-play-icon {
  color: #fc82a5;
}
a {
  color: rgba(0, 0, 0, 0.65);
}
a:hover {
  color: #1890ff
}
</style>
