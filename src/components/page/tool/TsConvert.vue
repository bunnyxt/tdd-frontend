<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/tool">辅助工具</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>时间戳转换</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>时间戳转换</h1>
      <div style="max-width: 800px; min-width: 500px">
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
              ></a-input>
            </a-col>
            <a-col :span="10" style="padding-right: 16px">
              <a-input
                  v-model="currentTsStr"
                  placeholder="2013-01-31 19:29:40"
              ></a-input>
            </a-col>
            <a-col :span="5">
              <a-button title="复制" @click="duplicateCurrentItemHandler" style="margin-right: 8px">
                <a-icon type="plus" />
              </a-button>
              <a-button title="删除" disabled>
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
              <a-button title="添加" @click="addNewTsHandler" :disabled="!canAddNew" style="margin-right: 8px">
                <a-icon type="plus" />
              </a-button>
              <a-button title="清空" @click="clearNewTsHandler">
                <a-icon type="reload" />
              </a-button>
            </a-col>
          </a-row>
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
      currentTimer: null,
      currentTs: 0,
      nextId: 0,
      newTsVal: '',
      newTsStr: '',
      convertList: []
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
      this.newTsVal = '';
      this.newTsStr = '';
    },
    clearNewTsHandler: function () {
      this.newTsVal = '';
      this.newTsStr = '';
    }
  },
  computed: {
    currentTsStr: function () {
      return this.$util.tsToDateString(this.currentTs);
    },
    canAddNew: function () {
      if (this.newTsVal.length === 0 || this.newTsStr.length === 0) {
        return false;
      }
      if (isNaN(this.newTsVal) || this.newTsStr === 'NaN-NaN-NaN NaN:NaN:NaN') {
        return false;
      }
      return this.$util.tsToDateString(this.newTsVal) === this.newTsStr;
    }
  },
  mounted: function () {
    this.refreshCurrentTime();
    this.currentTimer = setInterval(this.refreshCurrentTime, 1000);
    this.convertList = [];
  }
}
</script>

<style scoped>

</style>
