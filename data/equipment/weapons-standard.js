
const CloseRangeWeapons = {
  battleaxe:   { name:'Battleaxe',     damage:{ d:10 },     hands:'2', modes:['slash']},
  club:        { name:'Club',          damage:{ d:4 },      hands:'M', modes:['bash']},
  dagger:      { name:'Dagger',        damage:{ d:4 },      hands:'1', modes:['slash','thust']},
  dirk:        { name:'Dirk',          damage:{ d:5 },      hands:'1', modes:['slash','thust']},
  flail:       { name:'Flail',         damage:{ d:8 },      hands:'1', modes:['bash']},
  hammer:      { name:'Hammer',        damage:{ d:4 },      hands:'1', modes:['bash']},
  handaxe:     { name:'Handaxe',       damage:{ d:6 },      hands:'1', modes:['slash']},
  longsword:   { name:'Longsword',     damage:{ d:8 },      hands:'M', modes:['slash','thrust']},
  mace:        { name:'Mace',          damage:{ d:6 },      hands:'1', modes:['bash']},
  maul:        { name:'Maul',          damage:{ x:2, d:6 }, hands:'2', modes:['bash']},
  morningstar: { name:'Morningstar',   damage:{ d:8 },      hands:'M', modes:['bash']},
  rapier:      { name:'Rapier',        damage:{ d:8 },      hands:'M', modes:['slash','thrust']},
  saber:       { name:'Saber',         damage:{ d:7 },      hands:'M', modes:['slash']},
  scimitar:    { name:'Scimitar',      damage:{ d:6 },      hands:'1', modes:['slash']},
  shortsword:  { name:'Shortsword',    damage:{ d:6 },      hands:'1', modes:['slash','thrust']},
  sickle:      { name:'Sickle',        damage:{ d:4 },      hands:'1', modes:['slash']},
  warhammer:   { name:'Warhammer',     damage:{ d:8 },      hands:'M', modes:['bash']},
  whip:        { name:'Whip',          damage:{ d:4 },      hands:'1', modes:['slash','entangle']},
};

const ExtendedRangeWeapons = {
  glave:      { name:'Glave',      damage:{ d:10 },     hands:'2', modes:['slash','thrust']},
  greataxe:   { name:'Greataxe',   damage:{ d:12 },     hands:'2', modes:['slash']},
  greatsword: { name:'Greatsword', damage:{ x:2, d:6 }, hands:'2', modes:['slash','thrust']},
  halberd:    { name:'Halberd',    damage:{ d:10 },     hands:'2', modes:['slash','thrust']},
  spear:      { name:'Spear',      damage:{ d:8 },      hands:'2', modes:['thrust']},
  staff:      { name:'Staff',      damage:{ d:8 },      hands:'2', modes:['bash']},
};

const LongRangeWeapons = {
  arbalest: { name:'Arbalest',      damage:{ d:10 }, hands:'2', modes:['shoot']},
  handbow:  { name:'Hand Crossbow', damage:{ d:6 },  hands:'1', modes:['shoot']},
  crossbow: { name:'Crossbow',      damage:{ d:8 },  hands:'2', modes:['shoot']},
  shortbow: { name:'Shortbow',      damage:{ d:6 },  hands:'2', modes:['shoot']},
  sling:    { name:'Sling',         damage:{ d:4 },  hands:'2', modes:['shoot']},
  longbow:  { name:'Longbow',       damage:{ d:8 },  hands:'2', modes:['shoot']},
};

ObjectHelper.each(CloseRangeWeapons, (code, data) => {
  data.range = 'close';
  Weapon.register(code, data);
});

ObjectHelper.each(ExtendedRangeWeapons, (code, data) => {
  data.range = 'extended';
  Weapon.register(code, data);
});

ObjectHelper.each(LongRangeWeapons, (code, data) => {
  data.range = 'long';
  Weapon.register(code, data);
});

['dagger','dirk','longbow','rapier','shortbow','shortsword'].forEach(code => {
  Weapon.update(code,'attribute','dex');
});

['arbalest','crossbow','handbow'].forEach(code => {
  Weapon.update(code,'attribute','none');
});
