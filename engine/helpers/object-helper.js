global.ObjectHelper = {

  // I can never remember how to iterate over objects.
  each: function(object, callback) {
    for (let [key, value] of Object.entries(object)) {
      callback(key, value);
    }
  },

  // Get the key in the map where the value can be found.
  reverseLookup: function(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

};

