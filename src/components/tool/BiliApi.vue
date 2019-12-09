<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/tool">辅助工具</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>Bilibili API传送门</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>Bilibili API传送门</h1>
      <p>常用Bilibili API传送门</p>
      <p>强烈推荐安装Chrome插件<a href="https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh" target="_blank">JSON Viewer</a>以方便查看JSON格式的API。</p>
      <p>推荐使用Python包<a href="https://pypi.org/project/pybiliapi/" target="_blank">pybiliapi</a>实现本地调用API。</p>
      <ul>
        <li>
          <b>video view</b><br>
          <a href="http://api.bilibili.com/x/web-interface/view?aid=456930" target="_blank">http://api.bilibili.com/x/web-interface/view?aid=456930</a>
        </li>
        <li>
          <b>video stat</b><br>
          <a href="http://api.bilibili.com/x/web-interface/archive/stat?aid=456930" target="_blank">http://api.bilibili.com/x/web-interface/archive/stat?aid=456930</a>
        </li>
        <li>
          <b>video tags</b><br>
          <a href="http://api.bilibili.com/x/tag/archive/tags?aid=456930" target="_blank">http://api.bilibili.com/x/tag/archive/tags?aid=456930</a>
        </li>
        <li>
          <b>video pagelist</b><br>
          <a href="http://api.bilibili.com/x/player/pagelist?aid=456930" target="_blank">http://api.bilibili.com/x/player/pagelist?aid=456930</a>
        </li>
        <li>
          <b>get archive rank by partion</b><br>
          <a href="http://api.bilibili.com/archive_rank/getarchiverankbypartion?jsonp=jsonp&tid=30&pn=1&ps=50" target="_blank">http://api.bilibili.com/archive_rank/getarchiverankbypartion?jsonp=jsonp&tid=30&pn=1&ps=50</a>
        </li>
        <li>
          <b>member</b><br>
          <a href="http://api.bilibili.com/x/space/acc/info?mid=487708" target="_blank">http://api.bilibili.com/x/space/acc/info?mid=487708</a>
        </li>
        <li>
          <b>member relation</b><br>
          <a href="http://api.bilibili.com/x/relation/stat?vmid=487708" target="_blank">http://api.bilibili.com/x/relation/stat?vmid=487708</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "BiliApi",
  data: function() {
    return {

    }
  }
}
</script>

<style scoped>

</style>