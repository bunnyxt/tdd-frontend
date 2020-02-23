<template>
  <div class="video-stat-bar">
    <span class="stat-item"><a-icon type="play-circle" class="stat-item-icon" />{{ view }}</span><span v-html="separator"></span>
    <span class="stat-item"><a-icon type="profile" class="stat-item-icon" />{{ danmaku }}</span><span v-html="separator"></span>
    <span class="stat-item"><a-icon type="message" class="stat-item-icon" />{{ reply }}</span><span v-html="separator"></span>
    <span class="stat-item"><a-icon type="star" class="stat-item-icon" />{{ favorite }}</span><span v-html="separator"></span>
    <span class="stat-item"><a-icon type="dollar" class="stat-item-icon" />{{ coin }}</span><span v-html="separator"></span>
    <span class="stat-item"><a-icon type="share-alt" class="stat-item-icon" />{{ share }}</span><span v-html="separator"></span>
    <span class="stat-item"><a-icon type="like" class="stat-item-icon" />{{ like }}</span>
  </div>
</template>

<script>
  export default {
    name: 'TddVideoStatBar',
    props: {
      stat: Object,
      mode: String,
      showName: Boolean
    },
    data: function () {
      return {
        nameDict: {
          view: '播放',
          danmaku: '弹幕',
          reply: '评论',
          favorite: '收藏',
          coin: '硬币',
          share: '收藏',
          like: '点赞'
        }
      }
    },
    methods: {
      getStatValue: function (property) {
        if (this.stat && this.stat[property] !== undefined) {
          return this.stat[property];
        } else {
          return -1;
        }
      },
      getStatName: function (property) {
        if (this.showName) {
          return this.nameDict[property] + '：';
        } else {
          return '';
        }
      },
      getStatDisplay: function (property) {
        return this.getStatName(property) + this.getStatValue(property).toLocaleString();
      }
    },
    computed: {
      displayMode: function () {
        if (this.mode === 'vertical') {
          return 'vertical';
        } else {
          return 'bar';
        }
      },
      view: function () {
        return this.getStatDisplay('view');
      },
      danmaku: function () {
        return this.getStatDisplay('danmaku');
      },
      reply: function () {
        return this.getStatDisplay('reply');
      },
      favorite: function () {
        return this.getStatDisplay('favorite');
      },
      coin: function () {
        return this.getStatDisplay('coin');
      },
      share: function () {
        return this.getStatDisplay('share');
      },
      like: function () {
        return this.getStatDisplay('like');
      },
      separator: function () {
        if (this.displayMode === 'vertical') {
          return '<br>';
        } else if (this.displayMode === 'bar') {
          return '<span style="color: #e8e8e8; margin: 0 8px">|</span>';
        } else {
          return '';
        }
      }
    }
  }
</script>

<style scoped>
  .stat-item {
    white-space: nowrap;
  }
  .stat-item-icon {
    margin-right: 8px;
  }
</style>