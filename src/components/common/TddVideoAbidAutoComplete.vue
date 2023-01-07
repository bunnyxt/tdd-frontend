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
    v-model:value="input"
    :placeholder="$t('video_aid_or_bvid')"
    :options="options"
    allow-clear
    style="width: 100%"
    @change="inputChangeHandler"
  >
    <template #option="{ text }">
      {{ text }}
    </template>
  </a-auto-complete>
</template>

<script>
export default {
  name: 'TddVideoAbidAutoComplete',
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data: function () {
    return {
      input: '',
      idTitleList: [],
      options: [],
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
    typePrefix: function (type) {
      return {
        aid: 'av',
        bvid: 'BV',
      }[type];
    },
    updateIdList: function (type, id) {
      const url = `video/${type}title?${type}=${id}`;
      this.$axios.get(url)
        .then((response) => {
          this.options = response.data.map(item => ({
            value: `${this.typePrefix(type)}${item[type]}`,
            text: `${this.typePrefix(type)}${item[type]} - ${item.title}`,
          }));
        })
        .catch((error) => {
          console.log(error);
        })
    },
    inputChangeHandler: function () {
      // v-model emit
      this.$emit('update:modelValue', {
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
