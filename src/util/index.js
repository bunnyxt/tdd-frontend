export default {
  calcLayoutPadding: function (clientWidth) {
    if (clientWidth < 576) {
      return '0 8px';
    } else if (clientWidth < 768) {
      return '0 20px';
    } else if (clientWidth < 1600) {
      return '0 50px';
    } else {
      return '0 ' + (clientWidth - 1500) / 2 + 'px';
    }
  },
  addPreZero: function (str, digit) {
    let diff = digit - str.length;
    if (diff > 0) {
      let preZeroStr = '';
      for (let i = 0; i < diff; i++) {
        preZeroStr += '0';
      }
      return preZeroStr + str;
    } else {
      return str;
    }
  },
  tsToDateString: function (ts, pattern='yyyy-MM-dd HH:mm:ss') {
    let date = new Date(ts * 1000);
    return pattern
      .replace('yyyy', date.getFullYear().toString())
      .replace('MM', this.addPreZero((date.getMonth()+1).toString(), 2))
      .replace('dd', this.addPreZero(date.getDate().toString(), 2))
      .replace('HH', this.addPreZero(date.getHours().toString(), 2))
      .replace('mm', this.addPreZero(date.getMinutes().toString(), 2))
      .replace('ss', this.addPreZero(date.getSeconds().toString(), 2));
  },
  dateStringToTs: function (dateString, pattern='yyyy-MM-dd HH:mm:ss') {
    let date = new Date(0);
    let pos_yyyy = pattern.indexOf('yyyy');
    pos_yyyy > -1 ? date.setFullYear(parseInt(pattern.substring(pos_yyyy, pos_yyyy + 4))) : undefined;
    let pos_MM = pattern.indexOf('MM');
    pos_MM > -1 ? date.setMonth(parseInt(pattern.substring(pos_MM, pos_MM + 2)) - 1) : undefined;
    let pos_dd = pattern.indexOf('dd');
    pos_dd > -1 ? date.setDate(parseInt(pattern.substring(pos_dd, pos_dd + 2)) - 1) : undefined;
    let pos_HH = pattern.indexOf('HH');
    pos_HH > -1 ? date.setHours(parseInt(pattern.substring(pos_HH, pos_HH + 2))) : undefined;
    let pos_mm = pattern.indexOf('mm');
    pos_mm > -1 ? date.setMinutes(parseInt(pattern.substring(pos_mm, pos_mm + 2))) : undefined;
    let pos_ss = pattern.indexOf('ss');
    pos_ss > -1 ? date.setSeconds(parseInt(pattern.substring(pos_ss, pos_ss + 2))) : undefined;
    return Math.floor(date.valueOf() / 1000);
  }
}