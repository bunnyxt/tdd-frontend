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
        <a-radio-group v-model="method" buttonStyle="solid">
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
      queryResultObj: {status:"success",aid:456930,bvid:"BV19x411F7kL"},

      XOR_CODE: 23442827791579n,
      MASK_CODE: 2251799813685247n,
      MAX_AID: 1n << 51n,
      BASE: 58n,

      data: 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf',
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
    // ref: https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/bvid_desc.md#javascripttypescript
    av2bv(aid) {
      const bytes = ['B', 'V', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
      let bvIndex = bytes.length - 1;
      let tmp = (this.MAX_AID | BigInt(aid)) ^ this.XOR_CODE;
      while (tmp > 0) {
        bytes[bvIndex] = this.data[Number(tmp % BigInt(this.BASE))];
        tmp = tmp / this.BASE;
        bvIndex -= 1;
      }
      [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
      [bytes[4], bytes[7]] = [bytes[7], bytes[4]];
      return bytes.join('');
    },
    bv2av(bvid) {
      const bvidArr = Array.from(bvid);
      [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
      [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
      bvidArr.splice(0, 3);
      const tmp = bvidArr.reduce((pre, bvidChar) => pre * this.BASE + BigInt(this.data.indexOf(bvidChar)), 0n);
      return Number((tmp & this.MASK_CODE) ^ this.XOR_CODE);
    },
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
        if (this.queryKey === 'aid') {
          // enc
          let aid, bvid;
          try {
            aid = parseInt(this.queryValue)
          } catch (e) {
            this.$message.error('转换出错，aid必须为数字');
            return
          }
          try {
            bvid = this.av2bv(aid)
          } catch (e) {
            this.$message.error('转换出错');
            return
          }
          this.queryResultObj = {
            status: 'success',
            aid: this.queryValue,
            bvid: bvid
          };
          this.$message.success('转换成功')
        } else if (this.queryKey === 'bvid') {
          let aid;
          if (!this.queryValue.startsWith('BV')) {
            this.$message.error('转换出错，bv号必须以BV开头');
            return
          }
          try {
            aid = this.bv2av(this.queryValue)
          } catch (e) {
            this.$message.error('转换出错');
            return
          }
          this.queryResultObj = {
            status: 'success',
            aid: aid,
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
