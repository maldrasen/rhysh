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

  function pack() {
    let inventory = {};

    ObjectHelper.each($currentInventory, (id, item) => {
      inventory[id] = item.pack();
    })

    return {
      index: $currentIndex,
      inventory: inventory,
    };
  }

  function unpack(data) {
    ObjectHelper.each(data.inventory, (id, itemData) => {
      if (itemData.classname == 'Armor') { $currentInventory[id] = Armor.unpack(itemData); }
      if (itemData.classname == 'Weapon') { $currentInventory[id] = Weapon.unpack(itemData); }
      if (itemData.classname == 'Accessory') { $currentInventory[id] = Accessory.unpack(itemData); }
    });

    $currentIndex = data.index;
  }

  function save() {
    Kompressor.write(`${GameState.getWorldPath()}/Inventory.cum`,pack());
  }

  async function load() {
    unpack(await Kompressor.read(`${GameState.getWorldPath()}/Inventory.cum`))
  }

  return {
    clear,
    all,
    lookup,
    add,
    getEquippedBy,
    save,
    load,
  };

})()