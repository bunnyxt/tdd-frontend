<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>传送门</h1>
      <ul>
        <li>
          <router-link to="/sprint">传说助攻</router-link>：VC传说冲刺曲目助攻计划，收录B站接近<a href="https://zh.moegirl.org/Vocaloid中文传说曲" target="_blank">中文VOCALOID传说曲</a>要求的曲目视频，记录播放、收藏等数据变化，提供传说助攻参考。
        </li>
        <li>开发中...</li>
      </ul>
    </div>
    <div class="section-seperator"></div>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>关于天钿Daily</h1>
      <img src="logo_64S.png"/>
      <p><small>logo by SweetFairyTale</small></p>
      <p>天钿Daily（TianDian Daily）是一个VC相关数据交流与分享的网站。本站以推动VC相关数据交流为宗旨，基于B站API以及简单的网络爬虫，定期抓取并存储VC相关数据，选取感兴趣的纬度公开展示。</p>
      <p>本站<strong>不鼓励</strong>基于数据的，对任何实体，包括作品、P主、社团、歌姬等的任何<strong>片面评价</strong>。数据受到多方面因素的影响，实体的评价也应该综合全面。</p>
      <p>本站收集的所有数据均通过公开的正当的方式获取，并承诺不会收集任何敏感信息。由于存在不可避免的网络问题或程序问题，本站无法保证所有数据的绝对可靠。若您因为本站的信息直接或间接蒙受任何损失，本站将不负任何责任。</p>
      <p>使用过程中如遇到的任何问题，欢迎通过邮件与我取得联系。<a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a></p>
    </div>
    <div class="section-seperator"></div>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>技术相关</h1>
      <p>小霸王服务器由阿里云提供，<strong>谢绝爆破</strong>。</p>
      <p>网站前端采用Vue.js+<a href="https://ant.design" target="_blank">Ant Design</a>实现，后端使用PHP实现，数据库使用MySQL，爬虫脚本基于Python。</p>
      <p>部分源码可以在<a href="https://github.com/bunnyxt" target="_blank">这里</a>看到。</p>
    </div>
    <div class="section-seperator"></div>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>关于bunnyxt</h1>
      <p>12年入坑VC厨。洛厨，南北党。<strong>不撕逼</strong>，<strong>不撕逼</strong>，<strong>不撕逼</strong>。</p>
      <p>日常活跃于新浪微博<a href="https://www.weibo.com/nny29/" target="_blank">@牛奶源29</a></p>
      <p>naïve coder，是鶸。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data: function () {
    return {
      sectionBlockStyle : {
        background: '#fff', 
        padding: '24px'
      }
    }
  }
};
</script>