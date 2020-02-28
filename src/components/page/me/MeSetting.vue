<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/me">个人中心</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>设置</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      设置
    </div>
    <div class="section-separator"></div>
  </div>
</template>

<script>
  export default {
    name: 'MeSetting',
    data: function () {
      return {

      }
    }
  }
</script>