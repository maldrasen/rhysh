global.CheckEquipment = (function() {

  function isCockExposed(character) {
    if (character.hasCock() == 'false') { return false; }
    if (character.getCondition().hasStatus('crotch-exposed'));

    let armor = Inventory.getEquippedBy(character)['legs'];
    if (armor == null) { return true; }
    if (armor.isLewd()) { return true; }

    return false;
  }

  return {
    isCockExposed,
  };

})();