EquipmentBuilder.AccessoryBuilder = (function() {

  // TODO: Implement the other accessory types.
  function build(options) {
    if (options.type == 'offHand') { return buildShield(options); }
  }

  // TODO: This currently only builds a normal shield, of which there is only
  //       one type. This will need to be expanded to also create magic
  //       shields.
  function buildShield(options) {
    let shield = new Accessory();
    shield.addEffect('armorClass',2);
    shield.setName('Heater Shield');
    return shield;
  }

  return { build };

})();

// One mouth or gag item can be worn at a time.
// Rings
//   Narya Ring of Fire
//   Nenya, Ring of Water, Ring of Adamant
//   Vilya, Ring of Air, Ring of Firmament

// - Slot [Head, Chest, Legs, Hands, Feet] or [Ring, Neck, Ear, Nipple, Labia, Pussy, Ass, Cock]
//   - Ring (Unlimited)
//   - Neck (Three amulets, necklaces, or medallions) or One Collar
//   - Ear (Unlimited earrings)
//   - Nipple (two or three nipple piercings?)
//   - Labia (Unlimited pussy piercings)
//   - Pussy (Up to vaginal capacity)
//   - Ass (Up to anal capacity)
//   - Cock (Unlimited dick piercings or cock rings) "Gates of Hell Penis Plug"
// - Armor Class (how much armor does it add)
// - Armor Weight [Light, Medium, Heavy]
// - Special Effects (Does it grant stat bonuses, more mana, extra powers?)

// Back Slot:
//   Cloak
//   Mantle
