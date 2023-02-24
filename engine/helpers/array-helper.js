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
  },

  // Return a new shuffled array.
  //  - https://stackoverflow.com/a/2450976/1293256
  shuffle(orig) {
    let array = orig.slice();
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },

};
