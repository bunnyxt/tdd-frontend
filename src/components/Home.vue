<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>天钿Daily - VC数据交流与分享</h1>
      <div style="float: right; margin-left: 8px; margin-bottom: 8px">
        <img src="img/logo_64S.png" alt="logo" /><br>
        <span style="font-size: 10px">logo by <br>SweetFairyTale</span>
      </div>
      <p>天钿Daily（TianDian Daily）是一个VC相关数据交流与分享的网站。本站以推动VC相关数据交流为宗旨，基于B站API以及简单的网络爬虫，定期抓取并存储VC相关数据，选取感兴趣的纬度公开展示。</p>
      <p>
        QQ群：<a target="_blank" href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a><br/>
        个人邮箱：<a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a>
      </p>
      <p><router-link to="/about">了解更多</router-link></p>
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <h1>传送门</h1>
      <h3><router-link to="/video">所有视频</router-link></h3>
      <p>本站收录的所有视频，包括B站UV分区下的所有视频和部分其他分区中的VC视频。</p>
      <h3><router-link to="/sprint">传说助攻</router-link></h3>
      <p>VC传说冲刺曲目助攻计划，收录B站接近<a href="https://zh.moegirl.org/Vocaloid中文传说曲" target="_blank">中文VOCALOID传说曲</a>要求的曲目视频，记录播放、收藏等数据变化，提供传说助攻参考。</p>
      <h3><router-link to="/tool">辅助工具</router-link></h3>
      <p>泛VC数据记录与分享相关所需要的辅助工具。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data: function () {
    return {

    }
  }
};
</script>