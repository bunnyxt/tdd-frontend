<i18n src="@/i18n/common.json"></i18n>

<template>
  <a-table
    :columns="columns"
    :rowKey="memberLog => memberLog.id"
    :dataSource="memberLogs"
    :pagination="pagination"
    :scroll="{ x: 700 }"
    size="small"
  >
    <template #added="added">
      {{ $util.tsToDateString(added) }}
    </template>
    <template #attr="attr">
      {{ attrDict[attr] }}
    </template>
    <template #oldval="item">
      <template v-if="item.attr === 'face'">
        <a-avatar
          :src="$util.httpS(item.oldval)"
          :size="48"
        />
      </template>
      <template v-else-if="item.attr === 'sex'">
        {{ item.oldval }}
        <template v-if="item.oldval === '男'">
          <span style="color: #00b5f6">
            <icon-font type="icon-xingbie-nan" />
          </span>
        </template>
        <template v-else-if="item.oldval === '女'">
          <span style="color: #f9a9f8">
            <icon-font type="icon-xingbie-nv" />
          </span>
        </template>
        <template v-else-if="item.oldval === '保密'">
          <span style="color: rgba(183,183,183,0.95)">
            <icon-font type="icon-xingbie-weizhi" />
          </span>
        </template>
      </template>
      <template v-else>
        {{ item.oldval }}
      </template>
    </template>
    <template #newval="item">
      <template v-if="item.attr === 'face'">
        <a-avatar
          :src="$util.httpS(item.newval)"
          :size="48"
        />
      </template>
      <template v-else-if="item.attr === 'sex'">
        {{ item.newval }}
        <template v-if="item.newval === '男'">
          <span style="color: #00b5f6">
            <icon-font type="icon-xingbie-nan" />
          </span>
        </template>
        <template v-else-if="item.newval === '女'">
          <span style="color: #f9a9f8">
            <icon-font type="icon-xingbie-nv" />
          </span>
        </template>
        <template v-else-if="item.newval === '保密'">
          <span style="color: rgba(183,183,183,0.95)">
            <icon-font type="icon-xingbie-weizhi" />
          </span>
        </template>
      </template>
      <template v-else>
        {{ item.newval }}
      </template>
    </template>
  </a-table>
</template>

<script>
import { createFromIconfontCN } from '@ant-design/icons-vue';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1640736_mzfdr5d9c2h.js',
});

export default {
  name: 'TddMemberLogTable',
  props: {
    memberLogs: {
      type: Array,
      required: true
    }
  },
  components: {
    IconFont
  },
  data: function () {
    return {
      columns: [
        {
          title: this.$t('time'),
          width: '15%',
          dataIndex: 'added',
          scopedSlots: { customRender: 'added' },
          sorter: (a, b) => a.added - b.added,
        }, {
          title: this.$t('category'),
          width: '11%',
          dataIndex: 'attr',
          scopedSlots: { customRender: 'attr' },
          filters: [
            {
              text: this.$t('name'),
              value: 'name',
            }, {
              text: this.$t('gender'),
              value: 'sex',
            }, {
              text: this.$t('face'),
              value: 'face',
            }, {
              text: this.$t('sign'),
              value: 'sign',
            }
          ],
          onFilter: (value, record) => record.attr === value,
        }, {
          title: this.$t('oldval'),
          width: '37%',
          scopedSlots: { customRender: 'oldval' },
        }, {
          title: this.$t('newval'),
          width: '37%',
          scopedSlots: { customRender: 'newval' },
        }
      ],
      pagination: {
        size: 'middle',
        pageSize: 5
      },
      attrDict: {
        'name': this.$t('name'),
        'sex': this.$t('sex'),
        'face': this.$t('face'),
        'sign': this.$t('sign'),
      }
    }
  }
}
</script>

<style scoped>

</style>
