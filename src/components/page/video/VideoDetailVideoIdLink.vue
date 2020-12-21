<template>
  <a :href="`https://www.bilibili.com/video/${videoId}}`" target="_blank">{{ videoId }}</a>
</template>

<script>
export default {
  name: 'VideoDetailVideoIdLink',
  props: {
    aid: {
      type: Number,
      required: true,
    },
    bvid: {
      type: String,
      required: true,
    },
    fromBvid: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    videoId: function () {
      return this.fromBvid ? `BV${this.bvid}` : `av${this.aid}`;
    },
  },
}
</script>

<style scoped>

</style>
