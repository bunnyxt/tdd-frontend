<template>
  <div v-if="video">
    <a-drawer
      placement="right"
      :closable="false"
      :visible="this.$store.state.isVideoDetailDrawerVisible"
      @close="() => $store.commit('setVideoDetailDrawerVisibility', false)"
      :width="videoDetailDrawerWidth + 'px'"
    >
      <template slot="title">
        {{ idString }}
        <a-button
          size="small"
          @click="() => this.showBvid = !this.showBvid"
        >转{{ this.showBvid ? 'aid' : 'bvid'}}</a-button>
      </template>
      <a-alert
        v-if="video.code !== 0 && video.code !== -403"
        type="error"
        :message='`本视频已无法正常观看，错误代码：${video.code}，提示信息：${$util.getVideoCodeMessage(video.code)}`'
        style="margin-bottom: 12px;"
        banner
      />
      <a-alert
        v-if="video.code === -403"
        type="warning"
        :message='`本视频仅会员可见，登录B站后方可观看；由于B站限制，本站无法获取精确播放数`'
        style="margin-bottom: 12px;"
        banner
      />
      <h3 style="margin-bottom: 14px">{{ video.title }}</h3>
      <div style="overflow: hidden">
        <div style="float: left; margin-right: 20px; margin-bottom: 12px">
          <a-avatar
            size="small"
            :src="video.member
                  ? $util.httpS(video.member.face)
                  : 'https://static.hdslb.com/images/member/noface.gif'"
            style="margin-right:12px"
          />
          <a @click="videoMemberNameClickHandler(video.mid)">
            {{ video.member ? video.member.name : 'mid_'+video.mid}}
          </a>
        </div>
        <div v-if="video.hasstaff === 1" style="float: left; margin-bottom: 12px">
          <a-dropdown :trigger="['click']" placement="bottomCenter">
            <a class="ant-dropdown-link" href="#">创作团队 ({{ video.staff.length }}) <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <template v-for="staff in video.staff.filter( s => s.title === 'UP主')">
                <a-menu-item :key="staff.mid">
                  <a @click="videoMemberNameClickHandler(staff.mid)">
                    <a-avatar size="small" :src="$util.httpS(staff.face)" style="margin-right: 8px" />
                    {{ staff.name }}<a-tag :color="getStaffTitleColor(staff.title)" style="margin-left: 8px">{{ staff.title }}</a-tag>
                  </a>
                </a-menu-item>
              </template>
              <template v-for="staff in video.staff.filter( s => s.title !== 'UP主')">
                <a-menu-item :key="staff.mid">
                  <a @click="videoMemberNameClickHandler(staff.mid)">
                    <a-avatar size="small" :src="$util.httpS(staff.face)" style="margin-right: 8px" />
                    {{ staff.name }}<a-tag :color="getStaffTitleColor(staff.title)" style="margin-left: 8px">{{ staff.title }}</a-tag>
                  </a>
                </a-menu-item>
              </template>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
      <p><a-icon type="calendar" style="margin-right: 12px"/>{{ $util.tsToDateString(video.pubdate) }}</p>
      <p><a-icon type="database" style="margin-right: 12px"/>{{ video.tname }}</p>
      <template v-if="videoAttributeFlags.length > 0 && $store.state.isUserLoggedIn">
        <p>
          <a-icon type="flag" style="margin-right: 12px" />
          <a-tag
            v-for="flag in videoAttributeFlags"
            :key="flag.name"
            :title="flag.message"
            color="red"
            style="margin-bottom: 4px; cursor: pointer"
          >
            <a-popover>
              <template slot="content">
                {{ flag.message }}
              </template>
              {{ flag.name }}
            </a-popover>
          </a-tag>
          <a-tag
            color="red"
            style="margin-bottom: 4px; cursor: pointer"
          >
            <a-popover>
              <template slot="content">
                对B站API提供的视频"attribute"属性的解释，仅供参考。<br/>详见<a href="https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/video/info.md#获取视频详细信息web端" target="_blank">此处</a>。
              </template>
              <a-icon type="question-circle" />
            </a-popover>
          </a-tag>
        </p>
      </template>
      <tdd-video-action-bar :aid="video.aid" :small="$store.state.clientWidth < 420" />
      <tdd-moe-girl-wiki-widget v-if="$config.enableMoegirlWikiWidget" type="video" url="https://zh.moegirl.org.cn/普通DISCO" style="margin-bottom: 12px" />
      <a-tag v-for="tag in $util.getTagList(video)" :key="tag.title" :color="tag.color" style="margin-bottom: 4px">{{ tag.title }}</a-tag>
      <a-tag>{{ video.videos }}P</a-tag>
      <a-divider orientation="left">简介</a-divider>
      <tdd-video-description :description="video.desc" :key="video.aid" />
      <a-divider orientation="left">标签</a-divider>
      <a-tag
        v-for="tag in video.tags
              ? video.tags.split(';').slice(0, -1)
              : []"
        :key="tag"
        style="margin-bottom: 4px"
      >
        {{ tag }}
      </a-tag>
      <a-divider orientation="left">数据</a-divider>
      <tdd-video-data-block
        v-if="video.laststat"
        :stat="video.laststat"
        :size="this.$store.getters.clientMode === 'MOBILE' ? 'small' : 'middle'"
        :bvid="this.$util.a2b(video.aid)"
      />
      <a-alert v-else type="error" message="暂无数据" />
      <div class="drawer-fake-footer"></div>
      <div class="drawer-footer" :style="{ width: videoDetailDrawerWidth + 'px', zIndex: 10 }">
        <router-link :to="'/video/av'+video.aid">
          <div @click="videoDetailClickHandler">
            <a-icon type="line-chart" title="详细数据" style="margin-right: 8px"/>详细数据
          </div>
        </router-link>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import TddVideoDescription from "./TddVideoDescription";
import TddVideoActionBar from "./TddVideoActionBar";
import TddVideoDataBlock from "@/components/common/TddVideoDataBlock";
import TddMoeGirlWikiWidget from "@/components/common/TddMoeGirlWikiWidget";

export default {
  name: 'TddVideoDetailDrawer',
  components: {
    TddVideoDescription,
    TddVideoActionBar,
    TddVideoDataBlock,
    TddMoeGirlWikiWidget,
  },
  data: function () {
    return {
      showBvid: false
    }
  },
  computed: {
    idString: function () {
      if (this.showBvid) {
        return `BV${this.$util.a2b(this.video.aid)}`;
      } else {
        return `av${this.video.aid}`;
      }
    },
    video: {
      get() {
        return this.$store.state.videoDetailDrawerVideo;
      }
    },
    videoDetailDrawerWidth: function() {
      return Math.min(this.$store.state.clientWidth * 0.7, 512);
    },
    videoAttributeFlags: function () {
      if (this.video && this.video.attribute) {
        return this.$util.getVideoAttributeFlags(this.video.attribute);
      } else {
        return [];
      }
    },
  },
  methods: {
    videoMemberNameClickHandler: function (mid) {
      this.$router.push('/member/' + mid);
      this.$store.commit('setVideoDetailDrawerVisibility', false);
    },
    videoDetailClickHandler: function () {
      this.$store.commit('setVideoDetailVideo', this.video);
      this.$store.commit('setVideoDetailDrawerVisibility', false);
    },
    getStaffTitleColor: function (title) {
      let color = '';
      switch (title) {
        case 'UP主':
          color = 'red';
          break;
        case '作词':
        case '填词':
          color = 'pink';
          break;
        case '作曲':
        case '编曲':
          color = 'orange';
          break;
        case '调校':
        case '调教':
        case '调音':
          color = 'green';
          break;
        case '曲绘':
          color = 'cyan';
          break;
        case '策划':
          color = 'blue';
          break;
        case '视频制作':
        case '剪辑':
        case '字幕':
          color = 'purple';
          break;
      }
      return color;
    }
  }
}
</script>

<style scoped>
.drawer-fake-footer {
  height: 48px;
}
.drawer-footer {
  position: fixed;
  bottom: 0;
  background: #fafafa;
  margin-left: -24px;
  border-top: 1px solid #e8e8e8;
  cursor: pointer;
}
.drawer-footer div {
  float: left;
  width: 100%;
  height: 48px;
  text-align: center;
  border-left: 1px solid #e8e8e8;
  padding-top: 14px;
  color: rgba(0, 0, 0, 0.65);
  transition: all .2s ease-out;
  -moz-transition: all .2s ease-out;
  -webkit-transition: all .2s ease-out;
  -o-transition: all .2s ease-out;
}
.drawer-footer div:hover {
  background: #e8e8e8;
  color: #1890FF;
}
</style>
