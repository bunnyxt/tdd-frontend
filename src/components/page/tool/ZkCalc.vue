<i18n src="@/i18n/common.json"></i18n>
<i18n src="@/i18n/tool.json"></i18n>

<template>
  <div>
    <div v-wechat-title="`${$t('tool_info.zkcalc.name')} - ${$t('page_title._tdd')}`"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/tool">{{ $t('page_name.tool') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('tool_info.zkcalc.name') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>{{ $t('tool_info.zkcalc.name') }}</h1>
      <p><a href="https://zh.moegirl.org/周刊VOCALOID中文排行榜" target="_blank">周刊VOCALOID中文排行榜</a>计分规则计算器。</p>
      <a-alert type="info">
        <template #description>
          <span>
            别再手动输入数据算分惹！天钿Daily视频详情页添加「周刊算分」模块，只需选择周刊期数，指定时间范围，系统自动根据「本站观测到的数据」直接计算得分结果_8(:3 」∠ )_<br>
            视频详情页传送门：tdd.bunnyxt.com/video/av<a-input size="small" v-model="aidInputValue" style="width: 100px; margin-right: 8px" @change="aidInputChangeHandler" /><router-link :to="'/video/av'+aidInputValue">跳转</router-link>
          </span>
        </template>
      </a-alert>
      <div style="overflow: hidden; margin-top: 16px; margin-bottom: 16px">
        <table cellpadding="4" :style="tableStyle">
          <tr>
            <td>
              播放：
            </td>
            <td>
              <a-input placeholder="播放" v-model="view" ref="viewInput" style="width: 120px"></a-input>
            </td>
          </tr>
          <tr>
            <td>
              评论：
            </td>
            <td>
              <a-input placeholder="评论" v-model="reply" ref="replyInput" style="width: 120px"></a-input>
            </td>
          </tr>
          <tr>
            <td>
              弹幕：
            </td>
            <td>
              <a-input placeholder="弹幕" v-model="danmaku" ref="danmakuInput" style="width: 120px"></a-input>
            </td>
          </tr>
          <tr>
            <td>
              收藏：
            </td>
            <td>
              <a-input placeholder="收藏" v-model="favorite" ref="favoriteInput" style="width: 120px"></a-input>
            </td>
          </tr>
          <tr>
            <td>
              分P数：
            </td>
            <td>
              <a-input placeholder="分P数" v-model="page" ref="pageInput" style="width: 120px"></a-input>
            </td>
          </tr>
        </table>
        <div :style="dividerStyle"></div>
        <table cellpadding="4" :style="tableStyle">
          <tr>
            <td>
              得分：
            </td>
            <td>
              <a-input placeholder="得分" v-model="point" ref="pointInput" style="width: 120px"></a-input>
            </td>
          </tr>
          <tr>
            <td>
              修正A：
            </td>
            <td>
              <a-input placeholder="修正A" v-model="xiua" ref="xiuAInput" style="width: 120px"></a-input>
            </td>
          </tr>
          <tr>
            <td>
              修正B：
            </td>
            <td>
              <a-input placeholder="修正B" v-model="xiub" ref="xiuBInput" style="width: 120px"></a-input>
            </td>
          </tr>
        </table>
      </div>
      <p>
        注意：<br>
        1. 本计算器采用周刊第211期开始使用的新规则。<br>
        2. 周刊统计的播放数只计算站内播放，该数值可能会稍小于第三方观测到的播放数，因此使用第三方观测的数据计算得到的分数可能与周刊的分数存在出入。<br>
        3. 计算结果仅供参考，最终数据以周刊公布的数据为准。<br>
        4. 若发现本算分计算器出现计算错误或对本程序有疑问，请加QQ群：<a target="_blank" href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a> 联系。<br>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ZkCalc',
  data: function () {
    return {
      view: '405143',
      reply: '4388',
      danmaku: '6498',
      favorite: '38963',
      page: '1',
      aidInputValue: '78977256'
    }
  },
  computed: {
    zkCalcResult: function () {
      return this.$util.zkCalc(this.view, this.reply, this.danmaku, this.favorite, this.page);
    },
    point: {
      get: function () {
        return this.zkCalcResult.point;
      },
      set: () => {}
    },
    xiua: {
      get: function () {
        return this.zkCalcResult.xiua;
      },
      set: () => {}
    },
    xiub: {
      get: function () {
        return this.zkCalcResult.xiub;
      },
      set: () => {}
    },
    tableStyle: function () {
      let style = { float: 'left' };
      if (this.$store.getters.clientMode === 'MOBILE') {
        style.width = '100%';
      } else {
        style.width = '200px';
      }
      return style;
    },
    dividerStyle: function () {
      let style = {
        float: 'left',
        backgroundColor: '#e8e8e8'
      };
      if (this.$store.getters.clientMode === 'MOBILE') {
        style.width = '100%';
        style.height = '2px';
        style.margin = '12px 0';
      } else {
        style.padding = '100px 1px';
        style.margin = '0 20px 0 16px';
      }
      return style;
    }
  },
  methods: {
    aidInputChangeHandler: function () {
      if (this.aidInputValue && this.aidInputValue.toLowerCase().startsWith('av')) {
        this.aidInputValue = this.aidInputValue.slice(2);
      }
    }
  }
}
</script>

<style scoped>

</style>
