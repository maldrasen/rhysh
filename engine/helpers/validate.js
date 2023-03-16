global.Validate = (function() {

  function between(name, value, min, max, message=null) {
    if (value < min) { throw message ? message : `Validation Failed: ${name}.${value} less than ${min}`; }
    if (value > max) { throw message ? message : `Validation Failed: ${name}.${value} greater than ${max}`; }
  }

  function isIn(name, value, list, message=null) {
    if (list.indexOf(value) == -1) { throw message ? message : `Validation Failed: ${name}.${value} not in list.`; }
  }

  function exists(name, value, message=null) {
    if (value == null) { throw message ? message : `Validation Failed: ${name} is null.` }
  }

  return { between, isIn, exists };

})()