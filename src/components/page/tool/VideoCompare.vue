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
      <p>想对比多个视频的历史趋势？前往视频详情页面，点击"历史趋势"下的"添加到对比列表"按钮，或直接在下方"添加视频"输入框中添加，回到本页面，即可查看。注意：当前只支持视频的最近200条记录。</p>
      <h3>添加视频</h3>
      <div style="margin-bottom: 12px">
        <a-spin :spinning="isAddingVideo">
          <a-input-group compact >
            <a-select default-value="aid" v-model="addVideoPrefix">
              <a-select-option value="aid">
                <span style="margin-right: 8px">av</span>
              </a-select-option>
              <a-select-option value="bvid">
                <span style="margin-right: 8px">BV</span>
              </a-select-option>
            </a-select>
            <a-input
              :placeholder="{ 'aid': '456930', 'bvid': '19x411F7kL' }[addVideoPrefix]"
              style="width: 50%; min-width: 128px; max-width: 200px"
              v-model="addVideoId"
            />
            <a-button
              type="primary"
              :disabled="!isAddVideoIdValid"
              :title="isAddVideoIdValid ? '添加视频' : `请输入正确的视频${addVideoPrefix}`"
              @click="addVideoButtonClickHandler"
            >
              添加
            </a-button>
          </a-input-group>
        </a-spin>
      </div>
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
      // add video related
      addVideoPrefix: 'aid',
      addVideoId: '',
      isAddingVideo: false,
    };
  },
  computed: {
    // add video related
    isAddVideoIdValid: function () {
      const prefix = this.addVideoPrefix;
      const id = this.addVideoId;
      if (prefix === 'aid') {
        if (id.length <= 0) {
          return false;
        }
        if (String(parseInt(id)) !== id) {
          return false;
        }
      } else if (prefix === 'bvid') {
        if (id.length !== 10) {
          return false;
        }
        if (!(id.charAt(0) === '1' && id.charAt(3) === '4' && id.charAt(5) === '1' && id.charAt(7) === '7')) {  // 1??4?1?7??
          return false;
        }
      } else {
        return false;
      }
      return true;
    },
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
    // add video related
    addVideoButtonClickHandler: function () {
      const aid = this.addVideoPrefix === 'aid'
        ? parseInt(this.addVideoId)
        : this.addVideoPrefix === 'bvid'
          ? this.$util.b2a(this.addVideoId)
          : -1;
      
      this.isAddingVideo = true;
      
      const that = this;
      const getVideoByAid = function (aid) {
        return that.$axios.get(
          `/video/${aid}`
        );
      };
      const getVideoRecordsByAid = function (aid) {
        return that.$axios.get(
          `/video/${aid}/record`
        );
      };
      this.$axios.all([
        getVideoByAid(aid),
        getVideoRecordsByAid(aid),
      ])
        .then(that.$axios.spread( function (
          videoResponse, videoRecordsResponse
        ) {
          const video = videoResponse.data;
          const records = videoRecordsResponse.data;
          if (records.length === 0) {
            that.$message.error('添加失败！视频不在本站收录范围内');
          } else {
            const newVideo = {
              aid,
              video,
              // records: [],
              records: records.slice(-200),
              config: {
                title: `av${aid}`,
                props: ['view'],
              },
            };
            const newVideoCompareList = [...that.videoCompareList.filter(video => video.aid !== newVideo.aid), newVideo];
            that.videoCompareList = newVideoCompareList;
            localStorage.setItem('videoCompareList', JSON.stringify(newVideoCompareList));
            that.addVideoId = '';
            that.$message.success('添加成功！');
          }
        }))
        .catch(function (error) {
          console.log(error);
          that.$message.error('添加失败！');
        })
        .finally(function () {
          that.isAddingVideo = false;
        });
    },
  },
  mounted() {
    this.loadVideoCompareList();
  }
}
</script>

<style scoped>

</style>
