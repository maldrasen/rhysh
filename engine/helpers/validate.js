global.Validate = (function() {

  function isIn(value, list) {
    if (list.indexOf(value) == -1) { throw `Validation Failed: ${value} not in list.`; }
  }

  return { isIn };

})()