<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <div class="section-block" :style="sectionBlockStyle">
      <h1>404 NOT FOUND</h1>
      <a-icon type="home" style="margin-right: 8px"/>
      <router-link to="/">返回首页</router-link>
      <a-icon type="rollback" style="margin-left: 24px; margin-right: 8px"/>
      <a @click="$router.go(-1)">返回上一页</a>
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
