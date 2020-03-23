<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/tool">辅助工具</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>Bilibili av号/bv号转换工具</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>Bilibili av号/bv号转换工具</h1>
      <div style="overflow: hidden; margin-bottom: 12px">
        <a-select
            defaultValue="aid"
            v-model="queryKey"
            @change="queryKeyChangeHandler"
            style="float: left; width: 80px"
        >
          <a-select-option value="aid">av号</a-select-option>
          <a-select-option value="bvid">bv号</a-select-option>
        </a-select>
        <a-input style="float: left; width: 140px; margin-left: 12px" v-model="queryValue" />
        <a-button
            type="primary"
            @click="queryClickHandler"
            style="float: left; margin-left: 12px"
        >转换</a-button>
      </div>
      <div style="overflow: hidden; margin-bottom: 12px">
        <a-input style="float: left; width: 80px" :value="queryKeyOpposite" disabled />
        <a-input style="float: left; width: 140px; margin-left: 12px" :value="resultValue" />
      </div>
      <div>
        注意：本在线工具仅适用于小规模普通查询，大规模查询请直接调用Bilibili API
        <a :href="'https://api.bilibili.com/x/web-interface/view?'+queryKey+'='+queryValue" target="_blank">
          {{ 'https://api.bilibili.com/x/web-interface/view?'+queryKey+'='+queryValue }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AidBvidConvert',
    data: function () {
      return {
        queryKey: 'aid',
        queryValue: '456930',
        queryResultObj: {status:"success",aid:456930,bvid:"BV19x411F7kL"},
      }
    },
    computed: {
      queryKeyOpposite: function () {
        if (this.queryKey === 'aid') {
          return 'bv号';
        } else if (this.queryKey === 'bvid') {
          return 'av号';
        } else {
          return '';
        }
      },
      resultValue: function () {
        if (this.queryKey === 'aid') {
          return this.queryResultObj.bvid;
        } else if (this.queryKey === 'bvid') {
          return this.queryResultObj.aid;
        } else {
          return '';
        }
      }
    },
    methods: {
      queryKeyChangeHandler() {
        if (this.queryKey === 'aid') {
          this.queryValue = this.queryResultObj.aid;
        } else if (this.queryKey === 'bvid') {
          this.queryValue = this.queryResultObj.bvid;
        }
      },
      queryClickHandler() {
        this.$axios.get('https://api.bunnyxt.com/tdd/bapi_aid_bvid.php?'+this.queryKey+'='+this.queryValue)
          .then((response) => {
            this.queryResultObj = response.data;
            if (response.data.status === 'success') {
              this.$message.success('转换成功');
            } else {
              this.$message.error('转换出错');
            }
          })
          .catch(() => this.$message.error('请求出错'))
      }
    }
  }
</script>

<style scoped>
</style>