<i18n src="@/i18n/common.json"></i18n>
<i18n src="@/i18n/tool.json"></i18n>

<template>
  <div>
    <div v-wechat-title="`${$t('tool_info.biliapi.name')} - ${$t('page_title._tdd')}`"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/tool">{{ $t('page_name.tool') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('tool_info.biliapi.name') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>{{ $t('tool_info.biliapi.name') }}</h1>
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
