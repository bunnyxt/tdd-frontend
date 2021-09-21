<template>
  <a-alert v-if="showI18nLocaleSelect" type="info" banner closable @close="close">
    <div slot="message">
      Select Language:
      <a-select :value="i18nLocale" @change="handleI18nLocaleSelectChange" size="small" style="width: 92px">
        <a-select-option value="zh">
          简体中文
        </a-select-option>
        <a-select-option value="en">
          English
        </a-select-option>
      </a-select>
    </div>
  </a-alert>
</template>

<script>
export default {
  name: 'TddLanguageSelectBanner',
  data: function () {
    return {
      showI18nLocaleSelect: false,
      i18nLocale: 'zh',
    }
  },
  methods: {
    handleI18nLocaleSelectChange: function (locale) {
      this.i18nLocale = locale;
      this.$store.commit('setI18nLocale', locale);
      localStorage.setItem('tddLocale', locale);
    },
    close: function () {
      this.showI18nLocaleSelect = false;
    },
  },
  mounted() {
    // init locale
    
    // get two locale
    const environmentLocale = navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    let storedLocale = null;
    const tddLocale = localStorage.getItem('tddLocale');
    if (tddLocale !== null && ['zh', 'en'].includes(tddLocale)) {
      storedLocale = tddLocale;
    } else {
      localStorage.removeItem('tddLocale');
    }
    
    // set i18nLocale and showI18nLocaleSelect
    if (storedLocale === null) {
      if (environmentLocale === 'zh') {
        this.i18nLocale = environmentLocale;
      } else {
        this.i18nLocale = environmentLocale;
        this.showI18nLocaleSelect = true;
      }
    } else {
      this.i18nLocale = storedLocale;
      if (environmentLocale !== 'zh' || storedLocale !== 'zh') {
        this.showI18nLocaleSelect = true;
      }
    }
    this.$store.commit('setI18nLocale', this.i18nLocale);
  },
}
</script>

<style scoped>

</style>
