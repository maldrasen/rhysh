global.Flag = (function() {

  var $flags = {};
  var $flagDefaults = {};
  var $flagValidations = {};

  function clear() {
    $flags = {}
  }

  // Need to test against undefined because a flag can be set to null. One of
  // the few times there's a difference between the two.
  function get(code) {
    return ($flags[code] === undefined) ? $flagDefaults[code] : $flags[code];
  }

  function getAll() {
    return {...$flags};
  }

  function set(code, value) {
    if ($flagValidations[code]) { validate($flagValidations[code], code, value); }
    $flags[code] = value;
  }

  function setAll(flags) {
    ObjectHelper.each(flags, Flag.set);
  }

  function validate(validation, code, value) {
    if (validation.validateIn && info.validateIn.indexOf(value) < 0) {
      throw `Flag validation failed setting ${code} to ${value}. Value not in ${validation.validateIn}`;
    }
    if (validation.validateInteger && Number.isInteger(value) == false) {
      throw `Flag validation failed setting ${code} to ${value}. Value not an integer.`;
    }
  }

  // === Persistance ===========================================================

  function save() {
    if (GameState.getWorldPath()) {
      Kompressor.write(getFilepath(), $flags);
    }
  }

  async function load() {
    return new Promise(resolve => {
      Kompressor.read(getFilepath()).then(data => {
        $flags = data;
        resolve();
      });
    });
  }

  function getFilepath() {
    return `${GameState.getWorldPath()}/Flags.cum`;
  }

  return {
    clear,
    get,
    getAll,
    set,
    setAll,
    load,
    save,
  }

})();
