<i18n>
{
  "zh": {
    "video_aid_or_bvid": "视频AV号或BV号"
  },
  "en": {
    "video_aid_or_bvid": "video aid or bvid"
  }
}
</i18n>

<template>
  <a-auto-complete
    :placeholder="$t('video_aid_or_bvid')"
    v-model="input"
    @change="inputChangeHandler"
    optionLabelProp="text"
    allowClear
    style="width: 100%"
  >
    <template slot="dataSource">
      <a-select-option
        v-for="item of idTitleList"
        :key="typeDisplayString + item.id"
        :text="typeDisplayString + item.id"
      >
        {{ typeDisplayString }}{{ item.id }} - {{ item.title }}
      </a-select-option>
    </template>
  </a-auto-complete>
</template>

<script>
export default {
  name: 'TddVideoAbidAutoComplete',
  props: [
    'value'
  ],
  data: function () {
    return {
      input: '',
      idTitleList: [],
      typeDisplayString: '',
      debouncedUpdateIdList: this.$util.debounce(this.updateIdList, 500),
    };
  },
  computed: {
    id: function () {
      const inputInitial = this.input ? this.input.substr(0, 2).toLowerCase() : '';
      if (inputInitial === 'bv' || inputInitial === 'av') {
        return this.input.substr(2);
      } else {
        return this.input;
      }
    },
    type: function () {
      const inputInitial = this.input ? this.input.substr(0, 2).toLowerCase() : '';
      let inputBody = this.input ? this.input : '';
      if (inputInitial === 'av' || inputInitial === 'bv') {
        inputBody = inputBody.substr(2);
      }
      if (inputInitial === 'bv' || (inputInitial !== 'av' && String(Number(inputBody)) !== inputBody)) {
        return 'bvid';
      } else {
        return 'aid';
      }
    },
  },
  methods: {
    updateIdList: function (type, id) {
      const url = `video/${type}title?${type}=${id}`;
      let that = this;
      this.$axios.get(url)
        .then(function (response) {
          that.idTitleList = response.data.map(x => ({
            id: x[type],
            title: x.title,
          }));
          that.typeDisplayString = {aid: 'av', bvid: 'BV'}[type];
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    inputChangeHandler: function () {
      // v-model emit
      this.$emit('input', {
        id: this.id,
        type: this.type,
      });
      
      // only allow length of id >= 4 query
      if (!this.id || this.id.length < 4) {
        this.idTitleList = [];
        return;
      }
      
      this.debouncedUpdateIdList(this.type, this.id);
    },
  },
}
</script>

<style scoped>

</style>
