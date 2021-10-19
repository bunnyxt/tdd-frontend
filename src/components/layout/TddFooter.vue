<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "api_doc": "接口文档",
    "source_code": "项目源码",
    "donate_tdd": "资助本站",
    "contact_us": "联系我们"
  },
  "en": {
    "api_doc": "Api Doc",
    "source_code": "Source Code",
    "donate_tdd": "Donate TDD",
    "contact_us": "Contact Us"
  }
}
</i18n>

<template>
  <a-layout-footer class="tdd-footer">
    {{ $t('tdd') }} by
    <a href="https://www.bunnyxt.com" target="_blank">bunnyxt</a><br/>
    <a href="https://api.bunnyxt.com/tdd/doc" target="_blank">{{ $t('api_doc') }}</a> |
    <a href="https://github.com/users/bunnyxt/projects/1" target="_blank">{{ $t('source_code') }}</a> |
    <a href="https://afdian.net/@bunnyxt" target="_blank">{{ $t('donate_tdd') }}</a> |
    <router-link to="/about/contactus">{{ $t('contact_us') }}</router-link>
    <br/>
    2017~2021 © All Rights Reserved<br/>
    <a href="https://beian.miit.gov.cn/" target="_blank">苏ICP备17067742号-1</a>
  </a-layout-footer>
</template>

<script>
export default {
  name: "TddFooter"
};
</script>

<style scoped>
.tdd-footer {
  text-align: center;
  height: 120px;
  font-size: 12px;
  padding: 24px 20px;
}
a {
  color: rgba(0, 0, 0, 0.65);
}
</style>
