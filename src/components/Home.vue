<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-carousel autoplay  >
      <div class="carousel-page">
        <div class="carousel-page-container">
          <div class="carousel-p1-text">
            <h1>天钿Daily</h1>
            <p>致力于推动VC相关数据交流，定期抓取VC相关数据，选取有意义的纬度展示。</p>
            <div style="margin-top: 20px">
              <a-button type="primary" @click="() => this.$router.push('/about')">了解更多</a-button>
              <a-popover title="联系我们" trigger="click" v-model="contactUsPopoverVisible" placement="bottom">
                <div slot="content">
                  QQ群：<a target="_blank" href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a><br/>
                  个人邮箱：<a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a>
                </div>
                <a-button style="margin-left: 8px">联系我们</a-button>
              </a-popover>
            </div>
          </div>
          <div class="carousel-p1-image">
            <img src="img/logo_64S.png" alt="logo" />
          </div>
        </div>
      </div>
      <div class="carousel-page">
        <div class="carousel-page-container">
          <div v-if="this.$store.getters.clientMode === 'MOBILE'">
            <div style="overflow: hidden">
              <div class="carousel-p2-mobile-row1-col">
                <a-statistic title="收录视频" :value="latestVideoCount">
                  <template v-slot:suffix>
                    个
                  </template>
                </a-statistic>
              </div>
              <div class="carousel-p2-mobile-row1-col">
                <a-statistic title="覆盖P主" :value="latestMemberCount">
                  <template v-slot:suffix>
                    位
                  </template>
                </a-statistic>
              </div>
            </div>
            <a-statistic title="数据记录" :value="latestVideoRecordCount">
              <template v-slot:suffix>
                条
              </template>
            </a-statistic>
          </div>
          <div v-else>
            <div style="overflow: hidden">
              <div class="carousel-p2-col">
                <a-statistic title="收录视频" :value="latestVideoCount">
                  <template v-slot:suffix>
                    个
                  </template>
                </a-statistic>
              </div>
              <div class="carousel-p2-col">
                <a-statistic title="覆盖P主" :value="latestMemberCount">
                  <template v-slot:suffix>
                    位
                  </template>
                </a-statistic>
              </div>
              <div class="carousel-p2-col">
                <a-statistic title="数据记录" :value="latestVideoRecordCount">
                  <template v-slot:suffix>
                    条
                  </template>
                </a-statistic>
              </div>
            </div>
          </div>
          <div style="text-align: right; color: rgba(0, 0, 0, 0.45)">
            <p>*截至{{ latestStatDailyTimeStr }}</p>
          </div>
        </div>
      </div>
      <div>
        还没想好加什么
      </div>
    </a-carousel>
    <div class="section-separator"></div>
    <div class="section-block">
      <h1>传送门</h1>
      <h3><router-link to="/video">所有视频</router-link></h3>
      <p>本站收录的所有视频，包括B站UV分区下的所有视频和部分其他分区中的VC视频。</p>
      <h3><router-link to="/sprint">传说助攻</router-link></h3>
      <p>VC传说冲刺曲目助攻计划，收录B站接近<a href="https://zh.moegirl.org/Vocaloid中文传说曲" target="_blank">中文VOCALOID传说曲</a>要求的曲目视频，记录播放、收藏等数据变化，提供传说助攻参考。</p>
      <h3><router-link to="/tool">辅助工具</router-link></h3>
      <p>泛VC数据记录与分享相关所需要的辅助工具。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data: function () {
    return {
      contactUsPopoverVisible: false,
      isLoadingStatDailyList: true,
      statDailyList: [],
      statDailyTotalCount: 0
    }
  },
  computed: {
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
        return this.formatDate(this.latestStatDaily.added);
      } else {
        return this.formatDate(0);
      }
    }
  },
  methods: {
    fetchStatDailyList: function () {
      this.isLoadingStatDailyList = true;
      let now = new Date();
      let start_ts = Math.floor(now.valueOf() / 1000) - 7 * 24 * 60 * 60; // 7 days before
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
    formatDate: function(ts) {
      let date = new Date(ts * 1000);
      return (
        date.getFullYear() + "-" +
        (date.getMonth()+1) + "-" +
        date.getDate() + " " +
        (date.getHours()<10?"0"+date.getHours():date.getHours()) + ":" +
        (date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes()) + ":" +
        (date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds())
      )
    },
  },
  created() {
    this.fetchStatDailyList();
  }
};
</script>

<style scoped>
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

  .carousel-p2-col {
    float: left;
    width: 33%;
  }
  .carousel-p2-mobile-row1-col {
    float: left;
    width: 50%;
  }
  /* MOBILE version */
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
  }
</style>