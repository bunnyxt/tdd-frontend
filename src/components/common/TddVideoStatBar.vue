<i18n src="@/i18n/common.json"></i18n>

<template>
  <div class="video-stat-bar">
    <span class="stat-item"><play-circle-outlined class="stat-item-icon" />{{ view }}</span><span v-html="separator"></span>
    <span class="stat-item"><profile-outlined class="stat-item-icon" />{{ danmaku }}</span><span v-html="separator"></span>
    <span class="stat-item"><message-outlined class="stat-item-icon" />{{ reply }}</span><span v-html="separator"></span>
    <span class="stat-item"><star-outlined class="stat-item-icon" />{{ favorite }}</span><span v-html="separator"></span>
    <span class="stat-item"><dollar-outlined class="stat-item-icon" />{{ coin }}</span><span v-html="separator"></span>
    <span class="stat-item"><share-alt-outlined class="stat-item-icon" />{{ share }}</span><span v-html="separator"></span>
    <span class="stat-item"><like-outlined class="stat-item-icon" />{{ like }}</span>
  </div>
</template>

<script>
import { PlayCircleOutlined, ProfileOutlined, MessageOutlined, StarOutlined, DollarOutlined, ShareAltOutlined, LikeOutlined } from '@ant-design/icons-vue';

export default {
  name: 'TddVideoStatBar',
  components: {
    PlayCircleOutlined,
    ProfileOutlined,
    MessageOutlined,
    StarOutlined,
    DollarOutlined,
    ShareAltOutlined,
    LikeOutlined,
  },
  props: {
    stat: Object,
    mode: String,
    showName: Boolean
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
        return `${this.$t(property)}${this.$t('colon')}`;
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
