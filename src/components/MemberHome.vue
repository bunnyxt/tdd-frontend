<template>
  <div style="height: auto !important;height: 100%; margin: 0 auto -120px;">
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>UP主</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>UP主</h1>
      <p>天钿Daily收录的所有视频的B站UP主和staff们。</p>
      <a-alert style="margin-bottom: 8px" message="UP主昵称、头像、签名等信息并非实时，最低每24小时更新一次" banner />
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
              :loading="isLoadingMemberList"
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
      <a-spin :spinning="isLoadingMemberList">
        <tdd-member-list
            :member-list="memberList"
            :main-prop="mainProp"
            @item-clicked="memberListItemClickedHandler"
        />
        <a-pagination
            showQuickJumper
            v-model="pagiCurrent"
            :total="memberTotalCount"
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
  import TddMemberList from "./common/TddMemberList";

  export default {
    name: 'MemberHome',
    components: {
      TddMemberList
    },
    data: function () {
      return {
        memberList: [],
        memberTotalCount: 0,
        pagiCurrent: 1,
        orderValue: 'sr_view',
        orderDescValue: 1,
        sexValue: '不限',
        nameValue: '',
        isLoadingMemberList: false,
        mainProp: 'sr_view'
      }
    },
    methods: {
      checkParams: function () {
        // TODO
        return true;
      },
      assembleQueryUrl: function () {
        let url = 'member?';
        // order_by
        url += 'order_by=' + this.orderValue + '&';
        // desc
        if (this.orderDescValue === 0) {
          url += 'desc=0&';
        } else {
          url += 'desc=1&';
        }
        // sex
        if (['男', '女', '保密'].indexOf(this.sexValue) >= 0) {
          url += 'sex=' + this.sexValue + '&';
        }
        // name
        if (this.nameValue) {
          url += 'name='+ this.nameValue + '&';
        }
        // pn
        url += 'pn=' + this.pagiCurrent;
        return url;
      },
      fetchMemberList: function () {
        this.isLoadingMemberList = true;
        if (!this.checkParams()) {
          this.isLoadingMemberList = false;
          return;
        }

        let url = this.assembleQueryUrl();
        let that = this;
        this.$axios.get(url)
          .then(function (response) {
            that.memberList = response.data;
            that.memberTotalCount = parseInt(response.headers['x-total-count']);
            // change mainProp
            if (that.orderValue.startsWith('sr_')) {
              that.mainProp = that.orderValue;
            } else if (that.orderValue === 'fr_follower') {
              that.mainProp = 'fr_follower';
            } else if (that.orderValue === 'v_pubdate') {
              that.mainProp = 'v_pubdate';
            }else {
              that.mainProp = 'sr_view';
            }
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            that.isLoadingMemberList = false;
          });
      },
      handleSearchButtonClick: function () {
        if (!this.isLoadingMemberList) {
          this.fetchMemberList();
        }
      },
      handleReloadButtonClick: function() {
        this.sexValue = 0;
        this.nameValue = '';
      },
      onPagiChange: function (pagiClick) {
        this.pagiCurrent = pagiClick;
        this.fetchMemberList();
      },
      memberListItemClickedHandler: function (item) {
        this.$store.commit('setMemberDetailMember', item);
        this.$router.push('member/' + item.mid);
      }
    },
    created() {
      this.fetchMemberList();
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