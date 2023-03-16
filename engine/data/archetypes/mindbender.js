
const mindbender = new Archetype({
  code: 'mindbender',
  name: 'Mindbender',
  availableSexes: ['male','female','futa'],
  availableSpecies: ['elf','nymph','dragonkind','satyr'],
  attributeBonus: { int:3, cha:2 },
  hitGrowth: 'slow',
  hitDice:   4,
  armorType:  'light',
  weaponType: 'mage',
});

mindbender.addArcanum('force');
mindbender.addArcanum('domination');
mindbender.addPower('aura-devotion-greater');

mindbender.setStartingEquipment({
  mainHand:  { rarity:'normal', type:'mageWeapon', hands:'1' },
  chest:     { rarity:'normal', type:'chest',  material:['cloth']},
  legs:      { rarity:'normal', type:'legs',   material:['cloth']},
  hands:     { rarity:'normal', type:'hands',  material:['cloth']},
  feet:      { rarity:'normal', type:'feet',   material:['cloth']},
});

mindbender.setStartingSkills({
  history:      1,
  wizardry:     2,
  seduction:    2,
  persuasion:   1,
});

Archetype.register(mindbender);

