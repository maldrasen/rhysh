global.CheckEquipment = (function() {

  function isCockExposed(character) {
    if (character.hasCock() == false) { return false; }
    if (character.getCondition().hasStatus('crotch-exposed'));

    let armor = Inventory.getEquippedBy(character)['legs'];
    if (armor == null) { return true; }
    if (armor.isLewd()) { return true; }

    return false;
  }

  function isPussyExposed(character) {
    if (character.hasPussy() == false) { return false; }
    if (character.getCondition().hasStatus('crotch-exposed'));

    let armor = Inventory.getEquippedBy(character)['legs'];
    if (armor == null) { return true; }
    if (armor.isLewd()) { return true; }

    return false;
  }

  function areTitsExposed(character) {
    if (character.hasTits() == false) { return false; }
    if (character.getCondition().hasStatus('crotch-exposed'));

    let armor = Inventory.getEquippedBy(character)['chest'];
    if (armor == null) { return true; }
    if (armor.isLewd()) { return true; }

    return false;
  }

  return {
    isCockExposed,
    isPussyExposed,
    areTitsExposed,
  };

})();