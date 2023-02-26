global.Inventory = (function() {

  let $currentInventory = {};
  let $currentIndex = 0;

  function clear() {
    $currentInventory = {}
    $currentIndex = 0;
  }

  function all() {
    return { ...$currentInventory };
  }

  function lookup(id) {
    Validate.exists($currentInventory[id],`No item with id(${id}) in inventory.`);
    return $currentInventory[id];
  }

  // When adding an item, we assign and return that item's id.
  function add(item) {
    if (item.getID() != null) { throw 'Item already in inventory' }

    item.setID(++$currentIndex);
    $currentInventory[item.getID()] = item;

    return item.getID();
  }

  function getEquippedBy(character) {
    let code = character.getCode();
    let equipment = {};

    ObjectHelper.each($currentInventory, (id, item) => {
      let equippedBy = item.getEquippedBy();
      if (equippedBy && equippedBy.code == code) {
        equipment[equippedBy.slot] = item;
      }
    });

    return equipment;
  }

  // === Persistance ===========================================================

  function pack() {}

  function unpack() {}

  function save() {}

  function load() {}

  return {
    clear,
    all,
    lookup,
    add,
    getEquippedBy,
  };

})()