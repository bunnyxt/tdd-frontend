<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "tracked_videos": "收录视频",
    "tracked_videos_suffix": "个",
    "covered_members": "覆盖P主",
    "covered_members_suffix": "位",
    "data_records": "数据记录",
    "data_records_suffix": "条",
    "30_days_increment": "30日增幅"
  },
  "en": {
    "tracked_videos": "Tracked Videos",
    "tracked_videos_suffix": " ",
    "covered_members": "Covered Uploaders",
    "covered_members_suffix": " ",
    "data_records": "Data Records",
    "data_records_suffix": " ",
    "30_days_increment": "30 Days Increment"
  }
}
</i18n>

<template>
  <a-spin :spinning="isLoadingStatDailyList">
    <div
      v-if="$store.getters.clientMode === 'MOBILE'"
      class="stat-grid-mobile"
    >
      <a-statistic
        :title="$t('tracked_videos')"
        :value="latestVideoCount"
      >
        <template #suffix>
          {{ $t('tracked_videos_suffix') }}
        </template>
      </a-statistic>
      <a-statistic
        :title="$t('covered_members')"
        :value="latestMemberCount"
      >
        <template #suffix>
          {{ $t('covered_members_suffix') }}
        </template>
      </a-statistic>
      <a-statistic
        :title="$t('data_records')"
        :value="latestVideoRecordCount"
      >
        <template #suffix>
          {{ $t('data_records_suffix') }}
        </template>
      </a-statistic>
    </div>
    <div
      v-else
      class="stat-grid"
    >
      <a-statistic
        :title="$t('tracked_videos')"
        :value="latestVideoCount"
      >
        <template #suffix>
          {{ $t('tracked_videos_suffix') }}
        </template>
      </a-statistic>
      <a-statistic
        :title="$t('covered_members')"
        :value="latestMemberCount"
      >
        <template #suffix>
          {{ $t('covered_members_suffix') }}
        </template>
      </a-statistic>
      <a-statistic
        :title="$t('data_records')"
        :value="latestVideoRecordCount"
      >
        <template #suffix>
          {{ $t('data_records_suffix') }}
        </template>
      </a-statistic>
      <a-statistic
        :title="$t('30_days_increment')"
        :value="last30DayVideoCount"
      >
        <template #prefix>
          <arrow-up-outlined />
        </template>
      </a-statistic>
      <a-statistic
        :title="$t('30_days_increment')"
        :value="last30DayMemberCount"
      >
        <template #prefix>
          <arrow-up-outlined />
        </template>
      </a-statistic>
      <a-statistic
        :title="$t('30_days_increment')"
        :value="last30DayVideoRecordCount"
      >
        <template #prefix>
          <arrow-up-outlined />
        </template>
      </a-statistic>
    </div>
    <div class="till-time">
      <p>*{{ $t('till') }}{{ latestStatDailyTimeStr }}</p>
    </div>
  </a-spin>
</template>

<script>
import { ArrowUpOutlined } from "@ant-design/icons-vue";

export default {
  name: "TddStatistics",
  components: {
    ArrowUpOutlined,
  },  
  data: function () {
    return {
      isLoadingStatDailyList: true,
      statDailyList: [],
    }
  },
  computed: {
    furtherestStatDaily: function () {
      const length = this.statDailyList.length;
      if (length === 0) {
        return null;
      }
      return this.statDailyList[0];
    },
    latestStatDaily: function () {
      const length = this.statDailyList.length;
      if (length === 0) {
        return null;
      }
      return this.statDailyList[length - 1];
    },
    latestVideoCount: function () {
      if (!this.latestStatDaily) {
        return 0;
      }
      return this.latestStatDaily.video_count;
    },
    latestMemberCount: function () {
      if (!this.latestStatDaily) {
        return 0;
      }
      return this.latestStatDaily.member_count;
    },
    latestVideoRecordCount: function () {
      if (!this.latestStatDaily) {
        return 0;
      }
      return this.latestStatDaily.video_record_count;
    },
    latestStatDailyTimeStr: function () {
      if (!this.latestStatDaily) {
        return this.$util.tsToDateString(0);
      }
      return this.$util.tsToDateString(this.latestStatDaily.added);
    },
    last30DayVideoCount: function () {
      if (!this.furtherestStatDaily || !this.latestStatDaily) {
        return 0;
      }
      return this.latestStatDaily.video_count - this.furtherestStatDaily.video_count;
    },
    last30DayMemberCount: function () {
      if (!this.furtherestStatDaily || !this.latestStatDaily) {
        return 0;
      }
      return this.latestStatDaily.member_count - this.furtherestStatDaily.member_count;
    },
    last30DayVideoRecordCount: function () {
      if (!this.furtherestStatDaily || !this.latestStatDaily) {
        return 0;
      }
      return this.latestStatDaily.video_record_count - this.furtherestStatDaily.video_record_count;
    },
  },
  created() {
    this.fetchStatDailyList();
  },
  methods: {
    fetchStatDailyList: function () {
      this.isLoadingStatDailyList = true;
      const start_ts = Math.floor(+new Date / 1000) - 30 * 24 * 60 * 60; // 30 days before
      this.$axios.get(`statdaily?start_ts=${start_ts}`)
        .then((response) => {
          this.statDailyList = response.data;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoadingStatDailyList = false;
        });
    },
  }
}
</script>

<style scoped>
.stat-grid-mobile {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.stat-grid-mobile :last-child {
  grid-column: 1 / 3;
}

.stat-grid {
  display: grid;
  grid-template-columns: 3fr 3fr 4fr;
  margin-top: 12px;
}

.stat-grid .ant-statistic {
  padding: 8px 20px 0 20px;
}

.till-time {
  text-align: right; 
  color: rgba(0, 0, 0, 0.45); 
  margin-top: 8px;
}
</style>
