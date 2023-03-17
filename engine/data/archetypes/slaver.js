
const slaver = new Archetype('slaver',{
  name: 'Slaver',
  availableSexes: [_male,_female,_futa],
  availableSpecies: [_elf,_orc,_lupin,_satyr],
  attributeBonus: { str:2, dex:3 },
  hitGrowth: _fastHitGrowth,
  hitDice:   6,
  armorType:  _mediumArmor,
  weaponType: _anyWeapons,
});

slaver.addGnosis('carnage');
slaver.addGnosis('venom');

slaver.setStartingEquipment({
  mainHand:  { weaponType:_closeWeapons, hands:'M' },
  offHand:   { weaponType:_closeWeapons, hands:'1' },
  chest:     { slot:_chest, armorType:[_leather,_hide]},
  legs:      { slot:_legs,  armorType:[_leather,_hide]},
  hands:     { slot:_hands, armorType:[_leather,_hide]},
  feet:      { slot:_feet,  armorType:[_leather,_hide]},
});

slaver.setStartingSkills({
  acrobatics:   1,
  bondage:      1,
  stealth:      2,
  mechanics:    1,
  perception:   1,
  appraisial:   1,
  seduction:    1,
});

Archetype.register(slaver);
