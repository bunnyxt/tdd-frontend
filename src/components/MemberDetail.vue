<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <div v-wechat-title="$route.meta.title='mid_'+mid+' - UP主详情 - 天钿Daily'"></div>
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
          正在获取用户<a :href="'https://space.bilibili.com/' + this.$route.params.mid" target="_blank">{{ 'mid_'+this.$route.params.mid }}</a>的信息
        </a-spin>
      </div>
    </div>
    <div v-else>
      <div v-if="Object.keys(member).length === 0">
        <div class="section-block">
          <p>没有找到用户<a :href="'https://space.bilibili.com/' + this.$route.params.mid" target="_blank">{{ 'mid_'+this.$route.params.mid }}</a>的信息</p>
          <p>可能是因为改用户的视频投稿不在本站收录范围内</p>
          <a @click="$router.go(-1)">返回上一页</a>
        </div>
      </div>
      <div v-else>
        <div v-wechat-title="$route.meta.title=member.name+' - UP主详情 - 天钿Daily'"></div>
        <div class="section-block">
        {{ member }}
        </div>
        <div class="section-separator"></div>
        <div class="section-block">
          <a-collapse :activeKey="[1]" style="margin-bottom: 8px">
            <a-collapse-panel header="筛选搜索" key="1">
              <table class="filter-table">
                <tr>
                  <td class="filter-table-label">
                    排序依据
                  </td>
                  <td>
                    <a-radio-group name="orderSelector" v-model="orderValue">
                      <a-radio :value="1">投稿时间</a-radio>
                      <a-radio :value="2">播放</a-radio>
                      <a-radio :value="3">弹幕</a-radio>
                      <a-radio :value="4">评论</a-radio>
                      <a-radio :value="5">收藏</a-radio>
                      <a-radio :value="6">硬币</a-radio>
                      <a-radio :value="7">分享</a-radio>
                      <a-radio :value="8">点赞</a-radio>
                    </a-radio-group>
                  </td>
                </tr>
                <tr>
                  <td class="filter-table-label">
                    排序顺序
                  </td>
                  <td>
                    <a-radio-group name="orderDescSelector" v-model="orderDescValue">
                      <a-radio :value="0">从小到大</a-radio>
                      <a-radio :value="1">从大到小</a-radio>
                    </a-radio-group>
                  </td>
                </tr>
              </table>
              <a-button
                  type="primary"
                  icon="search"
                  :loading="isLoadingMemberVideos"
                  @click="handleSearchButtonClick"
                  style="margin-top: 8px"
              >
                搜索
              </a-button>
              <a-popconfirm
                  title="确定重置所有条件？"
                  @confirm="handleReloadButtonClick"
                  okText="确定"
                  cancelText="取消"
              >
                <a-button
                    icon="reload"
                    style="margin-top: 8px; margin-left: 16px"
                >
                  重置
                </a-button>
              </a-popconfirm>
            </a-collapse-panel>
          </a-collapse>
          <a-spin :spinning="isLoadingMemberVideos">
            <tdd-video-list
                :video-list="memberVideoList"
                :mode="'grid'"
                @item-clicked="videoListItemClickedHandler"
            />
            <a-pagination
                showQuickJumper
                v-model="pagiCurrent"
                :total="memberVideoTotalCount"
                :showTotal="total => `共 ${total} 个视频`"
                :pageSize="20"
                style="margin-top: 8px"
                @change="onPagiChange"
            />
          </a-spin>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TddVideoList from "./common/TddVideoList";

  export default {
    name: 'MemberDetail',
    data: function () {
      return {
        member: null,
        memberVideoList: [],
        isLoadingMember: false,
        isLoadingMemberVideos: false,
        pagiCurrent: 1,
        memberVideoTotalCount: 0,
        orderValue: 1,
        orderDescValue: 1
      }
    },
    components: {
      TddVideoList
    },
    computed: {
      mid: function () {
        return this.$route.params.mid;
      }
    },
    watch: {
      mid: function () {
        this.getMemberInfo(this.mid, true);
        this.fetchVideoList();
      }
    },
    methods: {
      getMemberInfo: function(mid, checkMemberFromStore=false) {
        this.isLoadingMember = true;

        // check video from store
        let memberLoadedFromStore = false;
        if (checkMemberFromStore) {
          let member = this.$store.state.memberDetailMember;
          if (member && member.mid === mid) {
            this.member = member;
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
      },
      assemblyQuery: function () {
        let url = 'member/' + this.mid + '/video?';
        // order_by
        switch (this.orderValue) {
          case 2:
            url += 'order_by=view&';
            break;
          case 3:
            url += 'order_by=danmaku&';
            break;
          case 4:
            url += 'order_by=reply&';
            break;
          case 5:
            url += 'order_by=favorite&';
            break;
          case 6:
            url += 'order_by=coin&';
            break;
          case 7:
            url += 'order_by=share&';
            break;
          case 8:
            url += 'order_by=like&';
            break;
          case 1:
          default:
            url += 'order_by=pubdate&';
            break;
        }
        // desc
        if (this.orderDescValue === 0) {
          url += 'desc=0&';
        } else {
          url += 'desc=1&';
        }
        // pn
        url += 'pn=' + this.pagiCurrent;
        return url;
      },
      fetchVideoList: function () {
        this.isLoadingMemberVideos = true;

        let that = this;
        let url = this.assemblyQuery();
        this.$axios.get(url)
          .then(function (response) {
            that.memberVideoList = response.data;
            that.memberVideoTotalCount = parseInt(response.headers['x-total-count']);
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            that.isLoadingMemberVideos = false;
          });
      },
      videoListItemClickedHandler: function (item) {
        this.$store.commit('setVideoDetailDrawerVideo', item);
        this.$store.commit('setVideoDetailDrawerVisibility', true);
      },
      onPagiChange: function (pagiClick) {
        this.pagiCurrent = pagiClick;
        this.fetchVideoList();
      },
      handleSearchButtonClick: function () {
        if (!this.isLoadingMemberVideos) {
          this.pagiCurrent = 1;
          this.fetchVideoList();
        }
      },
      handleReloadButtonClick: function() {
        this.orderValue = 1;
        this.orderDescValue = 1;
      }
    },
    created: function() {
      this.getMemberInfo(this.mid, true);
      this.fetchVideoList();
    },
  }
</script>

<style scoped>
  .filter-table td {
    height: 40px;
  }
  .filter-table-label {
    width: 80px;
    white-space: nowrap;
  }
</style>