
const knight = new Archetype({
  code: 'knight',
  name: 'Black Knight',
  availableSexes: ['male'],
  availableSpecies: ['elf','orc','minotaur'],
  attributeBonus: { str:3, con:2 },
  hitGrowth: 'fast',
  hitDice:   10,
  armorType:  'heavy',
  weaponType: 'all',
});

knight.addGnosis('carnage');
knight.addGnosis('subjugation');
knight.addPower('aura-fear');

knight.setStartingEquipment({
  mainHand:  { rarity:'normal', type:'weapon', code:'longsword' },
  offHand:   { rarity:'normal', type:'shield' },
  head:      { rarity:'normal', type:'head',   material:['plate']},
  chest:     { rarity:'normal', type:'chest',  material:['plate']},
  legs:      { rarity:'normal', type:'legs',   material:['plate']},
  hands:     { rarity:'normal', type:'hands',  material:['plate']},
  feet:      { rarity:'normal', type:'feet',   material:['plate']},
});

knight.setStartingSkills({
  athletics:    2,
  history:      1,
  intimidation: 3,
});

Archetype.register(knight);