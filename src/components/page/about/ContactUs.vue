<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "contact_official_info": "感谢您对天钿Daily的支持！天钿Daily目前由站长{0}一人开发、维护、运营，您可以通过以下方式与本站取得联系：",
    "contact_official_qq_group": "官方QQ群：{0} {1} {2}",
    "contact_official_webmaster_email": "站长个人邮箱：{0}",
    "contact_official_admin_email": "本站管理员邮箱：{0}",
    "contact_tech_info": "如果您对本站的技术实现感兴趣，可以关注以下链接：",
    "contact_tech_github": "站长GitHub主页：{0}",
    "contact_tech_github_project": "本项目GitHub Project主页：{0}",
    "contact_personal_info": "站长个人活跃平台：",
    "contact_personal_weibo": "新浪微博：{0}",
    "contact_donate_info": "欢迎各位对本项目提出您的意见与建议，您的反馈对本站未来的发展非常重要！如果您喜欢本项目，也可以通过{0}资助本站。再次感谢您对天钿Daily的支持！希望这个小项目能对您有所帮助~"
  },
  "en": {
    "contact_official_info": "Thanks for support TianDian Daily! TDD is currently developed, maintained, operated only by webmaster {0} himself. You can contact TDD via:",
    "contact_official_qq_group": "Official QQ group: {0} {1} {2}",
    "contact_official_webmaster_email": "Webmaster personal email: {0}",
    "contact_official_admin_email": "TDD admin email: {0}",
    "contact_tech_info": "If you are interested in the technology implement details, please visit:",
    "contact_tech_github": "Webmaster's GitHub: {0}",
    "contact_tech_github_project": "TDD GitHub Project: {0}",
    "contact_personal_info": "Webmaster personal social media:",
    "contact_personal_weibo": "Sina weibo: {0}",
    "contact_donate_info": "If you have any questions or suggestions, feel free to contact us! Your feedbacks are really important to us. If you like this project, you can donate TDD via {0}. Thanks to your support again! Hope this project can help you."
  }
}
</i18n>

<template>
  <div>
    <div v-wechat-title="$t('page_title.about_contactus')"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/about">{{ $t('page_name.about') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('page_name.about_contactus') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>{{ $t('page_name.about_contactus') }}</h1>
      <p>
        <i18n-t keypath="contact_official_info" tag="label">
          <a href="https://www.bunnyxt.com" target="_blank">bunnyxt</a>
        </i18n-t>
      <ul>
        <li>
          <i18n-t keypath="contact_official_qq_group" tag="label">
            <a target="_blank" href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a>
            <a-icon type="qrcode" style="margin-left: 8px; margin-right: 4px"/>
            <a target="_blank" :href="qqgroup_qrcode">{{ $t('qr_code') }}</a>
          </i18n-t>
        </li>
        <li>
          <i18n-t keypath="contact_official_webmaster_email" tag="label">
            <a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a>
          </i18n-t>
        </li>
        <li>
          <i18n-t keypath="contact_official_admin_email" tag="label">
            <a href="mailto:admin@bunnyxt.com">admin@bunnyxt.com</a>
          </i18n-t>
        </li>
      </ul>
      <p>{{ $t('contact_tech_info') }}</p>
      <ul>
        <li>
          <i18n-t keypath="contact_tech_github" tag="label">
            <a target="_blank" href="https://github.com/bunnyxt">https://github.com/bunnyxt</a>
          </i18n-t>
        </li>
        <li>
          <i18n-t keypath="contact_tech_github_project" tag="label">
            <a target="_blank" href="https://github.com/users/bunnyxt/projects/1">https://github.com/users/bunnyxt/projects/1</a>
          </i18n-t>
        </li>
      </ul>
      <p>{{ $t('contact_personal_info') }}</p>
      <ul>
        <li>
          <i18n-t keypath="contact_personal_weibo" tag="label">
            <a target="_blank" href="https://weibo.com/nny29">@牛奶源29</a>
          </i18n-t>
        </li>
        <li>
          BiliBili：<a target="_blank" href="https://space.bilibili.com/1635775">@牛奶源</a>
        </li>
        <li>
          Twitter：<a target="_blank" href="https://twitter.com/bunnyxt29">@bunnyxt29</a>
        </li>
      </ul>
      <p>
        <i18n-t keypath="contact_donate_info" tag="label">
          <a href="https://afdian.net/@bunnyxt" target="_blank">{{ $t('afdian') }}</a>
        </i18n-t>
      </p>
    </div>
  </div>
</template>

<script>
import qqgroup_qrcode from '../../../assets/img/qrcode_1580391374617.jpg'

export default {
  name: 'ContactUs',
  data: function () {
    return {
      qqgroup_qrcode: qqgroup_qrcode
    }
  }
}
</script>

<style scoped>

</style>
