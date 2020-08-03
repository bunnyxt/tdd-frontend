<template>
  <div style="margin-bottom: 8px">
    <a-row>
      <a-col :span="7" style="padding-right: 16px">
        <a-input
            v-model="tsVal"
            placeholder="1359631780"
            @change="tsValChangeHandler"
        ></a-input>
      </a-col>
      <a-col :span="10" style="padding-right: 16px">
        <a-input
            v-model="tsStr"
            placeholder="2013-01-31 19:29:40"
            @change="tsStrChangeHandler"
        ></a-input>
      </a-col>
      <a-col :span="5">
        <a-button title="复制" :disabled="!canAddNew" @click="duplicateItemHandler" style="margin-right: 8px">
          <a-icon type="plus" />
        </a-button>
        <a-button title="删除" @click="deleteItemHandler">
          <a-icon type="delete" />
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'TsConvertItem',
  props: {
    id: {
      type: Number,
      required: true
    },
    ts: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      tsVal: '1359631780',
      tsStr: '2013-01-31 19:29:40'
    }
  },
  computed: {
    canAddNew: function () {
      if (this.tsVal.length === 0 || this.tsStr.length === 0) {
        return false;
      }
      if (isNaN(this.tsVal) || this.tsStr === 'NaN-NaN-NaN NaN:NaN:NaN') {
        return false;
      }
      if (this.$util.tsToDateString(this.tsVal) !== this.tsStr) {
        return false;
      }
      return true;
    }
  },
  methods: {
    tsValChangeHandler: function () {
      this.tsStr = this.tsVal.length === 0 ? '' : this.$util.tsToDateString(this.tsVal);
      this.$emit('update-ts', this.id, parseInt(this.tsVal));
    },
    tsStrChangeHandler: function () {
      this.tsVal = this.tsStr.length === 0 ? '' : this.$util.dateStringToTs(this.tsStr);
      this.$emit('update-ts', this.id, parseInt(this.tsVal));
    },
    duplicateItemHandler: function () {
      this.$emit('duplicate-item', this.id);
    },
    deleteItemHandler: function () {
      this.$emit('delete-item', this.id);
    }
  },
  mounted() {
    this.tsVal = this.ts;
    this.tsStr = this.$util.tsToDateString(this.tsVal);
  }
}
</script>

<style scoped>

</style>
