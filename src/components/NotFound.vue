<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <div class="section-block" :style="sectionBlockStyle">
      <h1>404 NOT FOUND</h1>
      <a href="/">返回首页</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  data: function () {
    return {
      sectionBlockStyle : {
        background: '#fff', 
        padding: '24px',
        margin: '16px 0',
        textAlign: 'center'
      }
    }
  }
}
</script>
