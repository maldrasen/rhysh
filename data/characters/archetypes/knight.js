ArchetypeDictionary.register('knight', {
  name:"Black Knight",

  availableSexes: ['male'],
  availableSpecies: ['elf','orc','minotaur'],
  attributeBonus: { str:3, con:2 },
  hitGrowth: 'fast',
  hitDice:   10,

  armorType:  'heavy',
  weaponType: 'all',
  gnosis:     ['carnage','umbral-knight'],
  powers:     ['aura-fear'],

  startingSkills: {
    athletics:    2,
    history:      1,
    intimidation: 3,
  },

});


