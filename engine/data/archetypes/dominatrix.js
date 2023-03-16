
const dominatrix = new Archetype({
  code: 'dominatrix',
  name: 'Dominatrix',
  availableSexes: ['female','futa'],
  availableSpecies: ['elf','nymph','orc','dragonkind','lupin','satyr'],
  attributeBonus: { str:1, dex:1, int:1, cha:2 },
  hitGrowth: 'medium',
  hitDice:   8,
  armorType:  'medium',
  weaponType: 'all',
});

dominatrix.addArcanum('domination');
dominatrix.addGnosis('carnage');
dominatrix.addPower('aura-devotion');

dominatrix.setStartingEquipment({
  mainHand:  { rarity:'normal', type:'weapon', code:'whip' },
  chest:     { rarity:'normal', type:'chest',  material:['leather','hide']},
  legs:      { rarity:'normal', type:'legs',   material:['leather','hide']},
  hands:     { rarity:'normal', type:'hands',  material:['leather','hide']},
  feet:      { rarity:'normal', type:'feet',   material:['leather','hide']},
});

dominatrix.setStartingSkills({
  bondage:      2,
  wizardry:     1,
  intimidation: 1,
  seduction:    2,
});

Archetype.register(dominatrix);

