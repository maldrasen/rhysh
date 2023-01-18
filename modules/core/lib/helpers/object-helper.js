global.ObjectHelper = {

  // Get the key in the map where the value can be found.
  reverseLookup: function(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

};

