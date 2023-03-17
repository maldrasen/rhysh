
const mindbender = new Archetype('mindbender',{
  name: 'Mindbender',
  availableSexes: [_male,_female,_futa],
  availableSpecies: [_elf,_nymph,_dragonkind,_satyr],
  attributeBonus: { int:3, cha:2 },
  hitGrowth: _slowHitGrowth,
  hitDice:   4,
  armorType:  _lightArmor,
  weaponType: _mageWeapons,
});

mindbender.addArcanum('force');
mindbender.addArcanum('domination');
mindbender.addPower('aura-devotion-greater');

mindbender.setStartingEquipment({
  mainHand:  { weaponType:_mageWeapons },
  chest:     { slot:_chest, armorType:[_cloth]},
  legs:      { slot:_legs,  armorType:[_cloth]},
  hands:     { slot:_hands, armorType:[_cloth]},
  feet:      { slot:_feet,  armorType:[_cloth]},
});

mindbender.setStartingSkills({
  history:      1,
  wizardry:     2,
  seduction:    2,
  persuasion:   1,
});

Archetype.register(mindbender);

