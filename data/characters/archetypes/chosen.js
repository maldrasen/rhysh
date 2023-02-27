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
    mainHand:  { rarity:'normal', type:'weapon', hands:1 },
    offHand:   { rarity:'normal', type:'weapon', hands:1 },
    chest:     { rarity:'normal', type:'chest',  material:['leather','hide']},
    legs:      { rarity:'normal', type:'legs',   material:['leather','hide']},
    hands:     { rarity:'normal', type:'hands',  material:['leather','hide']},
    feet:      { rarity:'normal', type:'feet',   material:['leather','hide']},
  },

  startingSkills: {
    athletics:    1,
    wizardry:     2,
    religion:     1,
    intimidation: 2,
  },

});
