ArchetypeDictionary.register('mindbender', {
  name:"Mindbender",

  availableSexes: ['male','female','futa'],
  availableSpecies: ['elf','nymph','dragonkind','satyr'],
  attributeBonus: { int:3, cha:2 },
  hitGrowth: 'slow',
  hitDice:   4,

  armorType:  'light',
  weaponType: 'mage',
  arcanum:    ['force','domination'],
  powers:     ['aura-devotion-greater'],

  startingEquipment: {
    mainHand:  { rarity:'normal', type:'mageWeapon', hands:'1' },
    chest:     { rarity:'normal', type:'chest',  material:['cloth']},
    legs:      { rarity:'normal', type:'legs',   material:['cloth']},
    hands:     { rarity:'normal', type:'hands',  material:['cloth']},
    feet:      { rarity:'normal', type:'feet',   material:['cloth']},
  },

  startingSkills: {
    history:      1,
    wizardry:     2,
    seduction:    2,
    persuasion:   1,
  },

});
