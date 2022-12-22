<i18n src="@/i18n/common.json"></i18n>

<template>
  <a-table
    :columns="columns"
    :rowKey="video => video.id"
    :dataSource="videoList"
    :pagination="false"
    :scroll="{ x: 1400 }"
    size="small"
  >
    <template #pic="item">
      <img
        width="108px"
        height="65px"
        alt="pic"
        :src="$util.httpS(item.pic)"
        @click="videoPicClickHandler(item)"
        style="cursor: pointer"
      />
    </template>
    <template #videoTitle="title">
      <div class="video-title">
        {{ title }}
      </div>
    </template>
    <template #member="item">
      <router-link :to="'/member/' + item.mid">{{ item.member.name }}</router-link>
    </template>
    <template #added="added">
      {{ $util.tsToDateString(added) }}
    </template>
    <template #value="value">
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
          title: this.$t('pic'),
          scopedSlots: { customRender: 'pic' },
          width: '120px',
          fixed: 'left',
        }, {
          title: this.$t('title'),
          dataIndex: 'title',
          scopedSlots: { customRender: 'videoTitle' },
        }, {
          title: this.$t('page_name.member'),
          scopedSlots: { customRender: 'member' },
          width: '80px',
        }, {
          title: this.$t('pubdate'),
          dataIndex: 'pubdate',
          scopedSlots: { customRender: 'added' },
          width: '108px',
        }, {
          title: this.$t('view'),
          dataIndex: 'laststat.view',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: this.$t('danmaku'),
          dataIndex: 'laststat.danmaku',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: this.$t('reply'),
          dataIndex: 'laststat.reply',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: this.$t('favorite'),
          dataIndex: 'laststat.favorite',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: this.$t('coin'),
          dataIndex: 'laststat.coin',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: this.$t('share'),
          dataIndex: 'laststat.share',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: this.$t('like'),
          dataIndex: 'laststat.like',
          scopedSlots: { customRender: 'value' },
          width: '100px'
        }, {
          title: this.$t('tdd_favorite_time'),
          dataIndex: 'favorite_added',
          scopedSlots: { customRender: 'added' },
          width: '108px',
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
