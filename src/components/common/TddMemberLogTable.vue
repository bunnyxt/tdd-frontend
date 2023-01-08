<i18n src="@/i18n/common.json"></i18n>

<template>
  <a-table
    :columns="columns"
    :row-key="memberLog => memberLog.id"
    :data-source="memberLogs"
    :pagination="pagination"
    :scroll="{ x: 700 }"
    size="small"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'added'">
        {{ $util.tsToDateString(record.added) }}
      </template>
      <template v-else-if="column.key === 'attr'">
        {{ attrDict[record.attr] }}
      </template>
      <template v-else-if="column.key === 'oldval'">
        <template v-if="record.attr === 'face'">
          <a-avatar
            :src="$util.httpS(record.oldval)"
            :size="48"
          />
        </template>
        <template v-else-if="record.attr === 'sex'">
          {{ record.oldval }}
          <template v-if="record.oldval === '男'">
            <span style="color: #00b5f6">
              <icon-font type="icon-xingbie-nan" />
            </span>
          </template>
          <template v-else-if="record.oldval === '女'">
            <span style="color: #f9a9f8">
              <icon-font type="icon-xingbie-nv" />
            </span>
          </template>
          <template v-else-if="record.oldval === '保密'">
            <span style="color: rgba(183,183,183,0.95)">
              <icon-font type="icon-xingbie-weizhi" />
            </span>
          </template>
        </template>
        <template v-else>
          {{ record.oldval }}
        </template>
      </template>
      <template v-else-if="column.key === 'newval'">
        <template v-if="record.attr === 'face'">
          <a-avatar
            :src="$util.httpS(record.newval)"
            :size="48"
          />
        </template>
        <template v-else-if="record.attr === 'sex'">
          {{ record.newval }}
          <template v-if="record.newval === '男'">
            <span style="color: #00b5f6">
              <icon-font type="icon-xingbie-nan" />
            </span>
          </template>
          <template v-else-if="record.newval === '女'">
            <span style="color: #f9a9f8">
              <icon-font type="icon-xingbie-nv" />
            </span>
          </template>
          <template v-else-if="record.newval === '保密'">
            <span style="color: rgba(183,183,183,0.95)">
              <icon-font type="icon-xingbie-weizhi" />
            </span>
          </template>
        </template>
        <template v-else>
          {{ record.newval }}
        </template>
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
  components: {
    IconFont
  },
  props: {
    memberLogs: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      columns: [
        {
          title: this.$t('time'),
          width: '15%',
          key: 'added',
          sorter: (a, b) => a.added - b.added,
        }, {
          title: this.$t('category'),
          width: '11%',
          key: 'attr',
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
          key: 'oldval',
          width: '37%',
        }, {
          title: this.$t('newval'),
          key: 'newval',
          width: '37%',
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
