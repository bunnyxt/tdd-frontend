<i18n src="@/i18n/common.json"></i18n>

<template>
  <div>
    <div v-wechat-title="$t('page_title.404')"></div>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>404 NOT FOUND</h1>
      <a-icon type="home" style="margin-right: 8px"/>
      <router-link to="/">{{ $t('back_to_home') }}</router-link>
      <a-icon type="rollback" style="margin-left: 24px; margin-right: 8px"/>
      <a @click="$router.go(-1)">{{ $t('back_to_previous_page') }}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  data: function () {
    return {
      sectionBlockStyle : {
        background: '#fff',
        padding: '24px',
        margin: '16px 0',
        textAlign: 'center'
      }
    }
  }
}
</script>
