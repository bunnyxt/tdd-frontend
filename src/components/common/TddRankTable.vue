<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "incr_rank": "增量排名：#",
    "point_ranking": "得分排名：#",
    "click_go_bilibili_watch_prompt": "点击前往BiliBili「{title}」视频播放页面",
    "click_to_view_video_detailed_info_prompt": "点击查看视频详情",
    "click_to_view_member_detailed_info_prompt": "点击查看UP主详情",
    "record_time": "统计时间",
    "total_timespan": "总计时长",
    "no_longer_tracked_video_name": "__不再收录的视频__",
    "this_video": "此视频",
    "no_longer_track_prompt": "现在已不再符合本站收录条件，故不再显示",
    "uploader_of_no_longer_tracked_video_name": "__不再收录的视频的UP主__",
    "point_with_xiua_xiub": "得分 (修正A/B)"
  },
  "en": {
    "incr_rank": "Increment Ranking: #",
    "point_ranking": "Point Ranking: #",
    "click_go_bilibili_watch_prompt": "Click to watch video 「{title}」 on BiliBili",
    "click_to_view_video_detailed_info_prompt": "Click to view video detailed info.",
    "click_to_view_member_detailed_info_prompt": "Click to view uploader detailed info.",
    "record_time": "Recorded",
    "total_timespan": "Timespan",
    "no_longer_tracked_video_name": "__no_longer_tracked_video__",
    "this_video": "This video",
    "no_longer_track_prompt": " now not satisfied the video tracking requirements, so will not display any more.",
    "uploader_of_no_longer_tracked_video_name": "__uploader_of_no_longer_tracked_video__",
    "point_with_xiua_xiub": "Point (Adjust A/B)"
  }
}
</i18n>

<template>
  <a-table
    :columns="columnsToShow"
    :rowKey="item => item.rank"
    :dataSource="rankList"
    :pagination="false"
    :scroll="{ x: $store.getters.clientMode === 'MOBILE' ? 1200 : useIndex ? 1300 : 1260 }"
    size="small"
  >
    <template #rank="item">
      <div
        :title="`${item.index ? `${$t('incr_rank')}${item.index}${$t('semicolon')}` : ''}${$t('point_ranking')}${item.rank}`"
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
    <template #pic="item">
      <div v-if="item.video">
        <div class="to-bilibili-content" style="position: relative">
          <img
            width="108px"
            height="65px"
            alt="pic"
            :src="$util.httpS(item.video.pic)"
          >
          <a-tag v-if="item.video.videos > 1" style="position: absolute; bottom: 2px; right: -7px">{{ item.video.videos }}P</a-tag>
          <div
            v-if="$store.getters.clientMode === 'MOBILE'"
            :class="[`bg-color-${$util.colorLevel(item.point, rankColor['point'])}`]"
            :title="`${item.index ? `${$t('incr_rank')}${item.index}${$t('semicolon')}` : ''}${$t('point_ranking')}${item.rank}`"
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
            :title="$t('click_go_bilibili_watch_prompt', { title: item.video.title })"
            @click.prevent="videoPicClickHandler(item.video.aid)"
          >
            <a :href="`https://www.bilibili.com/video/av${item.video.aid}`">
              <div class="to-bilibili-cover-background"></div>
              <play-circle-outlined class="to-bilibili-cover-play-icon" />
            </a>
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
          >
        </div>
      </div>
    </template>
    <template #videoTitleMemberPubdate="item">
      <div v-if="item.video">
        <div class="video-title">
          <a-tooltip placement="topLeft">
            <template #title>
              <calendar-outlined style="margin-right: 4px" />
              {{ $util.tsToDateString(archId === 0 ? item.now_added : item.arch_added) }}
              <tdd-video-stat-bar :stat="extractStat(item)" style="margin: 8px 0" />
              {{ $t('click_to_view_video_detailed_info_prompt') }}
            </template>
            <a
              :href="`https://tdd.bunnyxt.com/video/av${item.video.aid}`"
              @click.prevent="videoTitleClickHandler(item.video.aid)"
            >{{ item.video.title }}</a>
          </a-tooltip>
        </div>
        <div style="margin-top: 4px; width: 100%; display: flex">
          <a-tooltip placement="topLeft" style="flex-grow: 1; margin-right: 8px">
            <template #title>
              <div style="margin: 4px">
                <tdd-member-card :mid="item.video.mid" style="margin-bottom: 8px" />
                {{ $t('click_to_view_member_detailed_info_prompt') }}
              </div>
            </template>
            <span class="video-title-member">
              <a-avatar
                :src="item.video.member ? $util.httpS(item.video.member.face) : 'https://static.hdslb.com/images/member/noface.gif'"
                :size="16"
                style="margin-right: 4px"
              />
              <a
                :href="`https://tdd.bunnyxt.com/member/${item.video.mid}`"
                @click.prevent="memberNameClickHandler(item.video.mid)"
              >{{ item.video.member ? item.video.member.name : '' }}</a>
            </span>
          </a-tooltip>
          <a-tooltip style="flex-shrink: 0; cursor: help">
            <template #title>
              {{ $t('pubdate') }}{{ $t('colon') }}{{ $util.tsToDateString(item.video.pubdate) }}<br>
              {{ $t('record_time') }}{{ $t('colon') }}{{ $util.tsToDateString(archId === 0 ? item.now_added : item.arch_added) }}<br>
              {{ $t('total_timespan') }}{{ $t('colon') }}{{ $store.getters.i18nLocale === 'en' ? $util.getTimespanStrEn(item.video.pubdate, archId === 0 ? item.now_added : item.arch_added) : $util.getTimespanStr(item.video.pubdate, archId === 0 ? item.now_added : item.arch_added) }}
            </template>
            <span style="display: flex">
              <span>
                <calendar-outlined style="margin-right: 4px" />
                {{ $util.tsToDateString(item.video.pubdate, 'yyyy-MM-dd') }}
              </span>
              <span
                v-if="showTimespanString"
                style="display: inline; margin-left: 16px; width: 118px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; cursor: help"
              >
                <hourglass-outlined style="margin-right: 4px" />
                {{ $store.getters.i18nLocale === 'en' ? $util.getTimespanStrEn(item.video.pubdate, archId === 0 ? item.now_added : item.arch_added) : $util.getTimespanStr(item.video.pubdate, archId === 0 ? item.now_added : item.arch_added) }}
              </span>
            </span>
          </a-tooltip>
        </div>
      </div>
      <div v-else>
        <div class="video-title">
          {{ $t('no_longer_tracked_video_name') }}
          <a-popover :title="$t('no_longer_tracked_video_name')">
            <template #content>
              <a :href="`https://www.bilibili.com/video/BV${item.bvid}`" target="_blank" style="color: #1890ff">{{ $t('this_video') }}</a>{{ $t('no_longer_track_prompt') }}
            </template>
            <question-circle-outlined />
          </a-popover>
        </div>
        <div class="video-title-member">
          <a-avatar
            src='https://static.hdslb.com/images/member/noface.gif'
            :size="16"
            style="margin-right: 4px"
          />
          {{ $t('uploader_of_no_longer_tracked_video_name') }}
        </div>
      </div>
    </template>
    <template #added="added">
      {{ $util.tsToDateString(added) }}
    </template>
    <template #value="value">
      {{ value.toLocaleString() }}
    </template>
    <template #view_value="item">
      <tdd-rank-table-incr-cell
        :incr="item.incr_view"
        :total="archId === 0 ? item.now_view : item.arch_view"
        :separator="rankColor['incr_view']"
      />
    </template>
    <template #danmaku_value="item">
      <tdd-rank-table-incr-cell
        :incr="item.incr_danmaku"
        :total="archId === 0 ? item.now_danmaku : item.arch_danmaku"
        :separator="rankColor['incr_danmaku']"
      />
    </template>
    <template #reply_value="item">
      <tdd-rank-table-incr-cell
        :incr="item.incr_reply"
        :total="archId === 0 ? item.now_reply : item.arch_reply"
        :separator="rankColor['incr_reply']"
      />
    </template>
    <template #favorite_value="item">
      <tdd-rank-table-incr-cell
        :incr="item.incr_favorite"
        :total="archId === 0 ? item.now_favorite : item.arch_favorite"
        :separator="rankColor['incr_favorite']"
      />
    </template>
    <template #coin_value="item">
      <tdd-rank-table-incr-cell
        :incr="item.incr_coin"
        :total="archId === 0 ? item.now_coin : item.arch_coin"
        :separator="rankColor['incr_coin']"
      />
    </template>
    <template #share_value="item">
      <tdd-rank-table-incr-cell
        :incr="item.incr_share"
        :total="archId === 0 ? item.now_share : item.arch_share"
        :separator="rankColor['incr_share']"
      />
    </template>
    <template #like_value="item">
      <tdd-rank-table-incr-cell
        :incr="item.incr_like"
        :total="archId === 0 ? item.now_like : item.arch_like"
        :separator="rankColor['incr_like']"
      />
    </template>
    <template #point_value="item">
      <tdd-rank-table-point-cell
        :point="item.point"
        :xiua="item.xiua"
        :xiub="item.xiub"
        :separator="rankColor['point']"
      />
    </template>
    <template #more>
      {{ $t('more') }}
    </template>
  </a-table>
</template>

<script>
import TddRankTableIncrCell from "@/components/common/TddRankTableIncrCell";
import TddRankTablePointCell from "@/components/common/TddRankTablePointCell";
import TddVideoStatBar from "@/components/common/TddVideoStatBar";
import TddMemberCard from "@/components/common/TddMemberCard";
import { PlayCircleOutlined, CalendarOutlined, HourglassOutlined, QuestionCircleOutlined } from "@ant-design/icons-vue";

export default {
  name: 'TddRankTable',
  components: {
    TddRankTableIncrCell,
    TddRankTablePointCell,
    TddVideoStatBar,
    TddMemberCard,
    PlayCircleOutlined,
    CalendarOutlined,
    HourglassOutlined,
    QuestionCircleOutlined,
  },
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
          title: this.$t('pic'),
          scopedSlots: { customRender: 'pic' },
          width: '120px',
          fixed: 'left',
        }, {
          title: this.$t('title'),
          scopedSlots: { customRender: 'videoTitleMemberPubdate' },
          // width: '200px',
        },
        {
          title: this.$t('view'),
          scopedSlots: { customRender: 'view_value' },
          width: '108px',
          customHeaderCell: () => this.highlightColumn('view'),
          customCell: () => this.highlightColumn('view'),
        }, {
          title: this.$t('danmaku'),
          scopedSlots: { customRender: 'danmaku_value' },
          width: '96px',
          customHeaderCell: () => this.highlightColumn('danmaku'),
          customCell: () => this.highlightColumn('danmaku'),
        }, {
          title: this.$t('reply'),
          scopedSlots: { customRender: 'reply_value' },
          width: '96px',
          customHeaderCell: () => this.highlightColumn('reply'),
          customCell: () => this.highlightColumn('reply'),
        }, {
          title: this.$t('favorite'),
          scopedSlots: { customRender: 'favorite_value' },
          width: '96px',
          customHeaderCell: () => this.highlightColumn('favorite'),
          customCell: () => this.highlightColumn('favorite'),
        }, {
          title: this.$t('coin'),
          scopedSlots: { customRender: 'coin_value' },
          width: '96px',
          customHeaderCell: () => this.highlightColumn('coin'),
          customCell: () => this.highlightColumn('coin'),
        }, {
          title: this.$t('share'),
          scopedSlots: { customRender: 'share_value' },
          width: '96px',
          customHeaderCell: () => this.highlightColumn('share'),
          customCell: () => this.highlightColumn('share'),
        }, {
          title: this.$t('like'),
          scopedSlots: { customRender: 'like_value' },
          width: '96px',
          customHeaderCell: () => this.highlightColumn('like'),
          customCell: () => this.highlightColumn('like'),
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
          title: this.$t('rank_order'),
          scopedSlots: { customRender: 'rank' },
          width: this.useIndex ? '108px' : '60px',
          fixed: 'left',
        });
      }
      
      // add middle columns
      columns = columns.concat(this.columns)
      
      // add point column
      columns.push({
        title: this.$t('point_with_xiua_xiub'),
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
      this.$service.reportInteraction('rank_click_member_name', JSON.stringify({ mid }));
    },
    highlightColumn: function (columnName) {
      return this.highlight === columnName ? {
        style: {
          backgroundColor: '#e6f7ff',
        },
      } : {};
    },
    extractStat: function (item) {
      let prefix = 'now_';
      if (Object.prototype.hasOwnProperty.call(item, 'arch_view')) {
        prefix = 'arch_';
      }
      const attributes = ['added', 'view', 'danmaku', 'reply', 'favorite', 'coin', 'share', 'like'];
      const stat = {};
      for (const attribute of attributes) {
        stat[attribute] = item[`${prefix}${attribute}`];
      }
      return stat;
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
