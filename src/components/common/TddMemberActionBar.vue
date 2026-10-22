<i18n>
{
  "zh": {
    "open_bilibili": "前往UP主B站个人空间"
  },
  "en": {
    "open_bilibili": "Open Bilibili profile"
  }
}
</i18n>

<template>
  <div class="public-action-bar">
    <a-button
      class="bili-btn"
      :title="$t('open_bilibili')"
      :href="'https://space.bilibili.com/' + mid"
      target="_blank"
      rel="noopener noreferrer"
    >
      <a-icon type="home" /> {{ $t('open_bilibili') }}
    </a-button>
  </div>
</template>

<script>
export default {
  name: 'TddMemberActionBar',
  props: {
    mid: { type: Number, required: true },
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
