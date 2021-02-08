<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/tool">辅助工具</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>文本av号/bv号与视频描述替换</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-alert banner message="WORK IN PROGRESS" style="margin-bottom: 16px" />
    <div class="section-block">
      <h1>文本av号/bv号与视频描述替换</h1>
      <p>将文本中的av号或bv号替换为对应视频的描述信息（标题、UP主、播放数等等），支持自定义格式与微调。</p>
      <h3>步骤1：粘贴文本</h3>
      <a-textarea
        v-model="inputText"
        placeholder="在此输入需要替换的文本"
        :auto-size="{ minRows: 3, maxRows: 10 }"
        style="margin-bottom: 16px"
      />
      <h3>步骤2：设置描述信息格式</h3>
      <p>TODO</p>
      <h3>步骤3：点击<a-button size="small" @click="replace">替换</a-button></h3>
      <a-spin :spinning="isReplacing">
        <a-textarea
          v-model="outputText"
          placeholder="替换过后的文本会出现在这里"
          :auto-size="{ minRows: 3, maxRows: 10 }"
          style="margin-bottom: 16px"
        />
      </a-spin>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = false;

export default {
  name: 'TextAbidDescriptionReplacement',
  data: function () {
    return {
      inputText: 'av3905462是继BV1zs411S7sz之后的第二首达成神话（一千万播放量）的VC曲目。',
      outputText: '',
      isReplacing: false,
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
    formatObj: function (obj) {
      // TODO
      return obj.data.title;
    },
  },
}
</script>

<style scoped>

</style>
