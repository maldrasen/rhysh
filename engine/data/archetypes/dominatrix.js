
const dominatrix = new Archetype('dominatrix',{
  name: 'Dominatrix',
  availableSexes: [_female,_futa],
  availableSpecies: [_elf,_nymph,_orc,_dragonkind,_lupin,_satyr],
  attributeBonus: { str:1, dex:1, int:1, cha:2 },
  hitGrowth: _mediumHitGrowth,
  hitDice:   8,
  armorType:  _mediumArmor,
  weaponType: _anyWeapons,
});

dominatrix.addArcanum('domination');
dominatrix.addGnosis('carnage');
dominatrix.addPower('aura-devotion');

dominatrix.setStartingEquipment({
  mainHand: { type:'weapon', code:'whip' },
  chest:    { slot:_chest, armorType:[_leather,_hide]},
  legs:     { slot:_legs,  armorType:[_leather,_hide]},
  hands:    { slot:_hands, armorType:[_leather,_hide]},
  feet:     { slot:_feet,  armorType:[_leather,_hide]},
});

dominatrix.setStartingSkills({
  bondage:      2,
  wizardry:     1,
  intimidation: 1,
  seduction:    2,
});

Archetype.register(dominatrix);

