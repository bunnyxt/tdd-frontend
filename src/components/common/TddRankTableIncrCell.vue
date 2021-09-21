<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "increment_ratio": "增长占比"
  },
  "en": {
    "increment_ratio": "Increment Ratio"
  }
}
</i18n>

<template>
  <div>
    <div>
      {{ total.toLocaleString() }}
    </div>
    <div
      style="height: 4px; display: flex; margin-top: 2px; margin-bottom: 2px; cursor: help"
      :title="`${$t('increment_ratio')}${$t('colon')}${Number(incrProportion * 100).toFixed(2)}%`"
    >
      <div :style="{ background: '#e8e8e8', width: `${(1 - incrProportion) * 100}%`, height: '100%' }"></div>
      <div :class="`bg-color-${colorNum}`" :style="{ width: `${incrProportion * 100}%`, height: '100%' }"></div>
    </div>
    <div style="display: flex; justify-content: flex-end">
      <div :class="[`color-${colorNum}`]">{{incr > 0 ? '+' : ''}}{{ incr.toLocaleString() }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TddRankTableIncrCell',
  props: {
    total: {
      type: Number,
      required: true,
    },
    incr: {
      type: Number,
      required: true,
    },
    separator: {
      type: Object,
      required: true,
    },
  },
  computed: {
    incrProportion: function () {
      return this.total === 0 ? 0 : this.incr / this.total;
    },
    colorNum: function () {
      const value = this.incr;
      const separator = this.separator;
      if (!separator) {
        return 0;
      }
      if (value <= separator.a) {
        return 1;
      } else if (value <= separator.b) {
        return 2;
      } else if (value <= separator.c) {
        return 3;
      } else if (value <= separator.d) {
        return 4;
      } else {
        return 5;
      }
    },
  },
}
</script>

<style scoped>

</style>
