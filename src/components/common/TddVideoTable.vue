<template>
  <a-table
      :columns="columns"
      :rowKey="record => record.added"
      :dataSource="videoList"
      :pagination="false"
      :scroll="{ x: 700 }"
      size="small"
  >
    <template slot="pic" slot-scope="item">
      <img
          width="108px"
          height="65px"
          alt="pic"
          :src="item.pic"
          @click="videoPicClickHandler(item)"
          style="cursor: pointer"
      />
    </template>
    <template slot="videoTitle" slot-scope="title">
      <div class="video-title">
        {{ title }}
      </div>
    </template>
    <template slot="member" slot-scope="item">
      <router-link :to="'/member/' + item.mid">{{ item.member.name }}</router-link>
    </template>
    <template slot="added" slot-scope="added">
      {{ $util.tsToDateString(added) }}
    </template>
    <template slot="value" slot-scope="value">
      {{ value.toLocaleString() }}
    </template>
  </a-table>
</template>

<script>
  export default {
    name: 'TddVideoTable',
    props: {
      videoList: {
        type: Array,
        required: true
      }
    },
    data: function () {
      return {
        columns: [
          {
            title: '封面',
            scopedSlots: { customRender: 'pic' },
            width: '112px',
            fixed: 'left',
          }, {
            title: '标题',
            dataIndex: 'title',
            scopedSlots: { customRender: 'videoTitle' },
          }, {
            title: 'UP主',
            scopedSlots: { customRender: 'member' },
          }, {
            title: '投稿时间',
            dataIndex: 'pubdate',
            scopedSlots: { customRender: 'added' },
            width: '108px',
          }, {
            title: '关注时间',
            dataIndex: 'favorite_added',
            scopedSlots: { customRender: 'added' },
            width: '108px',
          }, {
            title: '播放',
            dataIndex: 'laststat.view',
            scopedSlots: { customRender: 'value' },
          }, {
            title: '弹幕',
            dataIndex: 'laststat.danmaku',
            scopedSlots: { customRender: 'value' },
          }, {
            title: '评论',
            dataIndex: 'laststat.reply',
            scopedSlots: { customRender: 'value' },
          }, {
            title: '收藏',
            dataIndex: 'laststat.favorite',
            scopedSlots: { customRender: 'value' },
          }, {
            title: '硬币',
            dataIndex: 'laststat.coin',
            scopedSlots: { customRender: 'value' },
          }, {
            title: '分享',
            dataIndex: 'laststat.share',
            scopedSlots: { customRender: 'value' },
          }, {
            title: '点赞',
            dataIndex: 'laststat.like',
            scopedSlots: { customRender: 'value' },
          }
        ]
      }
    },
    methods: {
      videoPicClickHandler: function (item) {
        this.$store.commit('setVideoDetailDrawerVideo', item);
        this.$store.commit('setVideoDetailDrawerVisibility', true);
      }
    }
  }
</script>

<style scoped>
  .video-title {
    height: 65px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
</style>