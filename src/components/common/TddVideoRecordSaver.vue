<template>
  <div class="tdd-video-record-saver">
    <template v-if="!isValid">
      <a-alert type="error" message="视频记录数据加载错误，请检查参数" banner />
    </template>
    <template v-else>
      <div style="margin-bottom: 12px">
        <h3>输出字段</h3>
        <a-checkbox-group
            :options="fields"
            v-model="enabledFields"
        ></a-checkbox-group>
      </div>
      <div style="margin-bottom: 12px">
          <h3>输出预览</h3>
          <a-table
              :columns="columns"
              :rowKey="record => record.added"
              :dataSource="videoRecordsFiltered.slice(0, 5)"
              :pagination="false"
              :scroll="{ x: 700 }"
              size="small"
          >
          </a-table>
      </div>
      <div style="margin-bottom: 12px">
        <h3>输出格式</h3>
        <a-radio-group name="outputFormatRadioGroup" :defaultValue="'csv'" v-model="outputFormat">
          <a-radio :value="'csv'">csv</a-radio>
          <a-radio :value="'xls'" disabled>xls</a-radio>
          <a-radio :value="'xlsx'" disabled>xlsx</a-radio>
          <a-radio :value="'json'">json</a-radio>
        </a-radio-group>
      </div>
      <div style="overflow: hidden">
        <div style="float: right; text-align: right">
          共 {{ videoRecords.length }} 条数据<br>
          <a-button type="primary" @click="onSaverClick" style="margin: 8px 0">确认下载</a-button><br>
          <small>*直接从本地浏览器的缓存中加载数据<br>不会造成额外的网络流量，请放心下载</small>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  // import XLSX from 'xlsx'

  export default {
    name: 'TddVideoRecordSaver',
    props: {
      videoRecords: {
        type: Array,
        required: true
      }
    },
    data: function () {
      return {
        fields: ['id', 'aid', '时间(时间戳)', '时间(格式化)', '播放', '弹幕', '评论', '收藏', '硬币', '分享', '点赞'],
        fieldsName: null,
        enabledFields: ['时间(时间戳)', '时间(格式化)', '播放', '弹幕', '评论', '收藏', '硬币', '分享', '点赞'],
        outputFormat: 'csv'
      }
    },
    computed: {
      isValid: function () {
        return this.videoRecords !== null && typeof(this.videoRecords) === typeof([]);
      },
      columns: function () {
        let cols = [];
        for (let i = 0; i < this.fields.length; i++) {
          let field = this.fields[i];
          if (this.enabledFields.indexOf(field) !== -1) {
            cols.push({
              title: this.fieldNames.get(field),
              dataIndex: this.fieldNames.get(field),
            });
          }
        }
        return cols;
      },
      videoRecordsFiltered: function () {
        let list = [];
        for (let i = 0; i < this.videoRecords.length; i++) {
          let new_record = {};
          let ori_record = this.videoRecords[i];
          for (let j = 0; j < this.fields.length; j++) {
            let field = this.fields[j];
            if (this.enabledFields.indexOf(field) !== -1) {
              let fieldName = this.fieldNames.get(field);
              if (fieldName === 'added_s') {
                new_record['added_s'] = this.$util.tsToDateString(ori_record['added']);
              } else {
                new_record[fieldName] = ori_record[fieldName];
              }
            }
          }
          list.push(new_record);
        }
        return list;
      },
      enabledFieldsName: function () {
        let list = [];
        for (let i = 0; i < this.fields.length; i++) {
          let field = this.fields[i];
          if (this.enabledFields.indexOf(field) !== -1) {
            let fieldName = this.fieldNames.get(field);
            list.push(fieldName);
          }
        }
        return list;
      }
    },
    methods: {
      startDownloadBlob: function (blob, filename) {
        let _a = document.createElement('a');
        _a.download = filename;
        _a.href = window.URL.createObjectURL(blob);
        let _e;
        if (window.MouseEvent) {
          _e = new MouseEvent('click');
        } else {
          _e = document.createEvent('MouseEvents');
          _e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        _a.dispatchEvent(_e);
      },
      listToCsvString: function (list, headers) {
        let str = '';
        for (let i = 0; i < headers.length; i++) {
          str += headers[i];
          if (i !== headers.length - 1) {
            str += ','
          }
        }
        str += '\n';
        for (let i = 0; i < list.length; i++) {
          let obj = list[i];
          for (let j = 0; j < headers.length; j++) {
            if (headers[j] in obj) {
              let val = obj[headers[j]];
              if (typeof(val) === typeof('')) {
                str += '"' + val +'"';
              } else if (typeof(val) === typeof(0)) {
                str += val;
              } else {
                str += ' ';
              }
              if (j !== headers.length - 1) {
                str += ','
              }
            }
          }
          str += '\n';
        }
        return str;
      },
      onSaverClick: function () {
        // let ws = XLSX.utils.json_to_sheet(this.videoRecordsFiltered, { header: this.enabledFieldsName });
        // this.openDownloadDialog(this.sheet2blob(ws), '导出.xlsx');

        let filename = 'tdd_output_' + this.$util.tsToDateString(Math.floor(new Date().valueOf()/1000), 'yyyyMMddHHmmss');
        if (this.outputFormat === 'csv') {
          let blob = new Blob([this.listToCsvString(this.videoRecordsFiltered, this.enabledFieldsName)], { type: 'application/csv' });
          this.startDownloadBlob(blob, filename + '.csv');
        } else if (this.outputFormat === 'xls') {
          alert('WIP: xls will be supported in the future!');
        } else if (this.outputFormat === 'xlsx') {
          alert('WIP: xlsx will be supported in the future!');
        } else if (this.outputFormat === 'json') {
          let blob = new Blob([JSON.stringify(this.videoRecordsFiltered, undefined, 2)], { type: 'application/json' });
          this.startDownloadBlob(blob, filename + '.json');
        }

        this.$message.success('已开始下载！请留意浏览器的下载文件');
        // check android
        const ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('linux') > -1) {
          if (ua.indexOf('android') > -1) {
            setTimeout(() => this.$message.error('抱歉！由于技术原因，安卓平台浏览器可能无法下载，请换PC端重试'), 500);
          }
        }
      },
      // openDownloadDialog: function (url, saveName) {
      //   if (typeof url == 'object' && url instanceof Blob) {
      //     url = URL.createObjectURL(url); // 创建blob地址
      //   }
      //   let aLink = document.createElement('a');
      //   aLink.href = url;
      //   aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      //   let event;
      //   if (window.MouseEvent) {
      //     event = new MouseEvent('click');
      //   } else {
      //     event = document.createEvent('MouseEvents');
      //     event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      //   }
      //   aLink.dispatchEvent(event);
      // },
      // sheet2blob: function (sheet, sheetName) {
      //   sheetName = sheetName || 'sheet1';
      //   let workbook = {
      //     SheetNames: [sheetName],
      //     Sheets: {}
      //   };
      //   workbook.Sheets[sheetName] = sheet;
      //   // 生成excel的配置项
      //   let wopts = {
      //     bookType: 'xlsx', // 要生成的文件类型
      //     bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
      //     type: 'binary'
      //   };
      //   let wbout = XLSX.write(workbook, wopts);
      //   let blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
      //   // 字符串转ArrayBuffer
      //   function s2ab(s) {
      //     let buf = new ArrayBuffer(s.length);
      //     let view = new Uint8Array(buf);
      //     for (let i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      //     return buf;
      //   }
      //   return blob;
      // }
    },
    created() {
      this.fieldNames = new Map()
        .set('id', 'id')
        .set('aid', 'aid')
        .set('时间(时间戳)', 'added')
        .set('时间(格式化)', 'added_s')
        .set('播放', 'view')
        .set('弹幕', 'danmaku')
        .set('评论', 'reply')
        .set('收藏', 'favorite')
        .set('硬币', 'coin')
        .set('分享', 'share')
        .set('点赞', 'like');
    }
  }
</script>

<style scoped>

</style>