Weaver.WeaponLoom = (function() {

  // Replaces token placeholders in the form of:
  //   {{actor::weapon.main-hand.name}}
  //   {{actor::weapon.off-hand.name}}
  //
  function findValue(actor, fullToken, context) {
    let match = fullToken.match(/weapon\.(main-hand|off-hand)\.(.*)/);
    if (match == null) {
      return Weaver.error(`Bad weapon token(${fullToken})`);
    }

    let hand = (match[1] == 'main-hand') ? 'main' : 'off';
    let token = match[2];

    return `Lookup Weapon (${hand}:${token})`;
  }

  return { findValue };

})();