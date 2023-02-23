ArchetypeDictionary.register('mindbender', {
  name:"Mindbender",

  availableSexes: ['male','female','futa'],
  availableSpecies: ['elf','nymph','dragonkind','satyr'],
  attributeBonus: { int:3, cha:2 },
  hitGrowth: 'slow',

  armorType:  'light',
  weaponType: 'mage',
  arcanum:    ['force','domination'],
  powers:     ['aura-devotion-greater'],

  startingSkills: {
    history:      1,
    wizardry:     2,
    seduction:    2,
    persuasion:   1,
  },

});
