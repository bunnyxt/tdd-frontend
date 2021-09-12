<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "fetching_member_info_prompt": "正在获取用户{0}的信息...",
    "member_info_not_found_prompt": "没有找到用户{0}的信息",
    "member_not_tracked_prompt": "可能是因为该用户的视频投稿不在本站收录范围内"
  },
  "en": {
    "fetching_member_info_prompt": "Now fetching info of member {0}...",
    "member_info_not_found_prompt": "Info of member {0} not found.",
    "member_not_tracked_prompt": "It may be due to this member's videos not satisfied the tracking requirements of this site."
  }
}
</i18n>

<template>
  <div>
    <div v-if="isLoadingMember">
      <a-spin size="small" style="margin-right: 8px" />
      <i18n path="fetching_member_info_prompt" tag="label">
        <a :href="`https://space.bilibili.com/${mid}`" target="_blank">{{ `mid_${mid}` }}</a>
      </i18n>
    </div>
    <div v-else>
      <div v-if="!member || Object.keys(member).length === 0">
        <div class="section-block">
          <i18n path="member_info_not_found_prompt" tag="label">
            <a :href="`https://space.bilibili.com/${mid}`" target="_blank">{{ `mid_${mid}` }}</a>
          </i18n>
          <p>{{ $t('member_not_tracked_prompt') }}</p>
        </div>
      </div>
      <div v-else>
        <div class="tdd-member-card-header">
          <a-avatar
            class="tdd-member-card-header-avatar"
            :src="member.face ? $util.httpS(member.face) : 'https://static.hdslb.com/images/member/noface.gif'"
            :size="48"
          />
          <div class="tdd-member-card-header-content">
            <div class="tdd-member-card-header-title">
              <span style="font-size: 1.17em; font-weight: 500">{{ member.name }}</span>
              <template v-if="member.sex === '男'">
                <span class="tdd-member-card-header-title-sex" style="color: #00b5f6">
                  <icon-font type="icon-xingbie-nan" />
                </span>
              </template>
              <template v-else-if="member.sex === '女'">
                <span class="tdd-member-card-header-title-sex" style="color: #f9a9f8">
                  <icon-font type="icon-xingbie-nv" />
                </span>
              </template>
              <template v-else-if="member.sex === '保密'">
                <span class="tdd-member-card-header-title-sex" style="color: rgba(183,183,183,0.95)">
                  <icon-font type="icon-xingbie-weizhi" />
                </span>
              </template>
            </div>
            <div class="tdd-member-card-header-video-count-follower">
              <a-icon type="video-camera" class="stat-item-icon" style="margin-right: 4px" />
              {{ member.video_count.toLocaleString() }}
              <a-icon type="team" class="stat-item-icon" style="margin-left: 12px; margin-right: 4px" />
              {{ member.last_follower ? member.last_follower.follower.toLocaleString() : -1 }}
            </div>
          </div>
        </div>
        {{ member.sign }}
      </div>
    </div>
  </div>
</template>

<script>
import {Icon} from "ant-design-vue";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1640736_mzfdr5d9c2h.js',
});

export default {
  name: 'TddMemberCard',
  props: {
    mid: {
      type: Number,
      required: true,
    }
  },
  components: {
    IconFont,
  },
  data: function () {
    return {
      member: null,
      isLoadingMember: false,
    }
  },
  watch: {
    mid: function() {
      this.getMemberInfo(this.mid);
    }
  },
  methods: {
    getMemberInfo: function(mid) {
      this.isLoadingMember = true;
      
      let that = this;
      // production
      this.$axios.get(`member/${mid}`)
        .then(function (response) {
          that.member = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          that.isLoadingMember = false;
        });
      
      // // 1000 ms delay debug
      // setTimeout(() => that.$axios.get(`member/${mid}`)
      //   .then(function (response) {
      //     that.member = response.data;
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   })
      //   .finally(function () {
      //     that.isLoadingMember = false;
      //   }), 1000);
    },
  },
  created() {
    this.getMemberInfo(this.mid);
  }
}
</script>

<style scoped>
.tdd-member-card-header {
  overflow: hidden;
  margin-bottom: 8px;
}
.tdd-member-card-header-avatar {
  float: left;
  margin-right: 12px;
}
.tdd-member-card-header-content {
  float: left;
  width: calc(100% - 60px);
}
.tdd-member-card-header-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tdd-member-card-header-title-sex {
  font-size: 1.17em;
  margin-top: 4px;
  margin-left: 8px;
}
.tdd-member-card-header-video-count-follower {
  margin-top: 4px;
}
</style>
