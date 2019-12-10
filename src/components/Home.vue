<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>传送门</h1>
      <ul>
        <li>
          <router-link to="/video">所有视频</router-link>：本站收录的所有视频，包括B站UV分区下的所有视频和部分其他分区中的VC视频。
        </li>
        <li>
          <router-link to="/sprint">传说助攻</router-link>：VC传说冲刺曲目助攻计划，收录B站接近<a href="https://zh.moegirl.org/Vocaloid中文传说曲" target="_blank">中文VOCALOID传说曲</a>要求的曲目视频，记录播放、收藏等数据变化，提供传说助攻参考。
        </li>
        <li>
          <router-link to="/tool">辅助工具</router-link>：泛VC数据记录与分享相关所需要的辅助工具。
        </li>
        <li>开发中...</li>
      </ul>
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