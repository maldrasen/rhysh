ArchetypeDictionary.register('slaver', {
  name:"Slaver",

  availableSexes: ['male','female','futa'],
  availableSpecies: ['elf','orc','lupin','satyr'],
  attributeBonus: { str:2, dex:3 },
  hitGrowth: 'fast',
  hitDice:   6,

  armorType:  'medium',
  weaponType: 'all',
  gnosis:     ['carnage','venom'],

  startingSkills: {
    acrobatics:   1,
    bondage:      1,
    stealth:      2,
    mechanics:    1,
    perception:   1,
    appraisial:   1,
    seduction:    1,
  },

});
