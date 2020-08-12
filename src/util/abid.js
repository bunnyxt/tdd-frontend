// ref: https://www.zhihu.com/question/381784377
const table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
let tr = {};
for (let i = 0; i < 58; i++) {
  tr[table[i]] = i;
}
const s = [11, 10, 3, 8, 4, 6];
const xor = 177451812;
const add = 8728348608;

export const b2a = function (bvid) {
  // remove BV prefix
  if (bvid.substring(0, 2) === 'BV') {
    bvid = bvid.substring(2);
  }
  // bvid should be 10 size length
  if (bvid.length !== 10) {
    return -1;
  }
  let r = 0;
  let x = [];
  for (let i = 0; i < 10; i++) {
    x.push(bvid.charAt(i));
  }
  // only support 1??4?1?7?? format
  if (!(x[0] === '1' && x[3] === '4' && x[5] === '1' && x[7] === '7')) {
    return -1;
  }
  // character should in table
  for (let i = 0; i < 10; i++) {
    if (table.indexOf(x[i]) === -1) {
      // invalid character
      return -1;
    }
  }
  for (let i = 0; i < 6; i++) {
    r += tr[x[s[i]-2]] * Math.pow(58, i);
  }
  return (r - add) ^ xor;
}

export const a2b = function (aid) {
  // aid should be an integer, or can be transferred to integer
  let x = parseInt(aid);
  x = (x ^ xor) + add;
  let r = ['B', 'V', '1', ' ', ' ', '4', ' ', '1', ' ', '7', ' ', ' '];
  for (let i = 0; i < 6; i++) {
    r[s[i]] = table.charAt(Math.floor(x / Math.pow(58, i)) % 58);
  }
  let bvid = '';
  for (let i = 0; i < r.length; i++) {
    bvid += r[i];
  }
  return bvid.substring(2);  // remove BV prefix
}
