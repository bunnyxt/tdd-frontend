<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/video">所有视频</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div class="section-block">
      <h1>所有视频</h1>
      <p>TODO Some introduction words</p>
      <p>TODO Filter</p>
    </div>
    <div class="section-seperator"></div>
    <div class="section-block">
      <a-spin :spinning="isLoadingVideoList">
        <a-list itemLayout="vertical" size="large" :pagination="pagination" :dataSource="videoList">
          <a-list-item slot="renderItem" slot-scope="item" key="item.id">
            <a-row>
              <a-col :xs="24" :sm="8" :md="6" :xl="4" style="padding: 8px">
                <img width="100%" height="100%" alt="pic" :src="item.pic"/>
              </a-col>
              <a-col :xs="24" :sm="16" :md="18" :xl="20" style="padding: 8px">
                <h3 class="video-title" style="">{{item.title}}</h3>
                <p>
                  <a-icon type="user" style="margin-right: 4px"/>{{item.mid}}
                  <a-icon type="calendar" style="margin-left: 8px; margin-right: 4px"/>{{tsToStr(item.pubdate)}}
                </p>
              </a-col>
            </a-row>
          </a-list-item>
        </a-list>
      </a-spin>
    </div>
  </div>
</template>

<script>
  export default {
    name: "VideoHome",
    components: {

    },
    data: function() {
      return {
        videoList: [],
        isLoadingVideoList: false,
        pagination: {

        },
      }
    },
    methods: {
      fetchVideoList: function () {
        this.isLoadingVideoList = true;
        fetch("https://api.bunnyxt.com/tdd/v2/videos/vc")
          .then(response => response.json())
          .then(json => this.videoList = json)
          .then(() => this.isLoadingVideoList = false);
      },
      addZero: function(value) {
        return value < 10 ? "0" + value : "" + value;
      },
      tsToStr: function (ts) {
        let date = new Date(ts * 1000);
        let dateString = "";
        dateString += date.getFullYear() + "-";
        dateString += this.addZero(date.getMonth() + 1) + "-";
        dateString += this.addZero(date.getDate()) + " ";
        dateString += this.addZero(date.getHours()) + ":";
        dateString += this.addZero(date.getMinutes()) + ":";
        dateString += this.addZero(date.getSeconds());
        return dateString;
      }
    },
    created() {
      this.isLoadingVideoList = false;
      this.fetchVideoList();
    }
  }
</script>

<style scoped>
.video-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>