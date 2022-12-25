<i18n src="@/i18n/common.json"></i18n>
<i18n src="@/i18n/tool.json"></i18n>

<template>
  <div>
    <div v-wechat-title="`${$t('tool_info.abid.name')} - ${$t('page_title._tdd')}`"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/tool">{{ $t('page_name.tool') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('tool_info.abid.name') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>{{ $t('tool_info.abid.name') }}</h1>
      <div style="overflow: hidden; margin-bottom: 12px">
        <a-radio-group v-model:value="method" buttonStyle="solid">
          <a-radio-button value="api">API转换</a-radio-button>
          <a-radio-button value="alg">算法转换</a-radio-button>
        </a-radio-group>
      </div>
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
        注意：<br>
        API转换调用B站API进行转换，仅适用于小规模普通查询，大规模查询请直接调用Bilibili API
        <a :href="'https://api.bilibili.com/x/web-interface/view?'+queryKey+'='+queryValue" target="_blank">
          {{ 'https://api.bilibili.com/x/web-interface/view?'+queryKey+'='+queryValue }}
        </a><br>
        算法转换采用知乎用户<a href="https://www.zhihu.com/people/-._.-" target="_blank">mcfx</a>在<a href="https://www.zhihu.com/question/381784377/answer/1099438784" target="_blank">这篇回答</a>中给出的算法进行转换
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AidBvidConvert',
  data: function () {
    return {
      method: 'api',
      queryKey: 'aid',
      queryValue: '456930',
      queryResultObj: {status:"success",aid:456930,bvid:"BV19x411F7kL"}
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
      if (this.method === 'api') {
        // must use fetch, not axios, due to axios withCredentials setting
        fetch('https://api.bunnyxt.com/tdd/bapi_aid_bvid.php?'+this.queryKey+'='+this.queryValue)
          .then(response => response.json())
          .then((json) => {
            this.queryResultObj = json;
            if (json.status === 'success') {
              this.$message.success('转换成功');
            } else {
              this.$message.error('转换出错');
            }
          })
          .catch(() => this.$message.error('请求出错'))
      } else if (this.method === 'alg') {
        // ref: https://www.zhihu.com/question/381784377
        let table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
        let tr = {};
        for (let i = 0; i < 58; i++) {
          tr[table[i]] = i;
        }
        let s = [11, 10, 3, 8, 4, 6];
        let xor = 177451812;
        let add = 8728348608;

        if (this.queryKey === 'aid') {
          // enc
          let x;
          try {
            x = parseInt(this.queryValue)
          } catch (e) {
            this.$message.error('转换出错，aid必须为数字');
            return
          }
          x = (x ^ xor) + add;
          let r = ['B', 'V', '1', ' ', ' ', '4', ' ', '1', ' ', '7', ' ', ' '];
          for (let i = 0; i < 6; i++) {
            r[s[i]] = table.charAt(Math.floor(x / Math.pow(58, i)) % 58);
          }
          let rs = '';
          for (let i = 0; i < r.length; i++) {
            rs += r[i];
          }
          this.queryResultObj = {
            status: 'success',
            aid: this.queryValue,
            bvid: rs
          };
          this.$message.success('转换成功')
        } else if (this.queryKey === 'bvid') {
          // dec
          let r = 0;
          let x = [];
          for (let i = 0; i < this.queryValue.length; i++) {
            x.push(this.queryValue.charAt(i));
          }
          if (x.length !== 12) {
            this.$message.error('转换出错，bvid位数不合法');
            return
          }
          if (!(x[0] === 'B' && x[1] === 'V')) {
            this.$message.error('转换出错，bvid必须以BV开头');
            return
          }
          if (!(x[2] === '1' && x[5] === '4' && x[7] === '1' && x[9] === '7')) {
            this.$message.error('转换出错，目前只支持BV1??4?1?7??格式的bvid');
            return
          }
          for (let i = 2; i < 12; i++) {
            if (table.indexOf(x[i]) === -1) {
              this.$message.error('转换出错，bvid包含不支持的字符');
              return
            }
          }
          for (let i = 0; i < 6; i++) {
            r += tr[x[s[i]]] * Math.pow(58, i);
          }
          this.queryResultObj = {
            status: 'success',
            aid: String((r - add) ^ xor),
            bvid: this.queryValue
          };
          this.$message.success('转换成功')
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
