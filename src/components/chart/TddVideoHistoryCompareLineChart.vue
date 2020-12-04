<template>
  <div>
    <tdd-line-chart
      v-if="prefixedData.length > 0"
      id="tdd-video-history"
      :data="prefixedData"
      :option="option"
    />
  </div>
</template>

<script>
import TddLineChart from "@/components/chart/TddLineChart";

export default {
  name: 'TddVideoHistoryCompareLineChart',
  props: {
    videoCompareList: {
      type: Array,
      required: true,
    },
  },
  components: {
    TddLineChart,
  },
  data: function () {
    return {
      renameMap: {
        view: '播放',
        danmaku: '弹幕',
        reply: '评论',
        favorite: '收藏',
        coin: '硬币',
        share: '分享',
        like: '点赞',
      },
      option: {
        configPanel: {
          showBasePoint: null,
        },
        dateRangePanel: {
          soloProp: null,
        },
        data: {
          transform: {
            rename: {},
            fold: [],
          },
        },
      },
      prefixedData: [],
    }
  },
  watch: {
    videoCompareList: function () {
      this.init();
    },
  },
  methods: {
    init: function () {
      let prefixedData = [];
      const option = {
        configPanel: {
          showBasePoint: null,
        },
        dateRangePanel: {
          soloProp: null,
        },
        data: {
          transform: {
            rename: {},
            fold: [],
          },
          showSliderLine: false,
        },
      };
      for (let { records, config } of this.videoCompareList) {
        const prefix = `${config.title} - `;
        const propRenameMap = {};
        for (let prop of config.props) {
          const prefixedProp = `${prefix}${prop}`;
          const renamedProp = `${prefix}${this.renameMap[prop]}`
          propRenameMap[prop] = prefixedProp;
          option.data.transform.rename[prefixedProp] = renamedProp;
          option.data.transform.fold.push(renamedProp);
        }
        prefixedData = [
          ...prefixedData,
          ...new this.$util.DataView().source(records).transform({
            type: 'rename',
            map: propRenameMap,
          }).rows,
        ];
      }
      this.option = option;
      this.prefixedData = prefixedData;
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style scoped>

</style>
