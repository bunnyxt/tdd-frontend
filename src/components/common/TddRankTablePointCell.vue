<i18n src="@/i18n/common.json"></i18n>

<template>
  <div>
    <div :class="[`color-${colorNum}`]">{{ point.toLocaleString() }}</div>
    <div>
      <div class="xiu-block" style="width: calc(50% - 4px); margin-right: 4px" :title="$t('xiu_a')">
        <div
          style="height: 4px; display: flex; margin-top: 2px; margin-bottom: 2px"
        >
          <div :class="`bg-color-${colorNum}`" :style="{ width: `${xiua_limited * 100}%`, height: '100%' }"></div>
          <div :style="{ background: '#e8e8e8', width: `${(1 - xiua_limited) * 100}%`, height: '100%' }"></div>
        </div>
        <div :class="[xiua === xiua_limited ? '' : 'invalid-xiu']">
          {{ Number(xiua).toFixed(2) }}
        </div>
      </div>
      <div class="xiu-block" style="width: calc(50% - 4px); margin-left: 4px" :title="$t('xiu_b')">
        <div
          style="height: 4px; display: flex; margin-top: 2px; margin-bottom: 2px"
        >
          <div :style="{ background: '#e8e8e8', width: `${(1 - xiub_limited / 50) * 100}%`, height: '100%' }"></div>
          <div :class="`bg-color-${colorNum}`" :style="{ width: `${xiub_limited / 50 * 100}%`, height: '100%' }"></div>
        </div>
        <div :class="[xiub === xiub_limited ? '' : 'invalid-xiu']" style="display: flex; justify-content: flex-end">
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
      // type: Object,  // maybe undefined
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
    xiua_limited: function () {
      return Math.min(Math.max(this.xiua, 0), 1);  // limited in [0, 1]
    },
    xiub_limited: function () {
      return Math.min(Math.max(this.xiub, 0), 50);  // limited in [0, 50]
    }
  },
}
</script>

<style scoped>
.xiu-block {
  cursor: pointer;
  display: inline-block;
}
.invalid-xiu {
  color: #d32f2f;
}
</style>
