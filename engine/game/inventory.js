global.Inventory = (function() {

  let $currentInventory = {};

  function all() { return { ...$currentInventory }; }
  function get(id) { return $currentInventory[code]; }
  function clear() { $currentInventory = {} }

  function add(item) {
    // When adding an item, we assign and return that item's id.
  }


  // === Persistance ===========================================================

  function save() {}

  function load() {}

  return {
    all,
    get,
    clear,
    add,
  };

})()