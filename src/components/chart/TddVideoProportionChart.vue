<i18n src="@/i18n/common.json"></i18n>

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
        { prop: `${this.$t('like')}${this.$t('ratio_suffix')}`, percent: like / view },
        { prop: `${this.$t('share')}${this.$t('ratio_suffix')}`, percent: share / view },
        { prop: `${this.$t('coin')}${this.$t('ratio_suffix')}`, percent: coin / view },
        { prop: `${this.$t('favorite')}${this.$t('ratio_suffix')}`, percent: favorite / view },
        { prop: `${this.$t('reply')}${this.$t('ratio_suffix')}`, percent: reply / view },
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
        .color('prop', [ '#926bb8', '#88cae9', '#716cf1', '#efc14e', '#697795' ])
        .tooltip('percent', val => {
          return {
            name: this.$t('ratio'),
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
