<template>
  <div>
    <div class="tdd-cover-pic">
      <img :src="$util.httpS(src)" alt="pic">
      <div style="position: absolute; padding: 8px">
        <a-tag v-for="tag in tagList" :key="tag.title" :color="tag.color" style="margin-bottom: 4px">{{ tag.title }}</a-tag>
      </div>
      <div v-if="video.videos && video.videos > 1" style="position: absolute; bottom: 6px; right: 0">
        <a-tag>{{ video.videos }}P</a-tag>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TddVideoCover',
  props: {
    src: {
      type: String,
      required: true
    },
    video: {
      type: Object
    }
  },
  data: function () {
    return {

    }
  },
  computed: {
    tagList: function () {
      let tagList = [];
      if (this.video) {
        tagList = this.$util.getTagList(this.video);
      }
      return tagList;
    }
  }
}
</script>

<style scoped>
.tdd-cover-pic {
  width: 100%;
  height: 0;
  position: relative;
  padding-bottom: 60%;
}
.tdd-cover-pic img {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
