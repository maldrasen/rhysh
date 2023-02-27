EquipmentBuilder.WeaponBuilder = (function() {

  function build(options) {
    let base = options.code || pickBase(options);
    let weapon = new Weapon(base);
    return weapon;
  }

  function pickBase(options) {
    return Random.from(ObjectHelper.values(WeaponDictionary.findAll(options))).code;
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
