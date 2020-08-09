<template>
  <a-table
    :columns="columns"
    :rowKey="memberLog => memberLog.id"
    :dataSource="memberLogs"
    :pagination="pagination"
    :scroll="{ x: 700 }"
    size="small"
  >
    <template slot="added" slot-scope="added">
      {{ $util.tsToDateString(added) }}
    </template>
    <template slot="attr" slot-scope="attr">
      {{ attrDict[attr] }}
    </template>
    <template slot="oldval" slot-scope="item">
      <template v-if="item.attr === 'face'">
        <a-avatar
          :src="item.oldval"
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
    <template slot="newval" slot-scope="item">
      <template v-if="item.attr === 'face'">
        <a-avatar
          :src="item.newval"
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
import { Icon } from 'ant-design-vue';

const IconFont = Icon.createFromIconfontCN({
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
          title: '时间',
          width: '15%',
          dataIndex: 'added',
          scopedSlots: { customRender: 'added' },
          sorter: (a, b) => a.added - b.added,
        }, {
          title: '类别',
          width: '11%',
          dataIndex: 'attr',
          scopedSlots: { customRender: 'attr' },
          filters: [
            {
              text: '昵称',
              value: 'name',
            }, {
              text: '性别',
              value: 'sex',
            }, {
              text: '头像',
              value: 'face',
            }, {
              text: '签名',
              value: 'sign',
            }
          ],
          onFilter: (value, record) => record.attr === value,
        }, {
          title: '旧值',
          width: '37%',
          scopedSlots: { customRender: 'oldval' },
        }, {
          title: '新值',
          width: '37%',
          scopedSlots: { customRender: 'newval' },
        }
      ],
      pagination: {
        size: 'middle',
        pageSize: 5
      },
      attrDict: {
        'name': '昵称',
        'sex': '性别',
        'face': '头像',
        'sign': '签名',
      }
    }
  }
}
</script>

<style scoped>

</style>
