ArchetypeDictionary.register('dominatrix', {
  name:"Dominatrix",

  availableSexes: ['female','futa'],
  availableSpecies: ['elf','nymph','orc','dragonkind','lupin','satyr'],
  attributeBonus: { str:1, dex:1, int:1, cha:2 },
  hitGrowth: 'medium',

  armorType:  'medium',
  weaponType: 'all',
  arcanum:    ['domination'],
  gnosis:     ['carnage'],
  powers:     ['aura-devotion'],

  startingSkills: {
    bondage:      2,
    wizardry:     1,
    intimidation: 1,
    seduction:    2,
  },

});
