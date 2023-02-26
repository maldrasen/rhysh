ArchetypeDictionary.register('cultist', {
  name:"Cultist",

  availableSexes: ['male','female','futa'],
  availableSpecies: ['elf','nymph','dragonkind','satyr'],
  attributeBonus: { wis:3, cha:2 },
  hitGrowth: 'slow',
  hitDice:   6,

  armorType:  'light',
  weaponType: 'mage',
  arcanum:    ['delight','suffering'],
  powers:     ['aura-corruption'],

  startingEquipment: {
    mainHand:  { rarity:'normal', type:'mageWeapon', hands:2 },
    chest:     { rarity:'normal', type:'chest',  material:['cloth']},
    legs:      { rarity:'normal', type:'legs',   material:['cloth']},
    hands:     { rarity:'normal', type:'hands',  material:['cloth']},
    feet:      { rarity:'normal', type:'feet',   material:['cloth']},
    inventory: [],
  },

  startingSkills: {
    wizardry:     2,
    religion:     2,
    persuasion:   2,
  },

  // Sacrificial Rites?

});
