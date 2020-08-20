<template>
  <div>
    <div id="video-proportion-chart"></div>
  </div>
</template>

<script>
import { Chart } from '@antv/g2';

export default {
  name: 'TddVideoProportionChart',
  props: {
    stat: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      chart: null,
    }
  },
  computed: {
    proportion: function () {
      const view = this.stat.view;
      const reply = this.stat.reply;
      const favorite = this.stat.favorite;
      const coin = this.stat.coin;
      const share = this.stat.share;
      const like = this.stat.like;
      return [
        { prop: '点赞率', percent: like / view },
        { prop: '分享率', percent: share / view },
        { prop: '投币率', percent: coin / view },
        { prop: '收藏率', percent: favorite / view },
        { prop: '评论率', percent: reply / view },
      ]; // read from outer to inner
    }
  },
  watch: {
    proportion: function () {
      this.chart.destroy();
      this.draw();
    }
  },
  methods: {
    draw: function () {
      this.chart = new Chart({
        container: 'video-proportion-chart',
        autoFit: true,
        height: 168,
        padding: [ 2, 0, 0, 0 ],
      });
      this.chart.data(this.proportion);
      this.chart.scale('percent', {
        min: 0,
        max: Math.max(...this.proportion.map(x => x.percent)) * 1.15
      });
      this.chart.tooltip({
        title: 'prop'
      });
      this.chart.legend(false);
      this.chart.coordinate('polar', { innerRadius: 0.1 }).transpose();
      this.chart.interval()
        .position('prop*percent')
        .color('prop', [ '#323cbf', '#58bcf1', '#7b4cd8', '#24336f', '#f3cc49' ])
        .tooltip('percent', val => {
          return {
            name: '占比',
            value: (val * 100).toFixed(2) + '%'
          };
        });
      this.proportion.map(obj => {
        this.chart.annotation().text({
          position: [ obj.prop, 0 ],
          content: obj.prop + ' ',
          style: {
            textAlign: 'right'
          }
        });
      });
      this.chart.interaction('element-active');
      this.chart.render();
    }
  },
  mounted: function () {
    this.draw();
  }
}
</script>

<style scoped>

</style>
