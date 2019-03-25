<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item>传说助攻</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $route.params.aid }}</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="section-block" :style="sectionBlockStyle">
      {{ $route.params.aid }}
    </div>
    <div class="section-seperator"></div>
  </div>
</template>

<script>
export default {
    name: "SprintVideoDetail", 
    data: function() {
        return {

        }
    }
}
</script>