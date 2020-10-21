<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/tool">辅助工具</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>视频对比</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <a-alert message="WORK IN PROGRESS" style="margin-bottom: 16px" banner/>
      <h1>视频对比</h1>
      <p>想对比多个视频的历史趋势？前往视频详情页面，点击"历史趋势"下的"添加到对比列表"按钮，回到本页面，即可查看。注意：当前只支持视频的最近200条记录。</p>
      <h3>对比列表</h3>
      <a-table
        :columns="columns"
        :rowKey="x => x.aid"
        :dataSource="videoCompareList"
        :scroll="{ x: 850 }"
        :pagination="false"
        size="small"
        style="margin-bottom: 16px"
      >
        <template slot="videoAid" slot-scope="aid">
          <a :href="`https://tdd.bunnyxt.com/video/av${aid}`" target="_blank">{{ aid }}</a>
        </template>
        <template slot="videoTitle" slot-scope="item">
          <a :href="`https://www.bilibili.com/video/av${item.aid}`" target="_blank">{{ item.video.title }}</a>
        </template>
        <template slot="videoConfigTitle" slot-scope="item">
          <!-- TODO prompt when two video has same title -->
          <a-input v-model="item.config.title" @change="videoCompareListChangeHandler" />
        </template>
        <template slot="videoConfigProps" slot-scope="item">
          <a-checkbox-group :options="configPropsOptions" v-model="item.config.props" @change="videoCompareListChangeHandler" />
        </template>
        <template slot="videoManipulation" slot-scope="item">
          <a @click="removeFromVideoCompareListHandler(item.aid)">移除</a>
        </template>
      </a-table>
      <h3>趋势对比</h3>
      <tdd-video-history-compare-line-chart :video-compare-list="videoCompareList" />
    </div>
  </div>
</template>

<script>
import TddVideoHistoryCompareLineChart from "@/components/chart/TddVideoHistoryCompareLineChart";

export default {
  name: 'VideoCompare',
  components: {
    TddVideoHistoryCompareLineChart,
  },
  data: function () {
    return {
      videoCompareList: [],
      columns: [{
        title: 'aid',
        dataIndex: 'aid',
        scopedSlots: { customRender: 'videoAid' },
        width: '120px',
      }, {
        title: '标题',
        scopedSlots: { customRender: 'videoTitle' },
      }, {
        title: '自定义标注',
        scopedSlots: { customRender: 'videoConfigTitle' },
      }, {
        title: '属性选择',
        scopedSlots: { customRender: 'videoConfigProps' },
      }, {
        title: '操作',
        scopedSlots: { customRender: 'videoManipulation' },
        width: '60px',
      }],
      configPropsOptions: [{
        label: '播放',
        value: 'view',
      }, {
        label: '弹幕',
        value: 'danmaku',
      }, {
        label: '评论',
        value: 'reply',
      }, {
        label: '收藏',
        value: 'favorite',
      }, {
        label: '硬币',
        value: 'coin',
      }, {
        label: '分享',
        value: 'share',
      }, {
        label: '点赞',
        value: 'like',
      }],
    }
  },
  methods: {
    loadVideoCompareList: function () {
      const videoCompareListString = localStorage.getItem('videoCompareList');
      if (videoCompareListString) {
        this.videoCompareList = JSON.parse(videoCompareListString);
      } else {
        this.videoCompareList = [];
        localStorage.setItem('videoCompareList', '[]');
      }
    },
    removeFromVideoCompareListHandler: function (aid) {
      const videoCompareListString = localStorage.getItem('videoCompareList') || '[]';
      const videoCompareList = JSON.parse(videoCompareListString);
      const newVideoCompareList = videoCompareList.filter(video => video.aid !== aid);
      localStorage.setItem('videoCompareList', JSON.stringify(newVideoCompareList));
      this.videoCompareList = newVideoCompareList;
    },
    // debounce: function (fun, delay) {
    //   return function (args) {
    //     let that = this;
    //     let _args = args;
    //     clearTimeout(fun.id);
    //     fun.id = setTimeout(function () {
    //       fun.call(that, _args)
    //     }, delay);
    //   };
    // },
    // TODO add debounce
    videoCompareListChangeHandler: function () {
      localStorage.setItem('videoCompareList', JSON.stringify(this.videoCompareList));
      this.loadVideoCompareList();
    },
  },
  mounted() {
    this.loadVideoCompareList();
  }
}
</script>

<style scoped>

</style>
