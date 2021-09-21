<i18n src="@/i18n/common.json"></i18n>
<i18n src="@/i18n/tool.json"></i18n>

<template>
  <div>
    <div v-wechat-title="`${$t('tool_info.ts.name')} - ${$t('page_title._tdd')}`"></div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">{{ $t('page_name.home') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/tool">{{ $t('page_name.tool') }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>{{ $t('tool_info.ts.name') }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>{{ $t('tool_info.ts.name') }}</h1>
      <div style="max-width: 800px; min-width: 520px">
        <div style="font-weight: bold; margin-bottom: 8px">
          <a-row>
            <a-col :span="7">时间戳（秒）</a-col>
            <a-col :span="10">时间字符串</a-col>
            <a-col :span="5">操作</a-col>
          </a-row>
        </div>
        <div style="margin-bottom: 8px">
          <a-row>
            <a-col :span="7" style="padding-right: 16px">
              <a-input
                v-model="currentTs"
                placeholder="1359631780"
              >
                <a-icon
                  slot="suffix"
                  type="copy"
                  title="复制"
                  @click="copyCurrentTsVal"
                  style="cursor: pointer"
                />
              </a-input>
            </a-col>
            <a-col :span="10" style="padding-right: 16px">
              <a-input
                v-model="currentTsStr"
                placeholder="2013-01-31 19:29:40"
              >
                <a-icon
                  slot="suffix"
                  type="copy"
                  title="复制"
                  @click="copyCurrentTsStr"
                  style="cursor: pointer"
                />
              </a-input>
            </a-col>
            <a-col :span="5">
              <a-button title="复制" @click="duplicateCurrentItemHandler" style="margin-right: 8px">
                <a-icon type="plus" />
              </a-button>
              <a-button title="不可以删除当前时间" disabled>
                <a-icon type="delete" />
              </a-button>
            </a-col>
          </a-row>
        </div>
        <ts-convert-item
          v-for="item in convertList"
          :key="item.id"
          :id="item.id"
          :ts="item.ts"
          @update-ts="updateTsHandler"
          @duplicate-item="duplicateItemHandler"
          @delete-item="deleteItemHandler"
        ></ts-convert-item>
        <div style="margin-bottom: 8px">
          <a-row>
            <a-col :span="7" style="padding-right: 16px">
              <a-input
                v-model="newTsVal"
                placeholder="1359631780"
                @change="newTsValChangeHandler"
              ></a-input>
            </a-col>
            <a-col :span="10" style="padding-right: 16px">
              <a-input
                v-model="newTsStr"
                placeholder="2013-01-31 19:29:40"
                @change="newTsStrChangeHandler"
              ></a-input>
            </a-col>
            <a-col :span="5">
              <a-button
                :title="canAddNew ? '添加' : '格式错误，无法添加'"
                @click="addNewTsHandler"
                :disabled="!canAddNew"
                style="margin-right: 8px"
              >
                <a-icon type="plus" />
              </a-button>
              <a-button title="清空" @click="clearNewTsInput">
                <a-icon type="reload" />
              </a-button>
            </a-col>
          </a-row>
        </div>
        <div>
          <a-popconfirm
            title="确认清除所有记录的时间戳？"
            placement="topLeft"
            ok-text="确认"
            cancel-text="取消"
            @confirm="reset"
            style="margin-right: 16px"
          >
            <a-button>
              清除所有
            </a-button>
          </a-popconfirm>
          <a-button @click="exportOpenHandler">
            导出数据
          </a-button>
          <a-modal
            title="时间戳数据"
            :visible="showExport"
            okText="复制到剪贴板"
            cancelText="关闭"
            @cancel="exportCloseHandler"
          >
            <div slot="footer">
              <a-button type="primary" @click="exportHandler" >复制到剪贴板</a-button>
            </div>
            <a-textarea v-model="exportData" :rows="10" />
          </a-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TsConvertItem from "./TsConvertItem";

export default {
  name: 'TsConvert.vue',
  components: {
    TsConvertItem
  },
  data: function () {
    return {
      storeTimer: null,
      currentTimer: null,
      currentTs: 0,
      nextId: 0,
      newTsVal: '',
      newTsStr: '',
      convertList: [],
      showExport: false,
      exportData: ''
    }
  },
  methods: {
    refreshCurrentTime: function () {
      this.currentTs = Math.floor(new Date().valueOf() / 1000);
    },
    updateTsHandler: function (id, ts) {
      const item = this.convertList.find(i => i.id === id);
      if (item) {
        item.ts = ts;
      }
    },
    duplicateCurrentItemHandler: function () {
      this.convertList.push({
        id: this.nextId++,
        ts: this.currentTs
      });
    },
    duplicateItemHandler: function (id) {
      const oldItem = this.convertList.find(i => i.id === id);
      this.convertList.push({
        id: this.nextId++,
        ts: oldItem.ts
      });
    },
    deleteItemHandler: function (id) {
      this.convertList = this.convertList.filter(i => i.id !== id);
    },
    newTsValChangeHandler: function () {
      this.newTsStr = this.newTsVal.length === 0 ? '' : this.$util.tsToDateString(this.newTsVal);
    },
    newTsStrChangeHandler: function () {
      this.newTsVal = this.newTsStr.length === 0 ? '' : this.$util.dateStringToTs(this.newTsStr);
    },
    addNewTsHandler: function () {
      this.convertList.push({
        id: this.nextId++,
        ts: parseInt(this.newTsVal)
      });
      this.clearNewTsInput();
    },
    clearNewTsInput: function () {
      this.newTsVal = '';
      this.newTsStr = '';
    },
    reset: function () {
      // clear list
      this.convertList = [];
      this.nextId = 0;

      // unset local storage
      localStorage.removeItem('tsConvertList');
      localStorage.removeItem('tsNextId');

      // clear new ts
      this.clearNewTsInput();
    },
    exportOpenHandler: function () {
      this.exportData = `${this.currentTs},${this.$util.tsToDateString(this.currentTs)}\n`;
      this.convertList.forEach(value => {
        this.exportData += `${value.ts},${this.$util.tsToDateString(value.ts)}\n`
      })
      this.showExport = true;
    },
    exportHandler: function () {
      this.$util.copyToClipboard(this.exportData, this);
    },
    exportCloseHandler: function () {
      this.showExport = false;
    },
    copyCurrentTsVal: function () {
      this.$util.copyToClipboard(this.currentTs, this);
    },
    copyCurrentTsStr: function () {
      this.$util.copyToClipboard(this.$util.tsToDateString(this.currentTs), this);
    }
  },
  computed: {
    currentTsStr: function () {
      return this.$util.tsToDateString(this.currentTs);
    },
    canAddNew: function () {
      if (this.newTsVal.length === 0 || this.newTsStr.length === 0) {
        // no new str or val input
        return false;
      }
      if (isNaN(this.newTsVal) || this.newTsStr === 'NaN-NaN-NaN NaN:NaN:NaN') {
        // invalid format of new str or val
        return false;
      }
      if (this.$util.tsToDateString(this.newTsVal) !== this.newTsStr) {
        // new val and new str are not same
        return false
      }
      return true;
    }
  },
  mounted: function () {
    this.refreshCurrentTime();
    this.currentTimer = setInterval(this.refreshCurrentTime, 1000);
    this.storeTimer = setInterval(() => {
      localStorage.setItem('tsConvertList', JSON.stringify(this.convertList));
      localStorage.setItem('tsNextId', this.nextId);
    }, 30000);

    // restore previous list
    const storedConvertList = localStorage.getItem('tsConvertList');
    const storedNextId = localStorage.getItem('tsNextId');
    this.convertList = storedConvertList ? JSON.parse(storedConvertList) : [];
    this.nextId = storedNextId ? storedNextId : 0;
  },
  beforeDestroy() {
    window.clearInterval(this.currentTimer);
    window.clearInterval(this.storeTimer);

    // store current list
    localStorage.setItem('tsConvertList', JSON.stringify(this.convertList));
    localStorage.setItem('tsNextId', this.nextId);
  }
}
</script>

<style scoped>

</style>
