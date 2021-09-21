<i18n src="@/i18n/common.json"></i18n>
<i18n src="@/i18n/tool.json"></i18n>
<i18n>
{
  "zh": {
    "tdd_introduction_brief": "致力于推动VC相关数据交流，定期抓取VC相关数据，选取有意义的纬度展示。",
    "know_more": "了解更多",
    "contact_us": "联系我们",
    "qq_group": "QQ群",
    "personal_email": "个人邮箱",
    "donation_thanks": "资助感谢",
    "donate_now": "立刻资助本站",
    "tracked_videos": "收录视频",
    "tracked_videos_suffix": "个",
    "covered_members": "覆盖P主",
    "covered_members_suffix": "位",
    "data_records": "数据记录",
    "data_records_suffix": "条",
    "30_days_increment": "30日增幅",
    "recent_updates": "更新动态",
    "see_more": "查看更多",
    "page_brief_intro": {
      "video": "本站收录的所有视频，包括B站{0}分区下的所有视频和部分其他分区中的VC视频。",
      "member": "本站收录的所有视频的B站UP主和staff们。",
      "sprint": "VC传说冲刺曲目助攻计划，收录B站接近{0}要求的曲目视频，记录播放、收藏等数据变化，提供传说助攻参考。",
      "tool": "泛VC数据记录与分享相关所需要的辅助工具。"
    }
  },
  "en": {
    "tdd_introduction_brief": "Committed to enhance VOCALOID CHINA related data exchange, fetching VC related data regularly and show meaningful parts to everyone.",
    "know_more": "Know More",
    "contact_us": "Contact Us",
    "qq_group": "QQ Group",
    "personal_email": "Personal E-mail",
    "donation_thanks": "Donation Thanks",
    "donate_now": "Donate TDD Now",
    "tracked_videos": "Tracked Videos",
    "tracked_videos_suffix": " ",
    "covered_members": "Covered Uploaders",
    "covered_members_suffix": " ",
    "data_records": "Data Records",
    "data_records_suffix": " ",
    "30_days_increment": "30 Days Increment",
    "recent_updates": "Recent Updates",
    "see_more": "See more",
    "page_brief_intro": {
      "video": "All tracked videos, including all videos under {0} category and some VC related videos in other categories.",
      "member": "All uploaders and staff of all tracked videos.",
      "sprint": "VC 1M videos sprint assistance project, tracking Biliili videos which near the requirements of {0}, monitoring trending of video data such as views, favorites etc. for sprint assistance reference",
      "tool": "Usefull tools for pan VC data collecting and sharing."
    }
  }
}
</i18n>

<template>
  <div>
    <div v-wechat-title="$t('page_title.home')"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item>{{ $t('page_name.home') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-carousel autoplay >
      <div class="carousel-page">
        <div class="carousel-page-container">
          <div class="carousel-p1-text">
            <h1>{{ $t('tdd') }}</h1>
            <div v-if="$store.getters.clientMode === 'MOBILE'" style="height: 42px; overflow-x: scroll">
              {{ $t('tdd_introduction_brief') }}
            </div>
            <p v-else>{{ $t('tdd_introduction_brief') }}</p>
            <div style="margin-top: 20px">
              <a-button type="primary" @click="() => this.$router.push('/about')">{{ $t('know_more') }}</a-button>
              <a-popover :title="$t('contact_us')" trigger="hover" placement="bottom">
                <div slot="content">
                  {{ $t('qq_group') }}{{ $t('colon') }}<a target="_blank" href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a><a-icon type="qrcode" style="margin-left: 8px; margin-right: 4px"/><a target="_blank" :href="qqgroup_qrcode">{{ $t('qr_code') }}</a><br/>
                  {{ $t('personal_email') }}{{ $t('colon') }}<a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a>
                </div>
                <a-button style="margin-left: 8px">{{ $t('contact_us') }}</a-button>
              </a-popover>
            </div>
          </div>
          <div class="carousel-p1-image">
            <img :src="logo_max" alt="logo" />
          </div>
        </div>
      </div>
      <div class="carousel-page">
        <div class="carousel-page-container">
          <h1>{{ $t('donation_thanks') }}</h1>
          <div class="carousel-p4-table-container">
            <tdd-donate-log-list :donate-log-list="donateLogList" />
            <div style="margin-top: 8px; overflow: hidden">
              <div style="float: right; margin-right: 8px">
                <a href="https://afdian.net/@bunnyxt" target="_blank" @click="$service.reportInteraction('home_donate_click', '')">{{ $t('donate_now') }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="carousel-page">
        <div class="carousel-page-container">
          <template v-if="this.$store.getters.clientMode === 'MOBILE'">
            <div style="overflow: hidden">
              <div class="carousel-p2-mobile-row1-col">
                <a-statistic :title="$t('tracked_videos')" :value="latestVideoCount">
                  <template v-slot:suffix>
                    {{ $t('tracked_videos_suffix') }}
                  </template>
                </a-statistic>
              </div>
              <div class="carousel-p2-mobile-row1-col">
                <a-statistic :title="$t('covered_members')" :value="latestMemberCount">
                  <template v-slot:suffix>
                    {{ $t('covered_members_suffix') }}
                  </template>
                </a-statistic>
              </div>
            </div>
            <a-statistic :title="$t('data_records')" :value="latestVideoRecordCount">
              <template v-slot:suffix>
                {{ $t('data_records_suffix') }}
              </template>
            </a-statistic>
          </template>
          <template v-else>
            <div style="overflow: hidden">
              <div style="margin-bottom: 12px">
              </div>
              <div class="carousel-p2-col-narrow">
                <a-statistic :title="$t('tracked_videos')" :value="latestVideoCount" style="padding: 8px 20px 0 20px">
                  <template v-slot:suffix>
                    {{ $t('tracked_videos_suffix') }}
                  </template>
                </a-statistic>
                <a-statistic :title="$t('30_days_increment')" :value="last30DayVideoCount" style="padding: 8px 20px 0 20px">
                  <template #prefix>
                    <a-icon type="arrow-up" />
                  </template>
                </a-statistic>
              </div>
              <div class="carousel-p2-col-narrow">
                <a-statistic :title="$t('covered_members')" :value="latestMemberCount" style="padding: 8px 20px 0 20px">
                  <template v-slot:suffix>
                    {{ $t('covered_members_suffix') }}
                  </template>
                </a-statistic>
                <a-statistic :title="$t('30_days_increment')" :value="last30DayMemberCount" style="padding: 8px 20px 0 20px">
                  <template #prefix>
                    <a-icon type="arrow-up" />
                  </template>
                </a-statistic>
              </div>
              <div class="carousel-p2-col-wide">
                <a-statistic :title="$t('data_records')" :value="latestVideoRecordCount" style="padding: 8px 20px 0 20px">
                  <template v-slot:suffix>
                    {{ $t('data_records_suffix') }}
                  </template>
                </a-statistic>
                <a-statistic :title="$t('30_days_increment')" :value="last30DayVideoRecordCount" style="padding: 8px 20px 0 20px">
                  <template #prefix>
                    <a-icon type="arrow-up" />
                  </template>
                </a-statistic>
              </div>
            </div>
          </template>
          <div style="text-align: right; color: rgba(0, 0, 0, 0.45); margin-top: 8px">
            <p>*{{ $t('till') }}{{ latestStatDailyTimeStr }}</p>
          </div>
        </div>
      </div>
      <div class="carousel-page">
        <div class="carousel-page-container">
          <h1>{{ $t('recent_updates') }}</h1>
          <div class="carousel-p3-timeline-container">
            <a-timeline>
              <a-timeline-item
                v-for="updateLog in updateLogList"
                :key="updateLog.added"
                :color="getTimelineItemColor(updateLog.type)"
              >
                <b>{{ $util.tsToDateString(updateLog.added, 'yyyy-MM-dd') }}</b> {{ updateLog.content }}
              </a-timeline-item>
              <a-button slot="pending" type="link" @click="() => this.$router.push('/about/updatelog')">{{ $t('see_more') }}...</a-button>
            </a-timeline>
          </div>
        </div>
      </div>
    </a-carousel>
    <div class="section-separator"></div>
    <div class="section-block">
      <div style="overflow: hidden">
        <div style="float: left">
          <h1>{{ $t('page_name.video') }}</h1>
        </div>
        <div style="float: right; margin-top: 8px">
          <a-button size="small" @click="fetchRandomVideoList(6)"><a-icon type="reload" />{{ refreshString }}</a-button>
          <a-button size="small" @click="() => this.$router.push('/video')" style="margin-left: 8px">{{ moreString }}<a-icon type="arrow-right" /></a-button>
        </div>
      </div>
      <p>
        <i18n path="page_brief_intro.video" tag="label">
          <a href="https://www.bilibili.com/v/music/vocaloid/" target="_blank">VOCALOID·UTAU</a>
        </i18n>
      </p>
      <p style="display: flex">
        <tdd-video-abid-auto-complete v-model="jumpVideoTargetIdObj" />
        <a-button
          type="primary"
          :disabled="typeof jumpVideoTargetIdObj.id === 'string' ? jumpVideoTargetIdObj.id.length === 0 : true"
          @click="goJumpVideo"
          style="margin-left: 8px"
        >{{ $t('go_jump') }}</a-button>
      </p>
      <a-spin :spinning="isLoadingRandomVideoList">
        <tdd-video-list
          :video-list="randomVideoList.slice(0, listColNum)"
          mode="grid"
          @item-clicked="randomVideoListItemClickedHandler"
        ></tdd-video-list>
      </a-spin>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <div style="overflow: hidden">
        <div style="float: left">
          <h1>{{ $t('page_name.member') }}</h1>
        </div>
        <div style="float: right; margin-top: 8px">
          <a-button size="small" @click="fetchRandomMemberList(6)"><a-icon type="reload" />{{ refreshString }}</a-button>
          <a-button size="small" @click="() => this.$router.push('/member')" style="margin-left: 8px">{{ moreString }}<a-icon type="arrow-right" /></a-button>
        </div>
      </div>
      <p>{{ $t('page_brief_intro.member') }}</p>
      <a-spin :spinning="isLoadingRandomMemberList">
        <tdd-member-list
          :member-list="randomMemberList.slice(0, listColNum)"
          @item-clicked="randomMemberListItemClickedHandler"
        ></tdd-member-list>
      </a-spin>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <div style="overflow: hidden">
        <div style="float: left">
          <h1>{{ $t('page_name.sprint') }}</h1>
        </div>
        <div style="float: right; margin-top: 8px">
          <a-button size="small" @click="getSprintVideoListFiltered"><a-icon type="reload" />{{ refreshString }}</a-button>
          <a-button size="small" @click="() => this.$router.push('/sprint')" style="margin-left: 8px">{{ moreString }}<a-icon type="arrow-right" /></a-button>
        </div>
      </div>
      <p>
        <i18n path="page_brief_intro.sprint" tag="label" for="vocaloid_china_1m_song">
          <a href="https://zh.moegirl.org/Vocaloid中文传说曲" target="_blank">{{ $t('vocaloid_china_1m_song') }}</a>
        </i18n>
      </p>
      <a-spin :spinning="isLoadingSprintVideoList">
        <tdd-video-list
          :video-list="sprintVideoListFiltered.slice(0, listColNum)"
          mode="grid"
          :show-stat-bar="false"
          :show-mobile-view="false"
          :show-sprint-board="true"
          @item-clicked="sprintVideoListItemClickedHandler"
        ></tdd-video-list>
      </a-spin>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <div style="overflow: hidden">
        <div style="float: left">
          <h1>{{ $t('page_name.tool') }}</h1>
        </div>
        <div style="float: right; margin-top: 8px">
          <a-button size="small" @click="() => this.$router.push('/tool')">{{ moreString }}<a-icon type="arrow-right" /></a-button>
        </div>
      </div>
      <p>{{ $t('page_brief_intro.tool') }}</p>
      <ul>
        <li>
          <router-link to="/tool/datecalc">{{ $t('tool_info.datecalc.name') }}</router-link>{{ $t('colon') }}{{ $t('tool_info.datecalc.brief_intro') }}
        </li>
        <li>
          <router-link to="/tool/biliapi">{{ $t('tool_info.biliapi.name') }}</router-link>{{ $t('colon') }}{{ $t('tool_info.biliapi.brief_intro') }}
        </li>
        <li>
          <router-link to="/tool/zkcalc">{{ $t('tool_info.zkcalc.name') }}</router-link>{{ $t('colon') }}{{ $t('tool_info.zkcalc.brief_intro') }}
        </li>
        <li>
          <router-link to="/tool/abid">{{ $t('tool_info.abid.name') }}</router-link>{{ $t('colon') }}{{ $t('tool_info.abid.brief_intro') }}
        </li>
        <li>
          <router-link to="/tool/ts">{{ $t('tool_info.ts.name') }}</router-link>{{ $t('colon') }}{{ $t('tool_info.ts.brief_intro') }}
        </li>
        <li>
          <router-link to="/tool/compare">{{ $t('tool_info.compare.name') }}</router-link>{{ $t('colon') }}{{ $t('tool_info.compare.brief_intro') }}
        </li>
        <li>
          <router-link to="/tool/text-abid-description-replacement">{{ $t('tool_info.text-abid-description-replacement.name') }}</router-link>{{ $t('colon') }}{{ $t('tool_info.text-abid-description-replacement.brief_intro') }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import TddDonateLogList from "@/components/common/TddDonateLogList";
import TddVideoList from "../common/TddVideoList"
import TddMemberList from "../common/TddMemberList";
import logo_max from '../../assets/img/logo_max.png'
import qqgroup_qrcode from '../../assets/img/qrcode_1580391374617.jpg'
import TddVideoAbidAutoComplete from "@/components/common/TddVideoAbidAutoComplete";

export default {
  name: "Home",
  components: {
    TddVideoList,
    TddMemberList,
    TddDonateLogList,
    TddVideoAbidAutoComplete,
  },
  data: function () {
    return {
      logo_max: logo_max,
      qqgroup_qrcode: qqgroup_qrcode,
      isLoadingStatDailyList: false,
      statDailyList: [],
      statDailyTotalCount: 0,
      isLoadingUpdateLogList: false,
      updateLogList: [],
      isLoadingDonateLogList: false,
      donateLogList: [],
      jumpVideoTargetIdObj: { id: '', type: 'aid' },
      videoAidTitleList: [],
      isLoadingRandomVideoList: false,
      randomVideoList: [],
      isLoadingRandomMemberList: false,
      randomMemberList: [],
      isLoadingSprintVideoList: false,
      sprintVideoList: [],
      sprintVideoListFiltered: []
    }
  },
  computed: {
    videoAidTitleListStringified: function () {
      return this.videoAidTitleList.map(x => {
        let obj = {};
        obj.aid = '' + x.aid;
        obj.title = x.title;
        return obj;
      });
    },
    latestStatDaily: function () {
      let length = this.statDailyList.length;
      if (length > 0) {
        return this.statDailyList[length - 1];
      } else {
        return null;
      }
    },
    latestVideoCount: function () {
      if (this.latestStatDaily) {
        return this.latestStatDaily.video_count;
      } else {
        return -1;
      }
    },
    latestMemberCount: function () {
      if (this.latestStatDaily) {
        return this.latestStatDaily.member_count;
      } else {
        return -1;
      }
    },
    latestVideoRecordCount: function () {
      if (this.latestStatDaily) {
        return this.latestStatDaily.video_record_count;
      } else {
        return -1;
      }
    },
    latestStatDailyTimeStr: function () {
      if (this.latestStatDaily) {
        return this.$util.tsToDateString(this.latestStatDaily.added);
      } else {
        return this.$util.tsToDateString(0);
      }
    },
    last30DayVideoCount: function () {
      const length = this.statDailyList.length;
      if (length > 0) {
        return this.statDailyList[length - 1].video_count - this.statDailyList[0].video_count;
      } else {
        return 0;
      }
    },
    last30DayMemberCount: function () {
      const length = this.statDailyList.length;
      if (length > 0) {
        return this.statDailyList[length - 1].member_count - this.statDailyList[0].member_count;
      } else {
        return 0;
      }
    },
    last30DayVideoRecordCount: function () {
      const length = this.statDailyList.length;
      if (length > 0) {
        return this.statDailyList[length - 1].video_record_count - this.statDailyList[0].video_record_count;
      } else {
        return 0;
      }
    },
    refreshString: function () {
      if (this.$store.getters.clientMode === 'MOBILE') {
        return '';
      } else {
        return this.$t('refresh');
      }
    },
    moreString: function () {
      if (this.$store.getters.clientMode === 'MOBILE') {
        return '';
      } else {
        return this.$t('more');
      }
    },
    listColNum: function () {
      let width = this.$store.state.clientWidth; // TODO bug here, in chrome this will cut scrollbar width, about 15px
      if (width < 576) {
        // return 1;
        return 3;
      } else if (width < 768) {
        return 2;
      } else if (width < 992) {
        return 3;
      } else if (width < 1200) {
        return 3;
      } else if (width < 1600) {
        return 4;
      } else {
        return 6;
      }
    }
  },
  methods: {
    goJumpVideo: function () {
      this.$router.push(`/video/${
        {aid: 'av', bvid: 'BV'}[this.jumpVideoTargetIdObj.type]
      }${this.jumpVideoTargetIdObj.id}`);
    },
    onAidInputChange: function () {
      if (this.videoAidInput && this.videoAidInput.toLowerCase().startsWith('av')) {
        this.videoAidInput = this.videoAidInput.slice(2);
      }
      if (this.videoAidInput && this.videoAidInput.length >= 4) {
        this.fetchVideoAidTileList();
      } else {
        this.videoAidTitleList = [];
      }
    },
    fetchVideoAidTileList: function () {
      this.isLoadingVideoAidTitleList = true;
      if ('' + parseInt(this.videoAidInput) !== this.videoAidInput) {
        this.isLoadingVideoAidTitleList = false;
        return;
      }
      let url = 'video/aidtitle?aid=' + this.videoAidInput;
      let that = this;
      this.$axios.get(url)
        .then(function (response) {
          that.videoAidTitleList = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingVideoAidTitleList = false;
        });
    },
    fetchStatDailyList: function () {
      this.isLoadingStatDailyList = true;
      let now = new Date();
      let start_ts = Math.floor(now.valueOf() / 1000) - 30 * 24 * 60 * 60; // 30 days before
      let url = 'statdaily?start_ts=' + start_ts;
      let that = this;
      this.$axios.get(url)
        .then(function (response) {
          that.statDailyList = response.data;
          that.statDailyTotalCount = parseInt(response.headers['x-total-count']);
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingStatDailyList = false;
        });
    },
    fetchUpdateLogList: function () {
      this.isLoadingUpdateLogList = true;
      let last_count = 3;
      let url = 'updatelog?last_count=' + last_count;
      let that = this;
      this.$axios.get(url)
        .then(function (response) {
          that.updateLogList = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingUpdateLogList = false;
        });
    },
    fetchDonateLogList: function () {
      this.isLoadingDonateLogList = true;
      let that = this;
      this.$axios.get('donatelog')
        .then(function (response) {
          that.donateLogList = response.data.sort((a, b) => b.added - a.added);
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingDonateLogList = false;
        });
    },
    getTimelineItemColor: function (type) {
      let timelineItemColorArray = ['blue', 'blue', 'red', 'green'];
      return timelineItemColorArray[type];
    },
    fetchRandomVideoList: function (count) {
      this.isLoadingRandomVideoList = true;
      let url = '/video/random?count=' + count;
      let that = this;
      this.$axios.get(url)
        .then(function (response) {
          that.randomVideoList = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingRandomVideoList = false;
        });
    },
    fetchRandomMemberList: function (count) {
      this.isLoadingRandomMemberList = true;
      let url = '/member/random?count=' + count;
      let that = this;
      this.$axios.get(url)
        .then(function (response) {
          that.randomMemberList = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingRandomMemberList = false;
        });
    },
    fetchSprintVideoList: function () {
      let that = this;
      this.isLoadingSprintVideoList = true;
      fetch(this.$store.state.apiBase + "sprint_video.php?status=processing")
        .then(response => response.json())
        .then(json => this.sprintVideoList = json.data)
        .then(function () {
          // change to new data format
          for (let i = 0; i < that.sprintVideoList.length; i++) {
            that.sprintVideoList[i].pubdate = that.sprintVideoList[i].created;
          }
          that.sprintVideoList.sort((a, b) => b.last_record.view - a.last_record.view);
          that.getSprintVideoListFiltered();
          that.isLoadingSprintVideoList = false;
        });
    },
    getSprintVideoListFiltered: function () {
      let lastAidList = [];
      this.sprintVideoListFiltered.forEach(video => lastAidList.push(video.aid));
      this.sprintVideoListFiltered = [];
      let max = this.sprintVideoList.length;
      let indexList = [];

      while (indexList.length < 6) {
        let index = Math.floor(Math.random() * max);
        if (indexList.indexOf(index) === -1 && lastAidList.indexOf(this.sprintVideoList[index].aid) === -1) {
          indexList.push(index);
          this.sprintVideoListFiltered.push(this.sprintVideoList[index]);
        }
      }
    },
    sprintVideoListItemClickedHandler: function (item) {
      this.$router.push('sprint/av' + item.aid);
    },
    randomVideoListItemClickedHandler: function (item) {
      this.$store.commit('setVideoDetailDrawerVideo', item);
      this.$store.commit('setVideoDetailDrawerVisibility', true);
    },
    randomMemberListItemClickedHandler: function (item) {
      this.$router.push('member/' + item.mid);
    }
  },
  created() {
    this.fetchStatDailyList();
    this.fetchUpdateLogList();
    this.fetchDonateLogList();
    this.fetchRandomVideoList(6);
    this.fetchRandomMemberList(6);
    this.fetchSprintVideoList();
  }
};
</script>

<style scoped>
/* home page carousel related */
.ant-carousel >>> .slick-dots li.slick-active button {
  background: #192c3e;
}
.ant-carousel >>> .slick-dots li button {
  background: #364d79;
}
.ant-carousel >>> .slick-slide {
  background: #fff;
  height: 300px;
}

.carousel-page {
  height: 300px;
  padding: 50px 20px;
  text-align: center;
}
.carousel-page-container {
  max-width: 600px;
  text-align: left;
  margin: auto;
  overflow: hidden;
}

.carousel-p1-text {
  float: left;
  width: 60%;
}
.carousel-p1-image {
  float: left;
  width: 40%;
  text-align: center;
}
.carousel-p1-image img {
  margin: auto;
  width: 60%;
}

.carousel-p2-col-narrow {
  float: left;
  width: 30%;
}
.carousel-p2-col-wide {
  float: left;
  width: 40%;
}
.carousel-p2-mobile-row1-col {
  float: left;
  width: 50%;
}

.carousel-p4-table-container {
  overflow-y: auto;
  height: 140px;
}

.carousel-p3-timeline-container {
  overflow-y: auto;
  height: 140px;
  padding-top: 4px;
}

@media only screen and (max-width: 576px) {
  .ant-carousel >>> .slick-slide {
    height: 188px;
  }
  .carousel-page {
    height: 188px;
    padding: 12px 20px;
  }
  .carousel-p1-text {
    width: 100%;
  }
  .carousel-p1-image {
    display: none;
  }
  .carousel-p3-timeline-container {
    height: 100px;
  }
  .carousel-p4-table-container {
    height: 100px;
  }
}
</style>
