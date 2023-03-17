
const knight = new Archetype('knight',{
  name: 'Black Knight',
  availableSexes: [_male],
  availableSpecies: [_elf,_orc,_minotaur],
  attributeBonus: { str:3, con:2 },
  hitGrowth: _fastHitGrowth,
  hitDice:   10,
  armorType:  _heavyArmor,
  weaponType: _anyWeapons,
});

knight.addGnosis('carnage');
knight.addGnosis('subjugation');
knight.addPower('aura-fear');

knight.setStartingEquipment({
  mainHand:  { weaponType:_byCode, code:'longsword' },
  offHand:   { type:'shield' },
  head:      { slot:_head,  armorType:[_plate]},
  chest:     { slot:_chest, armorType:[_plate]},
  legs:      { slot:_legs,  armorType:[_plate]},
  hands:     { slot:_hands, armorType:[_plate]},
  feet:      { slot:_feet,  armorType:[_plate]},
});

knight.setStartingSkills({
  athletics:    2,
  history:      1,
  intimidation: 3,
});

Archetype.register(knight);
