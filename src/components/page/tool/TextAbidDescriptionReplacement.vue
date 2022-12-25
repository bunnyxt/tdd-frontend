<i18n src="@/i18n/common.json"></i18n>
<i18n src="@/i18n/tool.json"></i18n>

<template>
  <div>
    <div v-wechat-title="`${$t('tool_info.text-abid-description-replacement.name')} - ${$t('page_title._tdd')}`"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/tool">{{ $t('page_name.tool') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('tool_info.text-abid-description-replacement.name') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>{{ $t('tool_info.text-abid-description-replacement.name') }}</h1>
      <p>将文本中的av号或bv号替换为对应视频的描述信息（标题、UP主、播放数等等），支持自定义格式与微调。</p>
      <h3>步骤1：粘贴文本</h3>
      <a-textarea
        v-model:value="inputText"
        placeholder="在此输入需要替换的文本"
        :auto-size="{ minRows: 3, maxRows: 10 }"
        style="margin-bottom: 16px"
      />
      <h3>步骤2：自定义描述信息格式</h3>
      <a-textarea
        v-model:value="templateText"
        placeholder="在此输入自定义描述信息格式"
        :auto-size="{ minRows: 3, maxRows: 10 }"
        style="margin-bottom: 8px"
      />
      <div style="margin-bottom: 12px">
        点击添加：
        <a-button
          v-for="template of templateList.slice(0, templateExpanded ? templateList.length : 4)"
          :key="template.template"
          @click="() => templateText += template.template"
          size="small"
          style="margin-right: 4px; margin-bottom: 4px"
        >{{ template.name }}</a-button>
        <a-button
          type="primary"
          size="small"
          @click="() => templateExpanded = !templateExpanded"
        >
          <left-outlined v-if="templateExpanded" />
          <right-outlined v-else />
        </a-button>
      </div>
      <h3>步骤3：点击<a-button size="small" @click="replace" style="margin-left: 4px">替换</a-button></h3>
      <a-spin :spinning="isReplacing">
        <a-textarea
          v-model:value="outputText"
          placeholder="替换过后的文本会出现在这里"
          :auto-size="{ minRows: 3, maxRows: 10 }"
          style="margin-bottom: 16px"
        />
      </a-spin>
    </div>
  </div>
</template>

<script>
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import axios from 'axios'
axios.defaults.withCredentials = false;

export default {
  name: 'TextAbidDescriptionReplacement',
  components: {
    LeftOutlined,
    RightOutlined,
  },
  data: function () {
    return {
      inputText: 'av3905462是继BV1zs411S7sz之后的第二首达成神话（一千万播放量）的VC曲目。',
      templateText: '「::title::」（av::aid::，UP主：::up_name::）',
      outputText: '',
      isReplacing: false,
      templateList: [{
        template: '::aid::',
        path: 'aid',
        name: 'av号',
      }, {
        template: '::bvid::',
        path: 'bvid',
        name: 'bv号',
      }, {
        template: '::title::',
        path: 'title',
        name: '标题',
      }, {
        template: '::up_name::',
        path: 'owner.name',
        name: 'UP主昵称',
      }, {
        template: '::p::',
        path: 'videos',
        name: '分P数',
      }, {
        template: '::tid::',
        path: 'tid',
        name: '分区编号',
      }, {
        template: '::tname::',
        path: 'tname',
        name: '分区名称',
      }, {
        template: '::copyright::',
        path: 'copyright',
        name: '版权代码',
      }, {
        template: '::pic::',
        path: 'pic',
        name: '视频封面',
      }, {
        template: '::pubdate::',
        path: 'pubdate',
        name: '投稿时间（时间戳）',
      }, {
        template: '::pubdate_str::',
        path: 'pubdate',
        name: '投稿时间（字符串）',
        callback: x => this.$util.tsToDateString(x),
      }, {
        template: '::desc::',
        path: 'desc',
        name: '视频简介',
      }, {
        template: '::state::',
        path: 'state',
        name: '视频状态码',
      }, {
        template: '::duration::',
        path: 'duration',
        name: '视频时长（秒）',
      }, {
        template: '::up_mid::',
        path: 'owner.mid',
        name: 'UP主mid',
      }, {
        template: '::up_face::',
        path: 'owner.face',
        name: 'UP主头像',
      }, {
        template: '::stat_view::',
        path: 'stat.view',
        name: '播放数',
      }, {
        template: '::stat_danmaku::',
        path: 'stat.danmaku',
        name: '弹幕数',
      }, {
        template: '::stat_reply::',
        path: 'stat.reply',
        name: '评论数',
      }, {
        template: '::stat_favorite::',
        path: 'stat.favorite',
        name: '收藏数',
      }, {
        template: '::stat_coin::',
        path: 'stat.coin',
        name: '硬币数',
      }, {
        template: '::stat_share::',
        path: 'stat.share',
        name: '分享数',
      }, {
        template: '::stat_like::',
        path: 'stat.like',
        name: '点赞数',
      }, {
        template: '::now_ts::',
        path: '',
        name: '当前时间（时间戳）',
        callback: () => Math.floor((new Date()).valueOf() / 1000),
      }, {
        template: '::now_ts_str::',
        path: '',
        name: '当前时间（字符串）',
        callback: () => this.$util.tsToDateString(Math.floor((new Date()).valueOf() / 1000)),
      }],
      templateExpanded: false,
    };
  },
  methods: {
    replace: function () {
      this.isReplacing = true;
      
      const reg = new RegExp('(?:[Aa][Vv][0-9]+)|(?:[Bb][Vv][fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{10})', 'g');
      const idList = Array.from(this.inputText.matchAll(reg), x => ({ id: x[0], obj: null }));
      const otherList = this.inputText.split(reg);

      const idAxiosList = [];
      for (let i = 0; i < idList.length; i++) {
        const idType = idList[i].id.substr(0, 2).toLowerCase() === 'av' ? 'aid' : 'bvid';
        const idValue = idList[i].id.substr(2);
        idAxiosList.push(axios.get(
          'https://json2jsonp.com/?url=' +
          encodeURIComponent(`http://api.bilibili.com/x/web-interface/view?${idType}=${idValue}`) +
          '&callback=cbfunc'
        ));
      }
      
      Promise.allSettled(idAxiosList)
        .then(responseList => {
          for (let i = 0; i < idList.length; i++) {
            const response = responseList[i];
            if (response.status === 'fulfilled') {
              const obj = JSON.parse(response.value.data.slice(7, -1));
              if (obj.code === 0) {
                idList[i].obj = obj;
              }
            } else {
              console.log(response);
            }
          }
          this.outputText = '';
          for (let i = 0; i < idList.length; i++) {
            this.outputText += otherList[i];
            this.outputText += idList[i].obj !== null ? this.formatObj(idList[i].obj) : idList[i].id;
          }
          this.outputText += otherList[otherList.length - 1];
          this.isReplacing = false;
        });
    },
    getTemplatePath: function (template) {
      const templateObj = this.templateList.find(x => x.template === template);
      return templateObj ? templateObj.path : null;
    },
    getTemplateCallback: function (template) {
      const templateObj = this.templateList.find(x => x.template === template);
      return templateObj ? templateObj.callback : null;
    },
    getObjValueByPath: function (obj, path) {
      const pathList = path.split('.');
      for (const prop of pathList) {
        obj = obj[prop];
      }
      return obj;
    },
    formatObj: function (obj) {
      const reg = new RegExp('::[a-z_]+::', 'g');
      const templateList = Array.from(
        this.templateText.matchAll(reg), x => ({ template: x[0], path: this.getTemplatePath(x[0])})
      );
      const otherList = this.templateText.split(reg);
      
      let formatStr = '';
      for (let i = 0; i < templateList.length; i++) {
        formatStr += otherList[i];
        const objValue = this.getObjValueByPath(obj.data, templateList[i].path);
        const callback = this.getTemplateCallback(templateList[i].template);
        formatStr += templateList[i].path !== null
          ? callback
            ? callback(objValue)
            : objValue
          : templateList[i].template;
      }
      formatStr += otherList[otherList.length - 1];
      
      return formatStr;
    },
  },
}
</script>

<style scoped>

</style>
