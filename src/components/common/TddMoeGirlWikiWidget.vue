<template>
  <a-alert type="success" show-icon :style="widgetStyle">
    <img slot="icon" :src="moegirl_wiki_favicon" alt="logo" width="24" height="24" />
    <div slot="description">
      <div v-if="enableFold && fold">
        本{{ typeName }}已被萌娘百科收录...<a-button type="link" @click="expandClickHandler">展开</a-button>
      </div>
      <div v-else>
        本{{ typeName }}已被萌娘百科收录，有关该{{ typeName }}的更多内容，欢迎前往萌百浏览~<br>
        <a :href="url" target="_blank">{{ url }}</a>
      </div>
    </div>
  </a-alert>
</template>

<script>
import moegirl_wiki_favicon from "@/assets/img/moegirl_wiki_favicon.png";

export default {
  name: 'TddMoeGirlWikiWidget',
  props: {
    type: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    }
  },
  data: function () {
    return {
      moegirl_wiki_favicon: moegirl_wiki_favicon,
      fold: true,
    }
  },
  // watch: {
  //   // TODO check whether need this, or use another way to implement
  //   // new item must be folded initially
  //   url: function () {
  //     this.fold = true;
  //   },
  // },
  computed: {
    typeName: function () {
      const typeNames = {
        'video': '视频',
        'member': 'UP主',
      }
      return typeNames[this.type];
    },
    widgetStyle: function () {
      let style = {
        'border-color': '#b4e1b8',
        'background': '#e3f7d5',
      };
      if (this.$store.getters.clientMode !== 'MOBILE') {
        style['max-width'] = '320px';
      } else {
        style['width'] = '100%';
        style['padding'] = '8px 8px 8px 72px';
      }
      return style;
    },
    enableFold: function () {
      return this.$store.getters.clientMode === 'MOBILE';
    },
  },
  methods: {
    expandClickHandler: function () {
      this.fold = false;
    }
  },
}
</script>

<style scoped>

</style>
