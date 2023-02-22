global.Validate = (function() {

  function between(value, min, max) {
    if (value < min) { throw `Validation Failed: ${value} less than ${min}`; }
    if (value > max) { throw `Validation Failed: ${value} greater than ${max}`; }
  }

  function isIn(value, list) {
    if (list.indexOf(value) == -1) { throw `Validation Failed: ${value} not in list.`; }
  }

  return { between, isIn };

})()