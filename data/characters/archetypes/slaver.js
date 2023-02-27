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

  startingEquipment: {
    mainHand:  { rarity:'normal', type:'weapon', hands:'M' },
    offHand:   { rarity:'normal', type:'weapon', hands:'1' },
    chest:     { rarity:'normal', type:'chest',  material:['leather','hide']},
    legs:      { rarity:'normal', type:'legs',   material:['leather','hide']},
    hands:     { rarity:'normal', type:'hands',  material:['leather','hide']},
    feet:      { rarity:'normal', type:'feet',   material:['leather','hide']},
  },

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
