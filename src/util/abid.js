const bigInt = require("big-integer");

// ref: https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/bvid_desc.md#javascripttypescript
const XOR_CODE = bigInt("23442827791579");
const MASK_CODE = bigInt("2251799813685247");
const MAX_AID = bigInt.one.shiftLeft(51);
const BASE = bigInt(58);

const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';


export const b2a = function (bvid) {
  // add BV prefix
  if (!bvid.startsWith('BV')) {
    bvid = 'BV' + bvid;
  }
  // bvid should be 12 size length
  if (bvid.length !== 12) {
    return -1;
  }
  const bvidArr = Array.from(bvid);
  [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
  [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
  bvidArr.splice(0, 3);
  const tmp = bvidArr.reduce((pre, bvidChar) => pre.multiply(BASE).add(bigInt(data.indexOf(bvidChar))), bigInt.zero);
  return Number((tmp.and(MASK_CODE)).xor(XOR_CODE).toJSNumber());
}

export const a2b = function (aid) {
  // aid should be an integer, or can be transferred to integer
  let x = parseInt(aid);
  const bytes = ['B', 'V', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
  let bvIndex = bytes.length - 1;
  let tmp = (MAX_AID.or(bigInt(x))).xor(XOR_CODE);
  while (tmp.greater(bigInt.zero)) {
    bytes[bvIndex] = data[Number(tmp.mod(BASE).toJSNumber())];
    tmp = tmp.divide(BASE);
    bvIndex -= 1;
  }
  [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
  [bytes[4], bytes[7]] = [bytes[7], bytes[4]];
  return bytes.join('').substring(2);  // remove BV prefix
}
