<i18n src="@/i18n/common.json"></i18n>
<i18n src="@/i18n/tool.json"></i18n>

<template>
  <div>
    <div v-wechat-title="`${$t('tool_info.compare.name')} - ${$t('page_title._tdd')}`"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/tool">{{ $t('page_name.tool') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('tool_info.compare.name') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <a-alert message="WORK IN PROGRESS" style="margin-bottom: 16px" banner/>
      <h1>{{ $t('tool_info.compare.name') }}</h1>
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
            <a-auto-complete
              :placeholder="{ 'aid': '456930', 'bvid': '19x411F7kL' }[addVideoPrefix]"
              v-model="addVideoId"
              @change="addVideoIdChangeHandler"
              optionLabelProp="text"
              allowClear
              style="width: calc(100% - 130px); min-width: 128px; max-width: 400px"
            >
              <template slot="dataSource">
                <a-select-option v-for="item in addVideoIdCandidateList" :key="item.id" :text="item.id" >
                  {{ item.id }} - {{ item.title }}
                </a-select-option>
              </template>
            </a-auto-complete>
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
      <a-alert
        v-if="hasDuplicateConfigTitle"
        message="检测到「自定义标注」命名重复，图表绘制出错，请重新命名"
        type="error"
        style="margin-bottom: 12px"
        banner
        closable
      />
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
          <a-input
            v-model="item.config.title"
            @change="$util.debounce(videoCompareListChangeHandler, 500)()"
          />
        </template>
        <template slot="videoConfigProps" slot-scope="item">
          <a-checkbox-group
            :options="configPropsOptions"
            v-model="item.config.props"
            @change="$util.debounce(videoCompareListChangeHandler, 500)()"
          />
        </template>
        <template slot="videoManipulation" slot-scope="item">
          <a-button
            title="上移"
            @click="moveVideoInVideoCompareList(item.aid, 'up')"
            style="margin-right: 12px"
          >
            <a-icon type="arrow-up" />
          </a-button>
          <a-button
            title="下移"
            @click="moveVideoInVideoCompareList(item.aid, 'down')"
            style="margin-right: 12px"
          >
            <a-icon type="arrow-down" />
          </a-button>
          <a-popconfirm
            :title="`确定删除av${item.aid}？`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="removeFromVideoCompareList(item.aid)"
          >
            <a-button
              title="删除"
            >
              <a-icon type="delete" />
            </a-button>
          </a-popconfirm>
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
        width: '180px',
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
      addVideoIdCandidateList: [],
      isLoadingAddVideoIdCandidateList: false,
    };
  },
  computed: {
    hasDuplicateConfigTitle: function () {
      return (new Set(this.videoCompareList.map(video => video.config.title))).size < this.videoCompareList.length;
    },
    // add video related
    isAddVideoIdValid: function () {
      const prefix = this.addVideoPrefix;
      const id = this.addVideoId;
      if (!id) {
        return false;
      }
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
    moveVideoInVideoCompareList: function (aid, direction) {
      let canMove, swapOffset;
      if (direction === 'up') {
        canMove = (videoIndex, videoCompareList) => videoIndex > 0;
        swapOffset = -1;
      } else if (direction === 'down') {
        canMove = (videoIndex, videoCompareList) => videoIndex < videoCompareList.length;
        swapOffset = 1;
      } else {
        // invalid direction
        return;
      }
      
      const videoCompareListString = localStorage.getItem('videoCompareList') || '[]';
      const videoCompareList = JSON.parse(videoCompareListString);
      const videoIndex = videoCompareList.findIndex(video => video.aid === aid);
      
      if (canMove(videoIndex, videoCompareList)) {
        const tmp = videoCompareList[videoIndex + swapOffset];
        videoCompareList[videoIndex + swapOffset] = videoCompareList[videoIndex];
        videoCompareList[videoIndex] = tmp;
      }
      localStorage.setItem('videoCompareList', JSON.stringify(videoCompareList));
      this.videoCompareList = videoCompareList;
    },
    removeFromVideoCompareList: function (aid) {
      const videoCompareListString = localStorage.getItem('videoCompareList') || '[]';
      const videoCompareList = JSON.parse(videoCompareListString);
      const newVideoCompareList = videoCompareList.filter(video => video.aid !== aid);
      localStorage.setItem('videoCompareList', JSON.stringify(newVideoCompareList));
      this.videoCompareList = newVideoCompareList;
    },
    videoCompareListChangeHandler: function () {
      localStorage.setItem('videoCompareList', JSON.stringify(this.videoCompareList));
      this.loadVideoCompareList();
    },
    addVideoButtonClickHandler: function () {
      const that = this;
      
      that.isAddingVideo = true;
      
      const aid = that.addVideoPrefix === 'aid'
        ? parseInt(that.addVideoId)
        : that.addVideoPrefix === 'bvid'
          ? that.$util.b2a(that.addVideoId)
          : -1;
      
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
          if (video.length === 0) {
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
    addVideoIdChangeHandler: function () {
      const prefix = this.addVideoPrefix;
      const id = this.addVideoId;
      const isIdValid = this.isAddVideoIdValid;
      if (prefix === 'aid') {
        if (isIdValid && id.length > 3) {
          this.$util.debounce(this.fetchVideoIdCandidateList, 500)(prefix, id);
        }
      } else if (prefix === 'bvid') {
        this.$util.debounce(this.fetchVideoIdCandidateList, 500)(prefix, id);
      }
    },
    fetchVideoIdCandidateList: function (type, id) {
      if (!(type === 'aid' || type === 'bvid')) {
        return;
      }
      this.isLoadingAddVideoIdCandidateList = true;
      const url = `video/${type}title?${type}=${id}`;
      const that = this;
      this.$axios.get(url)
        .then(function (response) {
          that.addVideoIdCandidateList = response.data.map(x => ({
            id: String(x[type]),
            title: x['title'],
          }));
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingAddVideoIdCandidateList = false;
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
