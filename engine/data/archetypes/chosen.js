
const chosen = new Archetype({
  code: 'chosen',
  name: 'Chosen',
  availableSexes: ['male','futa'],
  availableSpecies: ['elf','orc','minotaur','dragonkind','lupin','satyr'],
  attributeBonus: { str:1, con:2, wis:1, cha:1 },
  hitGrowth: 'medium',
  hitDice:   10,
  armorType:  'medium',
  weaponType: 'all',
});

chosen.addArcanum('blasphemy');
chosen.addGnosis('carnage');
chosen.addPower('aura-corruption-hideous');

chosen.setStartingEquipment({
  twin:  { rarity:'normal', type:'weapon', hands:'1' },
  chest: { rarity:'normal', type:'chest',  material:['leather','hide']},
  legs:  { rarity:'normal', type:'legs',   material:['leather','hide']},
  hands: { rarity:'normal', type:'hands',  material:['leather','hide']},
  feet:  { rarity:'normal', type:'feet',   material:['leather','hide']},
});

chosen.setStartingSkills({
  athletics:    1,
  wizardry:     2,
  religion:     1,
  intimidation: 2,
});

Archetype.register(chosen);
