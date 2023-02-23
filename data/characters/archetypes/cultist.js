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

  startingSkills: {
    wizardry:     2,
    religion:     2,
    persuasion:   2,
  },

  // Sacrificial Rites?

});
