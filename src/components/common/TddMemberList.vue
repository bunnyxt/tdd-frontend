<template>
  <a-list
      :data-source="memberList"
  >
    <a-list-item
        slot="renderItem"
        slot-scope="item"
        key="item.id"
        @click="$emit('item-clicked', item)"
    >
      <template v-if="$store.getters.clientMode === 'MOBILE'">
        <div class="tdd-member-item-mobile">
          <a-avatar
              class="tdd-member-item-mobile-avatar"
              :src="item.face ? item.face : 'https://static.hdslb.com/images/member/noface.gif'"
              :size="48"
          />
          <div class="tdd-member-item-mobile-content">
            <div class="tdd-member-item-mobile-title">
              <span style="color: rgba(0, 0, 0, 0.85); margin-right: 8px">{{ item.name }}</span>
              <template v-if="item.sex === '男'">
                <span style="color: #00b5f6">
                  <icon-font type="icon-xingbie-nan" />
                </span>
              </template>
              <template v-else-if="item.sex === '女'">
                <span style="color: #f9a9f8">
                  <icon-font type="icon-xingbie-nv" />
                </span>
              </template>
              <template v-else-if="item.sex === '保密'">
                <span style="color: rgba(183,183,183,0.95)">
                  <icon-font type="icon-xingbie-weizhi" />
                </span>
              </template>
            </div>
            <div>
              TODO：投稿数、总播放、最近投稿
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        {{ item.name }}
      </template>
    </a-list-item>
  </a-list>
</template>

<script>
  import { Icon } from 'ant-design-vue';

  const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1640736_mzfdr5d9c2h.js',
  });

  export default {
    name: 'TddMemberList',
    props: {
      memberList: {
        type: Array,
        required: true
      }
    },
    components: {
      IconFont
    },
    data: function () {
      return {

      }
    },
    methods: {

    }
  }
</script>

<style scoped>
  .tdd-member-item-mobile {
    overflow: hidden;
  }
  .tdd-member-item-mobile-avatar {
    float: left;
    margin-right: 12px;
  }
  .tdd-member-item-mobile-content {
    float: left;
    width: calc(100% - 60px);
    overflow: hidden;
  }
  .tdd-member-item-mobile-title {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* overwrite ant design style */
  /* add list item hover shadow */
  .ant-list-item {
    transition: all .2s;
  }
  .ant-list-item:hover {
    cursor: pointer;
    -webkit-box-shadow: 0 2px 8px rgba(0,0,0,.09);
    -moz-box-shadow: 0 2px 8px rgba(0,0,0,.09);
    box-shadow: 0 2px 8px rgba(0,0,0,.09);
    border-color: rgba(0,0,0,.09);
  }
</style>