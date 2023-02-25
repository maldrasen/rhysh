ArchetypeDictionary.register('chosen', {
  name:"Chosen",

  availableSexes: ['male','futa'],
  availableSpecies: ['elf','orc','minotaur','dragonkind','lupin','satyr'],
  attributeBonus: { str:1, con:2, wis:1, cha:1 },
  hitGrowth: 'medium',
  hitDice:   10,

  armorType:  'medium',
  weaponType: 'all',
  arcanum:    ['blasphemy'],
  gnosis:     ['carnage'],
  powers:     ['aura-corruption-hideous'],

  startingEquipment: {
    inventory: [],
  },

  startingSkills: {
    athletics:    1,
    wizardry:     2,
    religion:     1,
    intimidation: 2,
  },

});
