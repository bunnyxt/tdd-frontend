import { a2b, b2a } from './abid'
import { DataView } from './DataView'

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
    pos_yyyy > -1 ? date.setFullYear(parseInt(dateString.substring(pos_yyyy, pos_yyyy + 4))) : undefined;
    let pos_MM = pattern.indexOf('MM');
    pos_MM > -1 ? date.setMonth(parseInt(dateString.substring(pos_MM, pos_MM + 2)) - 1) : undefined;
    let pos_dd = pattern.indexOf('dd');
    pos_dd > -1 ? date.setDate(parseInt(dateString.substring(pos_dd, pos_dd + 2))) : undefined;
    let pos_HH = pattern.indexOf('HH');
    pos_HH > -1 ? date.setHours(parseInt(dateString.substring(pos_HH, pos_HH + 2))) : undefined;
    let pos_mm = pattern.indexOf('mm');
    pos_mm > -1 ? date.setMinutes(parseInt(dateString.substring(pos_mm, pos_mm + 2))) : undefined;
    let pos_ss = pattern.indexOf('ss');
    pos_ss > -1 ? date.setSeconds(parseInt(dateString.substring(pos_ss, pos_ss + 2))) : undefined;
    return Math.floor(date.valueOf() / 1000);
  },
  zkCalc: function (view, reply, danmaku, favorite, page) {
    // init inner value to ensure they are float type
    let _view = parseFloat(parseInt(view).toFixed());
    let _reply = parseFloat(parseInt(reply).toFixed());
    let _danmaku = parseFloat(parseInt(danmaku).toFixed());
    let _favorite = parseFloat(parseInt(favorite).toFixed());
    let _page = parseFloat(parseInt(page).toFixed());

    let view_point_basic = _view / _page;
    let view_point = view_point_basic > 10000 ? view_point_basic * 0.5 + 5000 : view_point_basic;

    let xiua = parseFloat((
      (view_point + _favorite) / (view_point + _favorite + _danmaku * 10 + _reply * 20)
    ).toFixed(2));

    let xiub = parseFloat((_favorite / _view * 250).toFixed(2));
    xiub = xiub > 50 ? 50 : xiub;

    let view_point_final = xiub < 10 ? view_point * xiub * 0.1 : view_point;
    let point = Math.floor(view_point_final + (_reply * 25 + _danmaku) * xiua + _favorite * xiub);

    return { point, xiua, xiub }
  },
  getTagList: function (video) {
    let tagList = [];
    if (!video) {
      return tagList;
    }
    switch (video.isvc) {
      case 1:
      case 2:
        tagList.push({ title: 'VC', color: '#f5aeee' });
        break;
      default:
        break;
    }
    switch (video.activity) {
      case 1:
        tagList.push({ title: '活跃', color: '#f98317' });
        break;
      case 2:
        tagList.push({ title: '热门', color: '#f80b16' });
        break;
      default:
        break;
    }
    switch (video.recent) {
      case 1:
        tagList.push({ title: '本周新作', color: '#210df6' });
        break;
      case 2:
        tagList.push({ title: '本日新作', color: '#2daefb' });
        break;
      default:
        break;
    }
    if (video.laststat) {
      if (video.laststat.view >= 10000000) {
        tagList.push({ title: '神话', color: '#73008d' });
      } else if (video.laststat.view >= 1000000) {
        tagList.push({ title: '传说', color: '#b131f3' });
      } else if (video.laststat.view >= 100000) {
        tagList.push({ title: '殿堂', color: '#6837f8' });
      }
    }
    return tagList;
  },
  checkRoles: function (rolesAcquired, rolesRequired) {
    // no roles required
    if (!rolesRequired || rolesAcquired === []) {
      return true;
    }

    // no roles acquired
    if (!rolesAcquired || rolesAcquired === []) {
      return false;
    }

    if (rolesRequired.includes('ROLE_dba')) {
      if (rolesAcquired.includes('ROLE_dba')) {
        return true;
      }
    }

    if (rolesRequired.includes('ROLE_admin')) {
      if (rolesAcquired.includes('ROLE_dba')) {
        return true;
      }
      if (rolesAcquired.includes('ROLE_admin')) {
        return true;
      }
    }

    if (rolesRequired.includes('ROLE_premium_user')) {
      if (rolesAcquired.includes('ROLE_premium_user')) {
        return true;
      }
    }

    if (rolesRequired.includes('ROLE_user')) {
      if (rolesAcquired.includes('ROLE_dba')) {
        return true;
      }
      if (rolesAcquired.includes('ROLE_admin')) {
        return true;
      }
      if (rolesAcquired.includes('ROLE_premium_user')) {
        return true;
      }
      if (rolesAcquired.includes('ROLE_user')) {
        return true;
      }
    }

    return false;
  },
  tddErrorHandler40102: function (that, redirect) {
    // user not logged in

    // clear local storage
    localStorage.removeItem('tddUserDetail');

    // set status
    that.$store.commit('setUserLoginStatus', false);
    that.$store.commit('setUserDetail', null);

    that.$message.warn('用户登录失效，请重新登录');

    if (redirect) {
      that.$router.push('/');
    }

    that.$store.commit('setLoginSliderVisibility', true);
  },
  copyToClipboard: function (value, that) {
    // TODO sometimes dont work on safari
    if (document.execCommand('copy')) {
      let tmpElement = document.createElement('textarea');
      document.body.appendChild(tmpElement);
      tmpElement.value = value;
      tmpElement.focus();
      tmpElement.select();
      document.execCommand('copy');
      tmpElement.blur();
      document.body.removeChild(tmpElement);
      that && that.$message.success('复制成功');
    } else {
      that && that.$message.warning('您的浏览器不支持复制！请手动复制');
    }
  },
  httpS: function (url) {
    return url.replace(/^http:/, 'https:');
  },
  getVideoCodeMessage: function (code) {
    switch (code) {
      case 62002:
        return '稿件不可见';
      case -404:
        return '啥都木有';
      default:
        return null;
    }
  },
  getVideoAttributeFlags: function (attribute) {
    const flags = [];
    // ref: https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/video/info.md
    const flagMap = {
      0: {
        name: '禁止排行',
        message: '该视频不会出现在B站排行榜中',
      },
      1: {
        name: '禁止动态',
        message: 'APP不会推送该视频的动态',
      },
      4: {
        name: '禁止搜索',
        message: '无法通过搜索功能搜索到该视频',
      },
      6: {
        name: '禁止推荐',
        message: 'APP不会在天马列表推荐该视频',
      },
      12: {
        name: '私单恰饭',
        message: '该视频被标记为内含"私单"、"恰饭"内容',
      },
      21: {
        name: '限制游客',
        message: '该视频可能未登录无法观看，可能无法通过外链滚看',
      },
    };
    for (const digit of Object.keys(flagMap)) {
      if (attribute >> digit & 1 === 1) {
        flags.push(flagMap[digit]);
      }
    }
    return flags;
  },
  deepClone: function (obj = {}) {
    if (typeof obj !== 'object' || obj == null) {
      // obj is not object or is null, no need to deep clone
      return obj;
    }
    
    let result;
    // check array or object
    if (obj instanceof Array) {
      result = [];
    } else {
      result = {};
    }
    
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // ensure key not a property from proto
        result[key] = this.deepClone(obj[key]); // go recursive
      }
    }
    
    return result;
  },
  debounce: function (fun, delay) {
    return function (...args) {
      let that = this;
      clearTimeout(fun.timeoutId);
      fun.timeoutId = setTimeout(function () {
        fun.call(that, ...args)
      }, delay);
    };
  },
  // abid.js
  a2b, b2a,
  // DataView.js
  DataView,
}
