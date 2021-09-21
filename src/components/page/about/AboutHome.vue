<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "about_tdd": "关于天钿Daily",
    "tdd_intro": "天钿Daily（TianDian Daily）是一个VC相关数据交流与分享的网站。本站致力于VC相关数据交流，基于B站API以及简单的网络爬虫，定期抓取VC相关数据，选取有意义的纬度展示。",
    "qq_group_info": "QQ群：{0} {1} {2}",
    "personal_email_info": "个人邮箱：{0}",
    "donate_tdd": "资助本站",
    "tech_related": "技术相关",
    "tech_server": "小霸王服务器目前由阿里云与腾讯云提供，{0}。",
    "tech_server_no_hack": "谢绝爆破",
    "tech_frontend": "前端使用Vue全家桶构建，包括vue-router前端路由以及vuex状态管理。界面使用{0} UI设计语言，并根据项目需要，针对移动端访问进行了一系列优化。图表采用Ant Vision {1}可视化引擎。",
    "tech_backend": "后端使用Spring Boot构建RESTful API，另外还有部分使用PHP实现的旧版接口。本站所有数据可以通过调用API获取。{0}数据库依旧使用MySQL。",
    "tech_backend_api_limit": "资源有限，请勿滥用。",
    "tech_crawler": "爬虫脚本基于Python。很丢人，目前还没使用多线程爬虫，不知道怎么避免触发412。",
    "tech_code": "绝大部分源码可以在{0}看到。点开右侧Menu，进入Linked repositories查看不同模块的项目。{1}",
    "tech_code_welcome": "欢迎Star，欢迎Issue！",
    "disclaimer": "免责声明",
    "disclaimer_source": "本站数据收集自BiliBili。",
    "disclaimer_privacy": "本站收集的所有数据均从公开渠道获取，不会收集任何敏感信息。",
    "disclaimer_reliability": "由于存在不可避免的网络问题或程序问题，本站无法保证所有数据的绝对可靠。若您因为本站的信息直接或间接蒙受任何损失，本站将不负任何责任。",
    "disclaimer_comment": "本站对所有数据持中立态度，不发表也不鼓励基于数据的，对任何实体，包括作品、P主、社团、歌姬等的任何片面评价。数据受到多方面因素的影响，实体的评价也应该综合全面。",
    "about_bunnyxt": "关于bunnyxt",
    "bunnyxt_intro": "12年入坑的VC厨。洛厨，南北党。",
    "bunnyxt_social_media": "日常活跃于新浪微博",
    "bunnyxt_github": "INTJ, Github "
  },
  "en": {
    "about_tdd": "About TianDian Daily",
    "tdd_intro": "TianDian Daily is a VC-related data exchange and sharing website. Committed to enhance VOCALOID CHINA related data exchange, fetching VC related data regularly and show meaningful parts to everyone.",
    "qq_group_info": "QQ group: {0} {1} {2}",
    "personal_email_info": "Personal email: {0}",
    "donate_tdd": "Donate TDD",
    "tech_related": "Tech Related",
    "tech_server": "Server currently provided by Aliyun and Tencent Cloud. {0}.",
    "tech_server_no_hack": "PLZ DO NO HACKING",
    "tech_frontend": "The frontend part is built with Vue family, including vue-router and vuex. UI is based on {0}, and optimized for mobile version. Chart is powered by Ant Vision {1}.",
    "tech_backend": "The backend part is built with Spring Boot, which generates mostly RESTful APIs. Also some old version APIs by PHP are still available. All data collected can be fetched using provided APIs. {0} TDD uses MySQL for data storage.",
    "tech_backend_api_limit": "RESOURCES LIMITED, DO NOT ABUSE.",
    "tech_crawler": "The crawlers are developed using Python. Due to Bilibili API anti-abusing strategies, no multi-threading spiders are used.",
    "tech_code": "Most source code can be found at {0}. Click Menu at right side, enter Linked repositories to view repos of different parts of TDD. {1}",
    "tech_code_welcome": "Stars and Issues are welcome!",
    "disclaimer": "Disclaimer",
    "disclaimer_source": "TDD data are collected from BiliBili.",
    "disclaimer_privacy": "TDD only collect data from open sources. No privacy data will be collected.",
    "disclaimer_reliability": "Due to inevitable network problems or program bugs, TDD cannot ensure the reliability of data. If you suffer any loss directly or indirectly because of the information on TDD, TDD will not responsible for that.",
    "disclaimer_comment": "TDD keeps neutral to all the data. TDD does not and also not support any one-sided comments to anything (e.g. works, staffs, leagues, singers, etc.) only based on data. Data could be affected by lots of factors. Comments on anything should be considered comprehensively.",
    "about_bunnyxt": "About bunnyxt",
    "bunnyxt_intro": "VC fan since 2012. Fan of Tianyi Luo and Luo & Yuezheng CP. ",
    "bunnyxt_social_media": "Follow me at sina weibo",
    "bunnyxt_github": "INTJ, Github "
  }
}
</i18n>

<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('page_name.about') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>{{ $t('about_tdd') }}</h1>
      <div style="float: right; margin-left: 8px; margin-bottom: 8px">
        <img :src="logo_max" alt="logo" width="64px" /><br>
        <span style="font-size: 10px">logo by <br>SweetFairyTale</span>
      </div>
      <p>{{ $t('tdd_intro') }}</p>
      <p>
        <i18n path="qq_group_info" tag="label">
          <a target="_blank" href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a>
          <a-icon type="qrcode" style="margin-left: 8px; margin-right: 4px"/>
          <a target="_blank" :href="qqgroup_qrcode">{{ $t('qr_code') }}</a>
        </i18n>
        <br/>
        <i18n path="personal_email_info" tag="label">
          <a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a>
        </i18n>
      </p>
      <p>
        <a href="https://afdian.net/@bunnyxt" target="_blank">{{ $t('donate_tdd') }}</a> or <router-link to="/about/contactus">{{ $t('page_name.about_contactus') }}</router-link>
      </p>
    </div>
<!--    <div class="section-separator"></div>-->
<!--    <div class="section-block">-->
<!--      <h1>常见问题</h1>-->
<!--      // TODO-->
<!--    </div>-->
    <div class="section-separator"></div>
    <div class="section-block">
      <h1>{{ $t('tech_related') }}</h1>
      <p>
        <i18n path="tech_server" tag="label">
          <strong>{{ $t('tech_server_no_hack') }}</strong>
        </i18n>
      </p>
      <p>
        <i18n path="tech_frontend" tag="label">
          <a href="https://ant.design" target="_blank">Ant Design</a>
          <a href="https://g2.antv.vision/" target="_blank">G2</a>
        </i18n>
      </p>
      <p>
        <i18n path="tech_backend" tag="label">
          <strong>{{ $t('tech_backend_api_limit') }}</strong>
        </i18n>
      </p>
      <p>{{ $t('tech_crawler') }}</p>
      <p>
        <i18n path="tech_code" tag="label">
          <a href="https://github.com/users/bunnyxt/projects/1" target="_blank">GitHub TianDian Daily Project</a>
          <strong>{{ $t('tech_code_welcome') }}</strong>
        </i18n>
      </p>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <h1>{{ $t('disclaimer') }}</h1>
      <p>{{ $t('disclaimer_source') }}</p>
      <p>{{ $t('disclaimer_privacy') }}</p>
      <p>{{ $t('disclaimer_reliability') }}</p>
      <p>{{ $t('disclaimer_comment') }}</p>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <h1>{{ $t('about_bunnyxt') }}</h1>
      <p>{{ $t('bunnyxt_intro') }}"<a href="https://www.bilibili.com/video/av456930/" target="_blank">默默守望，希望天依越来越好~</a>"</p>
      <p>{{ $t('bunnyxt_social_media') }} <a href="https://www.weibo.com/nny29" target="_blank">@牛奶源29</a></p>
      <p>{{ $t('bunnyxt_github') }} <a href="https://github.com/bunnyxt" target="_blank">@bunnyxt</a></p>
    </div>
  </div>
</template>

<script>
import logo_max from '../../../assets/img/logo_max.png'
  import qqgroup_qrcode from '../../../assets/img/qrcode_1580391374617.jpg'

export default {
  name: 'AboutHome',
  data: function() {
    return {
      logo_max: logo_max,
      qqgroup_qrcode: qqgroup_qrcode
    }
  }
}
</script>

<style>

</style>
