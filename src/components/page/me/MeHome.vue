<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>个人中心</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      个人中心
    </div>
    <div class="section-separator"></div>
  </div>
</template>

<script>
  export default {
    name: 'MeHome',
    data: function () {
      return {

      }
    }
  }
</script>