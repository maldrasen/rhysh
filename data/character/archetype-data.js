global.ArchetypeData = {};

ArchetypeData.knight = {
  name:"Black Knight",

  availableSexes: ['male'],
  availableSpecies: ['elf','orc','minotaur','dragonkind','lupin','satyr'],
  attributeBonus:{ str:2, con:2 }
};

ArchetypeData.slaver = {
  name:"Slaver",

  availableSexes: ['male','female','futa'],
  availableSpecies: ['elf','orc','lupin','satyr'],
  attributeBonus:{ str:2, dex:2 }
};

ArchetypeData.cultist = {
  name:"Cultist",

  availableSexes: ['male','female','futa'],
  availableSpecies: ['elf','nymph','dragonkind','satyr'],
  attributeBonus:{ wis:2, cha:2 }
};

ArchetypeData.mindbender = {
  name:"Mindbender",

  availableSexes: ['male','female','futa'],
  availableSpecies: ['elf','nymph','dragonkind','satyr'],
  attributeBonus:{ int:2, cha:2 }
};

ArchetypeData.dominatrix = {
  name:"Dominatrix",

  availableSexes: ['female','futa'],
  availableSpecies: ['elf','nymph','orc','dragonkind','lupin','satyr'],
  attributeBonus:{ str:1, dex:1, int:1, cha:2 }
};

ArchetypeData.chosen = {
  name:"Chosen",

  availableSexes: ['male','futa'],
  availableSpecies: ['elf','orc','minotaur','dragonkind','lupin','satyr'],
  attributeBonus:{ str:1, con:2, wis:1, cha:1 }
};
