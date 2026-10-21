<template>
  <section class="section-block" aria-label="数据源切换">
    <h2>数据源切换</h2>
    <p>仅影响当前浏览器的冲刺、日报及相关工具。切换后刷新页面。</p>
    <p>当前：{{ mode }}；网站默认：{{ defaultMode }}</p>
    <a-radio-group :value="selection" @change="change">
      <a-radio-button value="default">跟随网站默认</a-radio-button>
      <a-radio-button value="v1">v1</a-radio-button>
      <a-radio-button value="v2">v2</a-radio-button>
    </a-radio-group>
    <a-alert v-if="error" :message="error" type="error" />
  </section>
</template>
<script>
import { legacyMode, legacyDefault, legacyOverride, setLegacyOverride } from '@/api/legacy';
export default {
  data: () => ({ mode: legacyMode, defaultMode: legacyDefault, selection: legacyOverride || 'default', error: '' }),
  methods: {
    change(event) {
      try { setLegacyOverride(event.target.value); }
      catch (e) { this.error = '无法保存浏览器设置，请允许本站使用本地存储后重试。'; }
    },
  },
};
</script>
