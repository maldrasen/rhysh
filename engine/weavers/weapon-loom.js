Weaver.WeaponLoom = (function() {

  // Replaces token placeholders in the form of:
  //   {{actor::weapon.main-hand.name}}
  //   {{actor::weapon.off-hand.name}}
  //
  function findValue(actor, fullToken, context) {
    let match = fullToken.match(/weapon\.(main-hand|off-hand)\.(.*)/);
    if (match) {
      let weapon = WeaponDictionary.lookup((match[1] == 'main-hand') ? actor.getMainHand() : actor.getOffHand());

      if (match[2] == 'name') { return weapon.name.toLowerCase(); }
      if (match[2] == 'Name') { return weapon.name; }
    }

    return Weaver.error(`Bad Weapon Token(${fullToken})`);
  }

  return { findValue };

})();