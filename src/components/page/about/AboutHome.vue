<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>关于</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>关于天钿Daily</h1>
      <div style="float: right; margin-left: 8px; margin-bottom: 8px">
        <img :src="logo_max" alt="logo" width="64px" /><br>
        <span style="font-size: 10px">logo by <br>SweetFairyTale</span>
      </div>
      <p>天钿Daily（TianDian Daily）是一个VC相关数据交流与分享的网站。本站致力于VC相关数据交流，基于B站API以及简单的网络爬虫，定期抓取VC相关数据，选取有意义的纬度展示。</p>
      <p>
        QQ群：<a target="_blank" href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a><a-icon type="qrcode" style="margin-left: 8px; margin-right: 4px"/><a target="_blank" :href="qqgroup_qrcode">二维码</a><br/>
        个人邮箱：<a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a>
      </p>
      <p>
        <a href="https://afdian.net/@bunnyxt" target="_blank">资助本站</a> or <router-link to="/about/contactus">联系我们</router-link>
      </p>
    </div>
<!--    <div class="section-separator"></div>-->
<!--    <div class="section-block">-->
<!--      <h1>常见问题</h1>-->
<!--      // TODO-->
<!--    </div>-->
    <div class="section-separator"></div>
    <div class="section-block">
      <h1>技术相关</h1>
      <p>小霸王服务器目前由阿里云与腾讯云提供，<strong>谢绝爆破</strong>。</p>
      <p>前端使用Vue全家桶构建，包括vue-router前端路由以及vuex状态管理。界面使用<a href="https://ant.design" target="_blank">Ant Design</a> UI设计语言，并根据项目需要，针对移动端访问进行了一系列优化。图表采用Ant Vision <a href="https://g2.antv.vision/" target="_blank">G2</a>可视化引擎。</p>
      <p>后端使用Spring Boot构建RESTful API，另外还有部分使用PHP实现的旧版接口。本站所有数据可以通过调用API获取。<strong>资源有限，请勿滥用。</strong>数据库依旧使用MySQL（因为不会用NoSQL）。</p>
      <p>爬虫脚本基于Python。很丢人，目前还没使用多线程爬虫，不知道怎么避免触发412。</p>
      <p>绝大部分源码可以在<a href="https://github.com/users/bunnyxt/projects/1" target="_blank">GitHub TianDian Daily Project</a>看到。点开右侧Menu，进入Linked repositories查看不同模块的项目。<strong>欢迎Star，欢迎Issue！</strong></p>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <h1>免责声明</h1>
      <p>本站数据收集自BiliBili。</p>
      <p>本站收集的所有数据均从公开渠道获取，不会收集任何敏感信息。</p>
      <p>由于存在不可避免的网络问题或程序问题，本站无法保证所有数据的绝对可靠。若您因为本站的信息直接或间接蒙受任何损失，本站将不负任何责任。</p>
      <p>本站对所有数据持中立态度，不发表也<strong>不鼓励</strong>基于数据的，对任何实体，包括作品、P主、社团、歌姬等的任何<strong>片面评价</strong>。数据受到多方面因素的影响，实体的评价也应该综合全面。</p>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <h1>关于bunnyxt</h1>
      <p>12年入坑的VC厨。洛厨，南北党。"<a href="https://www.bilibili.com/video/av456930/" target="_blank">默默守望，希望天依越来越好~</a>"</p>
      <p>日常活跃于新浪微博 <a href="https://www.weibo.com/nny29" target="_blank">@牛奶源29</a></p>
      <p>INTJ, naive coder from NJAU. 业余全栈工程师，GitHub <a href="https://github.com/bunnyxt" target="_blank">@bunnyxt</a></p>
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
