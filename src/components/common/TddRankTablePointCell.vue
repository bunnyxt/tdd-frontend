<template>
  <div>
    <div :class="[`color-${colorNum}`]">{{ point.toLocaleString() }}</div>
    <div style="display: flex; justify-content: space-between">
      <div style="flex-grow:1; margin-right: 4px" title="修正A">
        <div
          style="height: 4px; display: flex; margin-top: 2px; margin-bottom: 2px"
        >
          <div :class="`bg-color-${colorNum}`" :style="{ width: `${xiua * 100}%`, height: '100%' }"></div>
          <div :style="{ background: '#e8e8e8', width: `${(1 - xiua) * 100}%`, height: '100%' }"></div>
        </div>
        <div>
          {{ Number(xiua).toFixed(2) }}
        </div>
      </div>
      <div style="flex-grow:1; margin-left: 4px" title="修正B">
        <div
          style="height: 4px; display: flex; margin-top: 2px; margin-bottom: 2px"
        >
          <div :style="{ background: '#e8e8e8', width: `${(1 - xiub / 50) * 100}%`, height: '100%' }"></div>
          <div :class="`bg-color-${colorNum}`" :style="{ width: `${xiub / 50 * 100}%`, height: '100%' }"></div>
        </div>
        <div style="display: flex; justify-content: flex-end">
          {{ Number(xiub).toFixed(2) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TddRankTablePointCell',
  props: {
    point: {
      type: Number,
      required: true,
    },
    xiua: {
      type: Number,
      required: true,
    },
    xiub: {
      type: Number,
      required: true,
    },
    separator: {
      type: Object,
      required: true,
    },
  },
  computed: {
    colorNum: function () {
      const value = this.point;
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
