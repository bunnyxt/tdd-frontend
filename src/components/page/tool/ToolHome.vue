<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>辅助工具</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>辅助工具</h1>
      <p>泛VC数据记录与分享相关所需要的辅助工具。</p>
      <ul>
        <li>
          <router-link to="/tool/datecalc">耗时计算</router-link>：输入起止时间，计算所消耗的时间长度，可用于计算曲目传说/殿堂耗时。
        </li>
        <li>
          <router-link to="/tool/biliapi">Bilibili API传送门</router-link>：常用Bilibili API传送门。
        </li>
        <li>
          <router-link to="/tool/zkcalc">周刊算分</router-link>：周刊VOCALOID中文排行榜计分规则计算器。
        </li>
        <li>
          <router-link to="/tool/abid">av号/bv号转换</router-link>：Bilibili av号/bv号转换工具。
        </li>
        <li>
          <router-link to="/tool/ts">时间戳转换</router-link>：时间戳与时间字符串转换工具。
        </li>
        <li>
          <router-link to="/tool/compare">视频对比</router-link>：视频数据对比。
        </li>
        <li>
          <router-link to="/tool/text-abid-description-replacement">文本av号/bv号与视频描述替换</router-link>：将文本中的av号或bv号替换为对应视频的描述信息（标题、UP主、播放数等等），支持自定义格式与微调。
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToolHome",
  data: function() {
    return {

    }
  }
}
</script>
