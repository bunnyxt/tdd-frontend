export default {
  calcLayoutPadding: function (clientWidth) {
    if (clientWidth < 576) {
      return '0 8px';
    } else if (clientWidth < 768) {
      return '0 20px';
    } else if (clientWidth < 1600){
      return '0 50px';
    } else {
      return '0 ' + (clientWidth - 1500) / 2 + 'px';
    }
  }
}