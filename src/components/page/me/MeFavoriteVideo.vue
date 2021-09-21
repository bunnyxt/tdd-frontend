<i18n src="@/i18n/common.json"></i18n>

<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/me">{{ $t('page_name.me') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('page_name.me_favored_video') }}</a-breadcrumb-item>
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
                  <a-radio :value="'pubdate'">投稿时间</a-radio>
                  <a-radio :value="'view'">播放</a-radio>
                  <a-radio :value="'danmaku'">弹幕</a-radio>
                  <a-radio :value="'reply'">评论</a-radio>
                  <a-radio :value="'favorite'">收藏</a-radio>
                  <a-radio :value="'coin'">硬币</a-radio>
                  <a-radio :value="'share'">分享</a-radio>
                  <a-radio :value="'like'">点赞</a-radio>
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
            :loading="isLoadingUserFavoriteVideoList"
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
      <a-spin :spinning="isLoadingUserFavoriteVideoList">
        <tdd-video-table :video-list="userFavoriteVideoList" />
        <a-pagination
          showQuickJumper
          v-model="pagiCurrent"
          :total="userFavoriteVideoTotalCount"
          :showTotal="total => `共 ${total} 个视频`"
          :pageSize="20"
          style="margin-top: 8px"
          @change="onPagiChange"
        />
      </a-spin>
    </div>
  </div>
</template>

<script>
import TddVideoTable from "../../common/TddVideoTable";

export default {
  name: 'MeFavoriteVideo',
  components: {
    TddVideoTable
  },
  data: function () {
    return {
      userFavoriteVideoList: [],
      isLoadingUserFavoriteVideoList: false,
      orderValue: 'added',
      orderDescValue: 1,
      pagiCurrent: 1,
      userFavoriteVideoTotalCount: 0,
    }
  },
  methods: {
    assemblyQuery: function () {
      let url = '/user/favorite/video/me?';
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
    fetchUserFavoriteVideoList: function () {
      this.isLoadingUserFavoriteVideoList = true;

      let that = this;
      const url = this.assemblyQuery();
      this.$axios.get(url)
        .then(function (response) {
          that.userFavoriteVideoList = [];
          let oriList = response.data;
          for (let item of oriList) {
            let obj = item.video;
            obj.favorite_added = item.added;
            that.userFavoriteVideoList.push(obj);
          }
          that.userFavoriteVideoTotalCount = parseInt(response.headers['x-total-count']);
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
          that.isLoadingUserFavoriteVideoList = false;
        });
    },
    userFavoriteVideoListItemClickedHandler: function (item) {
      this.$store.commit('setVideoDetailDrawerVideo', item);
      this.$store.commit('setVideoDetailDrawerVisibility', true);
    },
    onPagiChange: function (pagiClick) {
      this.pagiCurrent = pagiClick;
      this.fetchUserFavoriteVideoList();
    },
    handleSearchButtonClick: function () {
      if (!this.isLoadingUserFavoriteVideoList) {
        this.pagiCurrent = 1;
        this.fetchUserFavoriteVideoList();
      }
    },
    handleReloadButtonClick: function() {
      this.orderValue = 'added';
      this.orderDescValue = 1;
    }
  },
  created: function () {
    this.fetchUserFavoriteVideoList();
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
