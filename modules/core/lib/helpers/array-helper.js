global.ArrayHelper = {

  // I know this will end up being longer, using indexOf just looks ugly I think.
  contains(array, item) {
    return (array||[]).indexOf(item) >= 0;
  },

  remove(array, element) {
    let index = array.indexOf(element);
    (index >= 0) ? array.splice(index, 1) : array;
  },

  unique(array) {
    return [...new Set(array)];
  },

  compact(array) {
    return array.filter(i => { return i != null });
  }

};
