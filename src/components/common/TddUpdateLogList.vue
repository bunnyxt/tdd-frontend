<i18n>
{
  "zh": {
    "see_more": "查看更多"
  },
  "en": {
    "see_more": "See more"
  }
}
</i18n>

<template>
  <a-timeline>
    <a-timeline-item
      v-for="updateLog in updateLogList"
      :key="updateLog.added"
      :color="getTimelineItemColor(updateLog.type)"
    >
      <b>{{ $util.tsToDateString(updateLog.added, 'yyyy-MM-dd') }}</b> {{ updateLog.content }}
    </a-timeline-item>
    <template #pending>
      <a-button
        type="link" 
        @click="() => $router.push('/about/updatelog')"
      >
        {{ $t('see_more') }}...
      </a-button>
    </template>
  </a-timeline>
</template>

<script>
export default {
  name: 'TddUpdateLogList',
  props: {
    lastCount: {
      type: Number,
      default: 3,
    },
  },
  data: function () {
    return {
      isLoadingUpdateLogList: false,
      updateLogList: [],
    }
  },
  created() {
    this.fetchUpdateLogList();
  },
  methods: {
    fetchUpdateLogList: function () {
      this.isLoadingUpdateLogList = true;
      this.$axios.get(`updatelog?last_count=${this.lastCount}`)
        .then((response) => {
          this.updateLogList = response.data;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoadingUpdateLogList = false;
        });
    },
    getTimelineItemColor: function (type) {
      const timelineItemColorArray = ['blue', 'blue', 'red', 'green'];
      return timelineItemColorArray[type];
    },
  }
};
</script>

<style scoped>

</style>
