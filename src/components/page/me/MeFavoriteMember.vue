<i18n src="@/i18n/common.json"></i18n>

<template>
  <div>
    <div v-wechat-title="$t('page_title.me_favored_member')"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/me">{{ $t('page_name.me') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('page_name.me_favored_member') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
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
                  <a-radio :value="'added'">关注时间</a-radio>
                  <a-radio :value="'mid'">用户mid</a-radio>
                  <a-radio :value="'video_count'">投稿总数</a-radio>
                  <a-radio :value="'v_pubdate'">最近投稿</a-radio>
                  <a-radio :value="'fr_follower'">粉丝数</a-radio><br>
                  <a-radio :value="'sr_view'">总播放数</a-radio>
                  <a-radio :value="'sr_danmaku'">总弹幕数</a-radio>
                  <a-radio :value="'sr_reply'">总评论数</a-radio>
                  <a-radio :value="'sr_favorite'">总收藏数</a-radio>
                  <a-radio :value="'sr_coin'">总硬币数</a-radio>
                  <a-radio :value="'sr_share'">总分享数</a-radio>
                  <a-radio :value="'sr_like'">总点赞数</a-radio>
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
            <tr>
              <td class="filter-table-label">
                性别
              </td>
              <td>
                <a-radio-group name="sexSelector" v-model="sexValue">
                  <a-radio :value="'不限'">不限</a-radio>
                  <a-radio :value="'男'">男</a-radio>
                  <a-radio :value="'女'">女</a-radio>
                  <a-radio :value="'保密'">保密</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td class="filter-table-label">
                昵称
              </td>
              <td>
                <a-input
                  v-model="nameValue"
                  placeholder="UP主"
                  allowClear
                />
              </td>
            </tr>
          </table>
          <a-button
            type="primary"
            icon="search"
            :loading="isLoadingUserFavoriteMemberList"
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
      <a-spin :spinning="isLoadingUserFavoriteMemberList">
        <tdd-member-table :member-list="userFavoriteMemberList" />
        <a-pagination
          showQuickJumper
          v-model="pagiCurrent"
          :total="userFavoriteMemberTotalCount"
          :showTotal="total => `共 ${total} 位UP主`"
          :pageSize="20"
          style="margin-top: 8px"
          @change="onPagiChange"
        />
      </a-spin>
    </div>
  </div>
</template>

<script>
import TddMemberTable from "../../common/TddMemberTable";

export default {
  name: 'MeFavoriteMember',
  components: {
    TddMemberTable
  },
  data: function () {
    return {
      userFavoriteMemberList: [],
      isLoadingUserFavoriteMemberList: false,
      orderValue: 'added',
      orderDescValue: 1,
      sexValue: '不限',
      nameValue: '',
      pagiCurrent: 1,
      userFavoriteMemberTotalCount: 0,
    }
  },
  methods: {
    assemblyQuery: function () {
      let url = '/user/favorite/member/me?';

      // name
      if (this.nameValue) {
        url += 'name='+ this.nameValue + '&';
      }
      // sex
      if (['男', '女', '保密'].indexOf(this.sexValue) >= 0) {
        url += 'sex=' + this.sexValue + '&';
      }
      // order_by
      url += 'order_by=' + this.orderValue + '&';
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
    fetchUserFavoriteMemberList: function () {
      this.isLoadingUserFavoriteMemberList = true;

      let that = this;
      const url = this.assemblyQuery();
      this.$axios.get(url)
        .then(function (response) {
          that.userFavoriteMemberList = [];
          let oriList = response.data;
          for (let item of oriList) {
            let obj = item.member;
            obj.favorite_added = item.added;
            that.userFavoriteMemberList.push(obj);
          }
          that.userFavoriteMemberTotalCount = parseInt(response.headers['x-total-count']);
        })
        .catch(function (error) {
          if (error.response) {
            if (error.response.data.code === 40102) {
              that.$util.tddErrorHandler40102(that, true);
            } else {
              console.log(error.response);
            }
          } else {
            console.log(error);
          }
        })
        .finally(function () {
          that.isLoadingUserFavoriteMemberList = false;
        });
    },
    userFavoriteMemberListItemClickedHandler: function (item) {
      this.$store.commit('setMemberDetailMember', item);
      this.$router.push('member/' + item.mid);
    },
    onPagiChange: function (pagiClick) {
      this.pagiCurrent = pagiClick;
      this.fetchUserFavoriteMemberList();
    },
    handleSearchButtonClick: function () {
      if (!this.isLoadingUserFavoriteVideoList) {
        this.pagiCurrent = 1;
        this.fetchUserFavoriteMemberList();
      }
    },
    handleReloadButtonClick: function() {
      this.orderValue = 'added';
      this.orderDescValue = 1;
    }
  },
  created: function () {
    this.fetchUserFavoriteMemberList();
  }
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
