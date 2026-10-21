<i18n>
{
  "zh": {
    "open_bilibili": "去B站观看"
  },
  "en": {
    "open_bilibili": "Watch on Bilibili"
  }
}
</i18n>

<template>
  <div class="public-action-bar">
    <a-button
      class="bili-btn"
      :title="$t('open_bilibili')"
      :href="'https://www.bilibili.com/video/av' + aid"
      target="_blank"
      rel="noopener noreferrer"
    >
      <a-icon type="play-circle" /> {{ $t('open_bilibili') }}
    </a-button>
  </div>
</template>

<script>
export default {
  name: 'TddVideoActionBar',
  props: {
    aid: { type: Number, required: true },
    small: { type: Boolean, default: false }
  }
};
</script>

<style scoped>
.public-action-bar {
  margin-top: 8px;
  margin-bottom: 12px;
}
</style>
