EquipmentBuilder.WeaponBuilder = (function() {


  function build(options) {
    if (options.weaponType == null) { throw `A weaponType must be specified (currently)` }
    if (options.weaponType == _byCode) { return buildSpecificWeapon(options.code); }

    let possibleTypes = {
      anyWeapons:      () => { return WeaponType.getAllWeapons() },
      cultWeapons:     () => { return WeaponType.getCultWeapons() },
      closeWeapons:    () => { return WeaponType.getCloseRangeWeapons() },
      extendedWeapons: () => { return WeaponType.getExtendedRangeWeapons() },
      longWeapons:     () => { return WeaponType.getLongRangeWeapons() },
      mageWeapons:     () => { return WeaponType.getMageWeapons() },
    }[options.weaponType]();

    possibleTypes = filterByHands(possibleTypes,options.hands)
    if (possibleTypes.length == 0) {
      return console.error(`Warning: Unable to build a weapon given these options:`,options);
    }

    return new Weapon(Random.from(possibleTypes));
  }

  function buildSpecificWeapon(code) {
    if (code == null) { throw `Code is required`; }
    return new Weapon(code);
  }

  // hands:['1','2','M','1/M']
  //
  // The "1/M" options return one handed or main handed weapons, they're
  // normally mutually exclusive when searching, but can both be used in the
  // main hand.
  //
  // Currently there's no exclusive 'off hand' weapons. I don't think it makes
  // sense for there to be weapons you can't use main handed if needed, but
  // some accessories (notibly shields) are off hand only, but then they can't
  // be used as weapons.
  function filterByHands(possibleTypes, hands) {
    if (hands == null) { return possibleTypes; }

    return ArrayHelper.compact(possibleTypes.map(code => {
      let weaponType = WeaponType.lookup(code);

      if (hands == '1/M' && ['1','M'].indexOf(weaponType.hands) >= 0) { return code; }
      if (hands == weaponType.hands) { return code; }
    }));
  }

  return { build };

})();

// TODO: Magic and unique weapons.
//
// Unique weapons should be based off an existing weapon and given unique
// enchantments. Magic weapons should be done in a similar way. We have a
// simple base weapon and add an enchatment to it... which is really just two
// codes for a real weapon.... of course then you could attach multiple
// enchantments to any weapon rather than limiting it to one per weapon. Maybe
// a player can enchant their weapons as well... Adding enchants actually makes
// more sense then just randomly finding magical weapons after all...

// Weapon.register('beastmaster', {
//   name:   'Beastmaster',
//   damage: { d:8, p:3 },
//   hands:  'M',
//   range:  'close',
//   modes:  ['slash','thrust'],
//   powers: ['charm-beast'],
// });

// Angrist (dagger)
// Ashkandi (greatsword)
// Calris (sword)
// Glamdring (sword)
// Gorehowl (Greataxe)
// Gram (sword)
// Grond (Maul)
// Gungnir (spear)
// Gurthang (greatsword)
// Mournblade (sword)
// Narthanc (fire dagger)
// of Azaghâl (dagger)
// Orcrist (sword)
// Stormbringer (sword)
// Tyrfing (sword,cursed)
// Whelm (Hammer)
