
const chosen = new Archetype('chosen',{
  name: 'Chosen',
  availableSexes: [_male,_futa],
  availableSpecies: [_elf,_orc,_minotaur,_dragonkind,_lupin,_satyr],
  attributeBonus: { str:1, con:2, wis:1, cha:1 },
  hitGrowth: _mediumHitGrowth,
  hitDice:   10,
  armorType:  _mediumArmor,
  weaponType: _anyWeapons,
});

chosen.addArcanum('blasphemy');
chosen.addGnosis('carnage');
chosen.addPower('aura-corruption-hideous');

chosen.setStartingEquipment({
  twin:  { weaponType:_closeWeapons, hands:'1' },
  chest: { slot:_chest,  armorType:[_leather,_hide]},
  legs:  { slot:_legs,   armorType:[_leather,_hide]},
  hands: { slot:_hands,  armorType:[_leather,_hide]},
  feet:  { slot:_feet,   armorType:[_leather,_hide]},
});

chosen.setStartingSkills({
  athletics:    1,
  wizardry:     2,
  religion:     1,
  intimidation: 2,
});

Archetype.register(chosen);
