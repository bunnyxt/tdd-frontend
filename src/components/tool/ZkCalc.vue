<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/tool">辅助工具</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>周刊算分</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>周刊算分</h1>
      <p><a href="https://zh.moegirl.org/周刊VOCALOID中文排行榜" target="_blank">周刊VOCALOID中文排行榜</a>计分规则计算器。</p>
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
        3. 计算结果仅供参考，最终解释权归周刊组所有。<br>
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
        page: '1'
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
    }
  }
</script>

<style scoped>

</style>