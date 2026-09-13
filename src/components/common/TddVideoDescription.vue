<i18n src="@/i18n/common.json"></i18n>

<template>
  <div class="tdd-video-description" style="position: relative">
    <div ref="text" :style="textStyle">
      <span>
        <template v-for="(segment, index) in descriptionSegments">
          <br v-if="segment.type === 'br'" :key="index">
          <a
            v-else-if="segment.type === 'link'"
            :key="index"
            :href="segment.href"
            target="_blank"
            rel="noopener noreferrer"
          >{{ segment.text }}</a>
          <span v-else :key="index">{{ segment.text }}</span>
        </template>
      </span>
    </div>
    <div class="show-all" v-if="!showAll && textHeight > 100" @click="() => this.showAll = true">
      {{ $t('show_all') }}
    </div>
    <div class="show-all-mask" v-if="!showAll && textHeight > 100"></div>
  </div>
</template>

<script>
export default {
  name: 'TddVideoDescription',
  props: {
    description: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      textHeight: 0,
      showAll: false
    }
  },
  watch: {
    description: function () {
      this.textHeight = this.$refs.text.clientHeight;
      this.showAll = false;
    }
  },
  computed: {
    // the description comes from an external API, so it is split into plain
    // text, line breaks and video links, and never rendered as HTML
    descriptionSegments: function () {
      const segments = [];
      const linkPattern = /BV[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{10}|av[0-9]+/g;
      this.description.split('\n').forEach((line, lineIndex) => {
        if (lineIndex > 0) {
          segments.push({ type: 'br' });
        }
        let lastIndex = 0;
        let match;
        while ((match = linkPattern.exec(line)) !== null) {
          if (match.index > lastIndex) {
            segments.push({ type: 'text', text: line.slice(lastIndex, match.index) });
          }
          segments.push({
            type: 'link',
            text: match[0],
            href: 'https://www.bilibili.com/video/' + match[0]
          });
          lastIndex = linkPattern.lastIndex;
        }
        if (lastIndex < line.length) {
          segments.push({ type: 'text', text: line.slice(lastIndex) });
        }
      });
      return segments;
    },
    textStyle: function () {
      let style = {};
      style.overflow = 'hidden';
      if (this.textHeight > 100 && !this.showAll) {
        style.height = '100px';
      }
      // style['transition:height'] = '2s';
      // style['-moz-transition:height'] = '2s'; /* Firefox 4 */
      // style['-webkit-transition:height'] = '2s'; /* Safari and Chrome */
      // style['-o-transition:height'] = '2s'; /* Opera */
      return style;
    }
  },
  mounted() {
    let that = this;
    that.textHeight = that.$refs.text.clientHeight;
    // TODO bind textHeight to height of text
    // window.addEventListener('resize', () => {
    //   that.textHeight = that.$refs.text.clientHeight;
    // });
  }
}
</script>

<style scoped>
/*.tdd-video-description {*/
/*  transition:height 2s;*/
/*  -moz-transition:height 2s; !* Firefox 4 *!*/
/*  -webkit-transition:height 2s; !* Safari and Chrome *!*/
/*  -o-transition:height 2s; !* Opera *!*/
/*}*/
.show-all {
  z-index: 2;
  position: absolute;
  cursor: pointer;
  height: 50px;
  top: 50px;
  width: 100%;
  line-height: 70px;
  text-align: center;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(232, 232, 232, 0.65));
}
.show-all-mask {
  z-index: 1;
  position: absolute;
  height: 50px;
  top: 50px;
  width: 100%;
  line-height: 70px;
  text-align: center;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
}
</style>
