<template>
  <div>
    <div class="line-1" style="margin-bottom: 8px">
      将参与排名的所有视频的单一属性排序，按比例划分为5类，分别用不同的颜色标记
    </div>
    <div style="display: flex">
      <div class="bg-color-5 color-mark-block" title="x > list[size * 0.1%]">0.1%</div>
      <div class="bg-color-4 color-mark-block" title="list[size * 0.1%] >= x > list[size * 1%]">0.9%</div>
      <div class="bg-color-3 color-mark-block" title="list[size * 1%] >= x > list[size * 10%]">9%</div>
      <div class="bg-color-2 color-mark-block" title="list[size * 10%] >= x > list[size * 50%]">40%</div>
      <div class="bg-color-1 color-mark-block" title="list[size * 50%] >= x">50%</div>
    </div>
    <div style="display: flex">
      <div style="width: 0.5px"></div>
      <div class="color-mark-separator"></div>
      <div class="color-mark-separator"></div>
      <div class="color-mark-separator"></div>
      <div class="color-mark-separator"></div>
    </div>
    <div style="display: flex">
      <div style="width: 10%"></div>
      <div class="color-mark-number line-1">{{ currentColor.d.toLocaleString() }}</div>
      <div class="color-mark-number line-1">{{ currentColor.c.toLocaleString() }}</div>
      <div class="color-mark-number line-1">{{ currentColor.b.toLocaleString() }}</div>
      <div class="color-mark-number line-1">{{ currentColor.a.toLocaleString() }}</div>
    </div>
    <div class="line-1" style="text-align: center; margin-top: 8px">
      当前临界数据显示：
      <a-dropdown>
        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
          {{ getPropertyName(currentProperty) }} <a-icon type="down" />
        </a>
        <a-menu slot="overlay" @click="changeCurrentProperty">
          <a-menu-item v-for="property of propertyList" :key="property">
            <a href="javascript:;">{{ getPropertyName(property) }}</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RankHomeColorMark',
  props: {
    color: {
      type: Object,
      required: true,
    },
  },
  data: function () {
    return {
      currentProperty: 'incr_view',
      propertyNameMapper: {
        'incr_view': '播放增量',
        'incr_danmaku': '弹幕增量',
        'incr_reply': '评论增量',
        'incr_favorite': '收藏增量',
        'incr_coin': '硬币增量',
        'incr_share': '分享增量',
        'incr_like': '点赞增量',
        'point': '得分',
      },
    };
  },
  computed: {
    currentColor: function () {
      return this.color[this.currentProperty];
    },
    propertyList: function () {
      const candidateList = ['incr_view', 'incr_danmaku', 'incr_reply', 'incr_favorite', 'incr_coin', 'incr_share', 'incr_like', 'point'];
      const existedList = [];
      for (const property of candidateList) {
        if (this.color.hasOwnProperty(property)) {
          existedList.push(property);
        }
      }
      return existedList;
    },
  },
  watch: {
    color: function () {
      this.initCurrentProperty();
    },
  },
  methods: {
    getPropertyName: function (property) {
      return this.propertyNameMapper[property] ? this.propertyNameMapper[property] : property;
    },
    changeCurrentProperty: function (e) {
      this.currentProperty = e.key;
      this.$service.reportInteraction('rank_home_color_mark_change_property', JSON.stringify({ property: e.key }));
    },
    initCurrentProperty: function () {
      if (this.color.hasOwnProperty('point')) {
        this.currentProperty = 'point';
      } else {
        this.currentProperty = 'view_incr';
      }
    },
  },
  mounted() {
    this.initCurrentProperty();
  },
}
</script>

<style scoped>
.color-mark-block {
  height: 24px;
  width: 20%;
  color: white;
  line-height: 24px;
  text-align: center;
  transition: all .2s;
}
.color-mark-block:hover {
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.65);
  cursor: help;
}
.color-mark-separator {
  height: 12px;
  width: 20%;
  border-right: 1px solid rgba(0, 0, 0, 0.65);
}
.color-mark-number {
  width: 20%;
  text-align: center;
}
</style>
