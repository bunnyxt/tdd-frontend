<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <div v-wechat-title="$route.meta.title=mid+' - UP主详情 - 天钿Daily'"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/member">UP主</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ mid }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div v-if="isLoadingMember">
      <div class="section-block">
        <a-spin :spinning="true">
          正在获取用户<a :href="'https://space.bilibili.com/' + this.$route.params.mid" target="_blank">{{ this.$route.params.mid }}</a>的信息
        </a-spin>
      </div>
    </div>
    <div v-else>
      <div v-if="Object.keys(member).length === 0">
        <div class="section-block">
          <p>没有找到用户<a :href="'https://space.bilibili.com/' + this.$route.params.mid" target="_blank">{{ this.$route.params.mid }}</a>的信息</p>
          <p>可能是因为改用户的视频投稿不在本站收录范围内</p>
          <a @click="$router.go(-1)">返回上一页</a>
        </div>
      </div>
      <div v-else>
        <div v-wechat-title="$route.meta.title=member.name+' - UP主详情 - 天钿Daily'"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MemberDetail',
    data: function () {
      return {
        member: null,
        memberVideoList: [],
        isLoadingMember: false,
        isLoadingMemberVideos: false
      }
    },
    computed: {
      mid: function () {
        return this.$route.params.mid;
      }
    },
    methods: {
      getMemberInfo: function(mid, checkMemberFromStore=false) {
        this.isLoadingMember = true;
        this.isLoadingMemberVideos = true;

        // check video from store
        let memberLoadedFromStore = false;
        if (checkMemberFromStore) {
          // let member = this.$store.state.memberDetailMember;
          let member = null;
          if (member && member.mid === mid) {
            this.member = member;
            // this.$store.commit('setVideoDetailVideo', null);
            memberLoadedFromStore = true;
            this.isLoadingMember = false;
          }
        }

        let that = this;
        if (!memberLoadedFromStore) {
          this.$axios.get('member/' + mid)
            .then(function (response) {
              that.member = response.data;
            })
            .catch(function (error) {
              console.log(error);
            })
            .finally(function () {
              that.isLoadingMember = false;
            });
        }

        this.$axios.get('member/' + mid + '/video')
          .then(function (response) {
            that.memberVideoList = response.data;
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            that.isLoadingMemberVideos = false;
          });
      }
    },
    created: function() {
      this.getMemberInfo(this.mid, true);
    },
  }
</script>

<style scoped>

</style>