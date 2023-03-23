global.RollInitiative = (function() {

  // And add character modifiers. Are
  function rollFor(character) {
    let dexMod = character.getAttributes().dexModifier()
    return Random.rollDice({ d:20, p:dexMod });
  }

  return { rollFor }

})();
