<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>传说助攻</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <a-carousel autoplay>
        <div>
          <h1>关于传说助攻</h1>
          <p>VC传说冲刺曲目助攻计划，收录B站接近<a href="https://zh.moegirl.org/Vocaloid中文传说曲" target="_blank">中文VOCALOID传说曲</a>要求的曲目视频，目前以<strong>80万</strong>播放数作为收录标准。</p>
          <p>曲目信息每10分钟更新一次，存在一定的延迟。移动端访问本站可能出现图表较小、查看不便等问题，可尝试将设备横过来，使用<strong>横屏浏览</strong>。</p>
          <p>
            点击<a-icon type="play-circle" title="立刻助攻"/>跳转至B站视频页进行助攻<br/>
            点击<a-icon type="line-chart" title="查看详情"/>查看本站记录的冲刺数据详情
          </p>
          <p>
            数据交流与系统反馈
          </p>
          <ul>
            <li>
              QQ群：<a target="_blank" href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a>
            </li>
            <li>
              个人邮箱：<a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a>
            </li>
          </ul>
          <div class="SlickDotsSpace">
          </div>
        </div>
        <div>
          <h1>助攻日报</h1>
          <p>
            基于传说助攻的数据，以<strong>UTC+8 06:00至次日06:00</strong>为统计区间，每日刊发一期的助攻日报，记录当日各冲刺视频播放数及播放数变化情况。
          </p>
          <a-spin :spinning="isLoadingDaily">
            <p>最后更新⬇️</p>
            <h2>助攻日报<router-link :to="'sprint/daily/'+sprintDaily.date">#{{ sprintDaily.date }}</router-link></h2>
            <div v-if="sprintDaily.correct == 1">
              <p>本期收录时间范围：<strong>UTC+8 {{ sprintDailyDateStart }} 06:00 ~ {{ sprintDailyDateEnd }} 06:00</strong>，共收录传说冲刺曲目<strong>{{ sprintDaily.vidnum }}</strong>首。</p>
              <p>本期传说冲刺曲目播放数总增长<strong>{{ sprintDaily.viewincr }}</strong>，与上一期相比<strong>{{ sprintDaily.viewincrincr > 0 ? "增长"+sprintDaily.viewincrincr:"减少"+(-sprintDaily.viewincrincr) }}</strong>。</p>
              <div v-if="sprintDaily.newvids.length > 0">
                <p>本期有<strong>{{ sprintDaily.newvids.length }}</strong>首新曲</p>
              </div>
              <div v-if="sprintDaily.millvids.length > 0">
                <p>本期有<strong>{{ sprintDaily.millvids.length }}</strong>首曲目达成传说</p>
              </div>
            </div>
            <div v-else>
              <a-alert type="error" :message="sprintDaily.comment" banner style="margin-bottom: 12px"/>
            </div>
          </a-spin>
          <p>查看<router-link to="/sprint/daily">往期助攻日报</router-link></p>
          <div class="SlickDotsSpace">
          </div>
        </div>
        <div>
          <h1>助攻推荐</h1>
          <SprintVideoInfo :video="mostViewedVideo" :promotionReason="'最多播放'"/>
          <div class="SlickDotsSpace">
          </div>
        </div>
        <div>
          <h1>助攻推荐</h1>
          <SprintVideoInfo :video="earliestCreatedVideo" :promotionReason="'最早投稿'"/>
          <div class="SlickDotsSpace">
          </div>
        </div>
        <div>
          <h1>助攻推荐</h1>
          <SprintVideoInfo :video="randomSelectedVideo" :promotionReason="'随机推荐'"/>
          <div class="SlickDotsSpace">
          </div>
        </div>
      </a-carousel>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <h1>助攻列表</h1>
      <a-spin :spinning="isLoadingVideo">
        <a-collapse>
          <a-collapse-panel header="条件筛选" style="margin-bottom: 12px">
            <p>歌姬：<a-checkbox-group :options="singerOptions" v-model="singerValues"/></p>
            <p>分类：<a-checkbox-group :options="soloOptions" v-model="soloValues"/></p>
            <p>分类：<a-checkbox-group :options="originalOptions" v-model="originalValues"/></p>
            <p>排序：
              <a-radio-group name="sortByGroup" v-model="sortByValue">
                <a-radio :value="1">播放数</a-radio>
                <a-radio :value="2">投稿时间</a-radio>
              </a-radio-group>
            </p>
            <p>排序：
              <a-radio-group name="sortOrderGroup" v-model="sortOrderValue">
                <a-radio :value="1">升序</a-radio>
                <a-radio :value="2">降序</a-radio>
              </a-radio-group>
            </p>
          </a-collapse-panel>
        </a-collapse>
        <a-list
          :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 }"
          :dataSource="sprintVideoListFiltered"
        >
          <a-list-item class="sprint-video-item" slot="renderItem" slot-scope="item">
            <SprintVideoBrief
              :key="item.id"
              :video="item"
              :imgHeight="sprintVideoImgHeight"
            ></SprintVideoBrief>
          </a-list-item>
        </a-list>
      </a-spin>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <h1>历史助攻*</h1>
      <p>*展示已达成传说的，本系统曾经记录过的历史助攻曲目视频</p>
      <a-spin :spinning="isLoadingFinishedVideo">
        <a-list
          :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 }"
          :dataSource="sprintFinishedVideoList"
        >
          <a-list-item class="sprint-video-item" slot="renderItem" slot-scope="item">
            <SprintVideoBrief
              :key="item.id"
              :video="item"
              :imgHeight="sprintVideoImgHeight"
            ></SprintVideoBrief>
          </a-list-item>
        </a-list>
      </a-spin>
    </div>
  </div>
</template>

<script>
import SprintVideoBrief from "./SprintVideoBrief.vue";
import SprintVideoInfo from './SprintVideoInfo.vue';

export default {
  name: "SprintHome",
  components: {
    SprintVideoBrief,
    SprintVideoInfo
  },
  data: function() {
    return {
      sprintVideoList: [],
      sprintFinishedVideoList: [],
      sprintVideoImgHeight: '200px',
      sprintDaily: {
        date: 19700101,
        correct: 1,
        vidnum: 0,
        newvids: [],
        millvids: [],
        viewincr: 0,
        viewincrincr: 0,
        comment: ""
      },
      isLoadingVideo: false,
      isLoadingFinishedVideo: false,
      isLoadingDaily: false,
      singerOptions: [],
      singerValues: [],
      soloOptions: ['独唱', '合唱'],
      soloValues: ['独唱', '合唱'],
      originalOptions: ['原创曲', '翻唱曲'],
      originalValues: ['原创曲', '翻唱曲'],
      sortByValue: 1,
      sortOrderValue: 2,
      mostViewedVideo: {},
      earliestCreatedVideo: {},
      randomSelectedVideo: {}
    };
  },
  computed: {
    sprintVideoListFiltered: function() {
      let list = []
      // filter
      for (let i = 0; i < this.sprintVideoList.length; i++) {
        if (this.containsSinger(this.sprintVideoList[i].singer)) { // singer filter
          if (this.satisfySolo(this.sprintVideoList[i].solo)) { // solo filter
            if (this.satisfyOriginal(this.sprintVideoList[i].original)) { // original filter
              list.push(this.sprintVideoList[i])
            }
          }
        }
      }
      // sort
      switch (this.sortByValue) {
        case 1:
          if (this.sortOrderValue == 1) {
            list.sort(
              (o1, o2) => o1.last_record.view - o2.last_record.view
            )
          } else if (this.sortOrderValue == 2) {
            list.sort(
              (o1, o2) => o2.last_record.view - o1.last_record.view
            )
          }
          break;
        case 2:
          if (this.sortOrderValue == 1) {
            list.sort(
              (o1, o2) => o1.created - o2.created
            )
          } else if (this.sortOrderValue == 2) {
            list.sort(
              (o1, o2) => o2.created - o1.created
            )
          }
          break;
        default:
          break;
      }
      return list
    },
    sprintDailyDateStart: function() {
      let date = this.sprintDaily.date + ""
      let d = new Date()
      d.setFullYear(date.substring(0, 4))
      d.setMonth(date.substring(4, 6) - 1)
      d.setDate(date.substring(6, 8))
      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(0)
      d.setMilliseconds(0)
      let ts = d.valueOf() / 1000 - (60 * 60 * 24)
      d = new Date(ts * 1000)
      return d.getFullYear() +"-"+ (d.getMonth()+1) +"-"+ d.getDate()
    },
    sprintDailyDateEnd: function() {
      let date = this.sprintDaily.date + ""
      let d = new Date()
      d.setFullYear(date.substring(0, 4))
      d.setMonth(date.substring(4, 6) - 1)
      d.setDate(date.substring(6, 8))
      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(0)
      d.setMilliseconds(0)
      return d.getFullYear() +"-"+ (d.getMonth()+1) +"-"+ d.getDate()
    },
  },
  watch: {
    sprintVideoList: function() {
      if (this.sprintVideoList.length > 0) {
        let videos = this.sprintVideoList
        let mostViewed = videos[0]
        let mostViewedIndex = 0
        let earliestCreated = videos[0]
        let earliestCreatedIndex = 0
        for (let i = 0; i < videos.length; i++) {
          let video = videos[i]
          if (video.last_record.view > mostViewed.last_record.view) {
            mostViewed = video
            mostViewedIndex = i
          }
          if (video.created < earliestCreated.created) {
            earliestCreated = video
            earliestCreatedIndex = i
          }
        }

        let randomIndexes = new Array()
        for (let i = 0; i < videos.length; i++) {
          if (i != mostViewedIndex && i != earliestCreatedIndex) {
            randomIndexes.push(i)
          }
        }
        let randomSelectedIndex = Math.floor(Math.random() * randomIndexes.length)
        let randomSelected = videos[randomSelectedIndex]

        this.mostViewedVideo = mostViewed
        this.earliestCreatedVideo = earliestCreated
        this.randomSelectedVideo = randomSelected
      }
    }
  },
  methods: {
    containsSinger: function (singers) {
      let result = false
      for (let i = 0; i < singers.length; i++) {
        if (this.singerValues.indexOf(singers[i]) > -1) {
          result = true
          break
        }
      }
      return result
    },
    satisfySolo: function (solo) {
      let result = false
      let option = solo == 1 ? '独唱' : '合唱'
      if (this.soloValues.indexOf(option) > -1) {
        result = true
      }
      return result
    },
    satisfyOriginal: function (original) {
      let result = false
      let option = original == 1 ? '原创曲' : '翻唱曲'
      if (this.originalValues.indexOf(option) > -1) {
        result = true
      }
      return result
    }
  },
  created: function() {
    this.isLoadingVideo = true
    this.isLoadingFinishedVideo = true
    this.isLoadingDaily = true
    fetch(this.$store.state.apiBase + "sprint_video.php?status=processing")
      .then(response => response.json())
      .then(json => this.sprintVideoList = json.data)
      .then(
        () => {
          this.singerOptions = []
          for (let i = 0; i < this.sprintVideoList.length; i++) {
            for (let j = 0; j < this.sprintVideoList[i].singer.length; j++) {
              if (this.singerOptions.indexOf(this.sprintVideoList[i].singer[j]) == -1) {
                this.singerOptions.push(this.sprintVideoList[i].singer[j])
              }
            }
          }
          this.singerValues = this.singerOptions
        }
      )
      .then(() => this.isLoadingVideo = false)
    fetch(this.$store.state.apiBase + "sprint_video.php?status=finished")
      .then(response => response.json())
      .then(json => this.sprintFinishedVideoList = json.data)
      .then(() => this.isLoadingFinishedVideo = false)
    fetch(this.$store.state.apiBase + "sprint_daily.php?limit=1")
      .then(response => response.json())
      .then(json => this.sprintDaily = json.data[0])
      .then(() => this.isLoadingDaily = false)
  },
  mounted: function(){
    let that = this;
    window.addEventListener('resize',() => that.sprintVideoImgHeight = `${document.getElementsByClassName("sprint-video-card").item(0).clientWidth / 1.6}px`,false);
  }
};
</script>

<style scoped>
.SlickDotsSpace {
  height: 16px;
}

.ant-carousel >>> .slick-dots li button {
  background: #364d79;
}

.ant-carousel >>> .slick-dots li.slick-active button {
  background: #364d79;
}
</style>
