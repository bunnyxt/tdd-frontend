// this is a simple implement of DataView in @antv/data-set
// not as effective as antv implement
// TODO need optimization
class DataView {
  // init, load rows, should be a list
  constructor(rows = []) {
    this.rows = rows;
  }
  
  // load rows, should be a list
  source(rows) {
    this.rows = rows;
    return this;
  }
  
  // transform
  // ref: https://g2.antv.vision/zh/docs/manual/dataset/transform
  transform({type, ...options}) {
    switch (type) {
      case 'rename':
        return this._transform_rename(options['map']);
      case 'fold':
        return this._transform_fold(options['fields'], options['key'], options['value']);
      case 'map':
        return this._transform_map(options['callback']);
      default:
        return this;
    }
  }
  
  _transform_rename(map) {
    const transformedRows = [];
    this.rows.forEach(row => {
      const transformedRow = {};
      for (let [key, val] of Object.entries(row)) {
        key = map[key] ? map[key] : key;
        transformedRow[key] = val;
      }
      transformedRows.push(transformedRow);
    });
    return new DataView(transformedRows);
  }
  
  _transform_fold(fields, key, value) {
    const transformedRows = [];
    this.rows.forEach(row => {
      const leftFields = Object.keys(row).filter(rowKey => !fields.includes(rowKey));
      for (let field of fields) {
        if (Object.prototype.hasOwnProperty.call(row, field)) {
          const transformedRow = {};
          for (let leftField of leftFields) {
            transformedRow[leftField] = row[leftField];
          }
          transformedRow[key] = field;
          transformedRow[value] = row[field];
          transformedRows.push(transformedRow);
        }
      }
    });
    return new DataView(transformedRows);
  }
  
  _transform_map(callback) {
    const transformedRows = [];
    this.rows.forEach(row => transformedRows.push(callback(row)));
    return new DataView(transformedRows);
  }
}

export {
  DataView
};
