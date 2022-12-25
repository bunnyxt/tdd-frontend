<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "page_intro_member": "天钿Daily收录的所有视频的B站UP主和staff们。",
    "update_interval_alert": "UP主信息、粉丝数、数据总计等并非实时，最低每24小时更新一次",
    "pagi_total": "共 {total} 位UP主",
    "filter": {
      "sort_by": {
        "label": "排序依据",
        "member_prefix": "UP主"
      },
      "sort_order": {
        "label": "排序顺序",
        "asc": "从小到大",
        "desc": "从大到小"
      },
      "sex": {
        "all": "不限",
        "secret": "保密"
      }
    },
    "reset_confirm": "确定重置所有条件？"
  },
  "en": {
    "page_intro_member": "All uploader and staff of all tracked videos.",
    "update_interval_alert": "All data including uploader info, followers, all video statistics etc. may not up-to-date. They will be updated at least once per 24 hours.",
    "pagi_total": "{total} uploaders in total",
    "filter": {
      "sort_by": {
        "label": "Sort By",
        "member_prefix": "Uploader "
      },
      "sort_order": {
        "label": "Sort Order",
        "asc": "Asc",
        "desc": "Desc"
      },
      "sex": {
        "all": "All",
        "secret": "Secret"
      }
    },
    "reset_confirm": "Reset all search filters?"
  }
}
</i18n>

<template>
  <div>
    <div v-wechat-title="$t('page_title.member')"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('page_name.member') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>{{ $t('page_name.member') }}</h1>
      <p>{{ $t('page_intro_member') }}</p>
      <a-alert style="margin-bottom: 8px" :message="$t('update_interval_alert')" banner />
    </div>
    <div class="section-separator"></div>
    <div class="section-block">
      <a-collapse :activeKey="[1]" style="margin-bottom: 8px">
        <a-collapse-panel :header="$t('search_filter')" key="1">
          <table class="filter-table">
            <tr>
              <td class="filter-table-label">
                {{ $t('filter.sort_by.label') }}
              </td>
              <td>
                <a-radio-group name="orderSelector" v-model:value="orderValue">
                  <a-radio value="mid">{{ $t('filter.sort_by.member_prefix') }}mid</a-radio>
                  <a-radio value="video_count">{{ $t('total_prefix')}}{{ $t('video_count') }}</a-radio>
                  <a-radio value="v_pubdate">{{ $t('latest_video') }}</a-radio>
                  <a-radio value="fr_follower">{{ $t('total_prefix')}}{{ $t('follower_count') }}</a-radio><br>
                  <a-radio value="sr_view">{{ $t('total_prefix')}}{{ $t('view') }}</a-radio>
                  <a-radio value="sr_danmaku">{{ $t('total_prefix')}}{{ $t('danmaku') }}</a-radio>
                  <a-radio value="sr_reply">{{ $t('total_prefix')}}{{ $t('reply') }}</a-radio>
                  <a-radio value="sr_favorite">{{ $t('total_prefix')}}{{ $t('favorite') }}</a-radio>
                  <a-radio value="sr_coin">{{ $t('total_prefix')}}{{ $t('coin') }}</a-radio>
                  <a-radio value="sr_share">{{ $t('total_prefix')}}{{ $t('share') }}</a-radio>
                  <a-radio value="sr_like">{{ $t('total_prefix')}}{{ $t('like') }}</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td class="filter-table-label">
                {{ $t('filter.sort_order.label') }}
              </td>
              <td>
                <a-radio-group name="orderDescSelector" v-model:value="orderDescValue">
                  <a-radio :value="0">{{ $t('filter.sort_order.asc') }}</a-radio>
                  <a-radio :value="1">{{ $t('filter.sort_order.desc') }}</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td class="filter-table-label">
                {{ $t('sex') }}
              </td>
              <td>
                <a-radio-group name="sexSelector" v-model:value="sexValue">
                  <a-radio value="不限">{{ $t('filter.sex.all') }}</a-radio>
                  <a-radio value="男">{{ $t('male') }}</a-radio>
                  <a-radio value="女">{{ $t('female') }}</a-radio>
                  <a-radio value="保密">{{ $t('filter.sex.secret') }}</a-radio>
                </a-radio-group>
              </td>
            </tr>
            <tr>
              <td class="filter-table-label">
                {{ $t('name') }}
              </td>
              <td>
                <a-input
                  v-model="nameValue"
                  :placeholder="$t('name')"
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
            {{ $t('search') }}
          </a-button>
          <a-popconfirm
            :title="$t('reset_confirm')"
            @confirm="handleReloadButtonClick"
            :okText="$t('ok')"
            :cancelText="$t('cancel')"
          >
            <a-button
              icon="reload"
              style="margin-top: 8px; margin-left: 16px"
            >
              {{ $t('reset') }}
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
          :showTotal="total => $t('pagi_total', { total })"
          :pageSize="20"
          style="margin-top: 8px"
          @change="onPagiChange"
        />
      </a-spin>
    </div>
  </div>
</template>

<script>
import TddMemberList from "../../common/TddMemberList";

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
          } else {
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
      this.sexValue = '不限';
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
