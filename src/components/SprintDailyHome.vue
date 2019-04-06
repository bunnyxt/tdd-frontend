<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/sprint">传说助攻</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/sprint/daily">助攻日报</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>关于助攻日报</h1>
      <p>
        基于<a href="/sprint">传说助攻</a>的数据，以<strong>UTC+8 06:00至次日06:00</strong>为统计区间，每日刊发一期的助攻日报，记录当日各冲刺视频播放数及播放数变化情况。
      </p>
    </div>
    <div class="section-seperator"></div>
    <div class="section-block" :style="sectionBlockStyle">
      <h1>往期助攻日报</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "SprintDailyHome",
  data: function() {
    return {
      sectionBlockStyle: {
        background: "#fff",
        padding: "24px"
      },
    };
  },
}
</script>
