
const cultist = new Archetype('cultist',{
  name: 'Cultist',
  availableSexes: [_male,_female,_futa],
  availableSpecies: [_elf,_nymph,_dragonkind,_satyr],
  attributeBonus: { wis:3, cha:2 },
  hitGrowth: _slowHitGrowth,
  hitDice:   6,
  armorType:  _lightArmor,
  weaponType: _cultWeapons,
});

cultist.addArcanum('delight');
cultist.addArcanum('suffering');
cultist.addPower('aura-corruption');

cultist.setStartingEquipment({
  mainHand: { weaponType:_cultWeapons },
  chest:    { slot:_chest, armorType:[_cloth]},
  legs:     { slot:_legs,  armorType:[_cloth]},
  hands:    { slot:_hands, armorType:[_cloth]},
  feet:     { slot:_feet,  armorType:[_cloth]},
});

cultist.setStartingSkills({
  wizardry:   2,
  religion:   2,
  persuasion: 2,
});

Archetype.register(cultist);
