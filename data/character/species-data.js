global.SpeciesData = {};

SpeciesData.elf = {
  name:"Elf",
};

SpeciesData.nymph = {
  name:"Nymph",
};

SpeciesData.orc = {
  name:"Orc",
};

SpeciesData.minotaur = {
  name:"Minotaur",
};

SpeciesData.dragonkind = {
  name:"Dragonkind",
};

SpeciesData.lupin = {
  name:"Lupin",
};

SpeciesData.satyr = {
  name:"Satyr",
};

// Set the base attributes for the player character. I'm doing this in a
// separate function because it's easier to see them all in a table like this.
function setAttributes(species, attributes) {
  SpeciesData[species].basePlayerAttributes = attributes;
}

setAttributes('elf',        { str:12, dex:14, con:10, int:12, wis:10, cha:10 });
setAttributes('nymph',      { str:8,  dex:8,  con:8,  int:12, wis:12, cha:16 });
setAttributes('orc',        { str:14, dex:12, con:16, int:8,  wis:10, cha:8  });
setAttributes('minotaur',   { str:16, dex:8,  con:14, int:8,  wis:8,  cha:8  });
setAttributes('dragonkind', { str:14, dex:14, con:12, int:14, wis:12, cha:12 });
setAttributes('lupin',      { str:14, dex:14, con:16, int:9,  wis:9,  cha:9  });
setAttributes('satyr',      { str:12, dex:10, con:10, int:8,  wis:8,  cha:12 });
