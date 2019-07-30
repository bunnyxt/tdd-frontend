<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item><a href="/">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="/tool">辅助工具</a></a-breadcrumb-item>
    </a-breadcrumb>
    <div class="section-block">
      <h1>辅助工具</h1>
      <p>泛VC数据记录与分享相关所需要的辅助工具。</p>
      <ul>
        <li>
            <a href="/tool/datecalc">耗时计算</a>：输入起止时间，计算所消耗的时间长度，可用于计算曲目传说/殿堂耗时。
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
