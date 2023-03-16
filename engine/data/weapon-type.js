const WeaponDictionary = {};

const CloseRangeWeapons = {
  battleaxe:   { name:'Battleaxe',     damage:{ d:10 },     hands:'2', modes:['slash']},
  club:        { name:'Club',          damage:{ d:4 },      hands:'M', modes:['bash']},
  dagger:      { name:'Dagger',        damage:{ d:4 },      hands:'1', modes:['slash','thrust','parry']},
  dirk:        { name:'Dirk',          damage:{ d:5 },      hands:'1', modes:['slash','thrust','parry']},
  flail:       { name:'Flail',         damage:{ d:8 },      hands:'1', modes:['bash']},
  hammer:      { name:'Hammer',        damage:{ d:4 },      hands:'1', modes:['bash']},
  handaxe:     { name:'Handaxe',       damage:{ d:6 },      hands:'1', modes:['slash']},
  longsword:   { name:'Longsword',     damage:{ d:8 },      hands:'M', modes:['slash','thrust','parry']},
  mace:        { name:'Mace',          damage:{ d:6 },      hands:'1', modes:['bash']},
  maul:        { name:'Maul',          damage:{ x:2, d:6 }, hands:'2', modes:['bash']},
  morningstar: { name:'Morningstar',   damage:{ d:8 },      hands:'M', modes:['bash']},
  rapier:      { name:'Rapier',        damage:{ d:8 },      hands:'M', modes:['slash','thrust','riposte']},
  saber:       { name:'Saber',         damage:{ d:7 },      hands:'M', modes:['slash']},
  scimitar:    { name:'Scimitar',      damage:{ d:6 },      hands:'1', modes:['slash','parry']},
  shortsword:  { name:'Shortsword',    damage:{ d:6 },      hands:'1', modes:['slash','thrust','parry']},
  sickle:      { name:'Sickle',        damage:{ d:4 },      hands:'1', modes:['slash','parry']},
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

global.WeaponType = class WeaponType {

  static register(weapon) {
    WeaponDictionary[weapon.code] = weapon;
  }

  static lookup(code) {
    if (WeaponDictionary[code] == null) { throw `Unknown Weapon Type: ${code}` }
    return WeaponDictionary[code];
  }

  // Weapon search function. Options:
  //   hands:['1','2','M','1/M']
  //
  // The "1/M" options return one handed or main handed weapons, they're
  // normally mutually exclusive when searching, but can both be used in the
  // main hand.
  //
  // Currently there's no exclusive 'off hand' weapons. I don't think it makes
  // sense for there to be weapons you can't use main handed if needed, but
  // some accessories (notibly shields) are off hand only, but then they can't
  // be used as weapons.

  static findAll(options) {
    return ObjectHelper.select(WeaponDictionary, (code, weapon) => {
      let valid = true;

      if (options.hands) {
        if (options.hands == '1/M' && ['1','M'].indexOf(weapon.hands) < 0) { valid = false; }
        if (options.hands.length == 1 && options.hands != weapon.hands) { valid = false; }
      }

      return valid;
    });
  }

  #code;
  #name;
  #damage;
  #hands;
  #modes;
  #range;
  #attribute;

  constructor(options) {
    this.#code = options.code;
    this.#name = options.name;
    this.#damage = options.damage;
    this.#hands = options.hands;
    this.#modes = options.modes;
    this.#range = options.range;
    this.#attribute = options.attribute || _str;
  }

  get code() { return this.#code; }
  get name() { return this.#name; }
  get damage() { return this.#damage; }
  get hands() { return this.#hands; }
  get modes() { return this.#modes; }
  get range() { return this.#range; }
  get attribute() { return this.#attribute; }

  setAttribute(attribute) { this.#attribute = attribute; }

  pack() {
    return {
      code: this.#code,
      name: this.#name,
      damage: this.#damage,
      hands: this.#hands,
      modes: this.#modes,
      range: this.#range,
      attribute: this.#attribute,
    };
  }
}

ObjectHelper.each(CloseRangeWeapons, (code, data) => {
  WeaponType.register(new WeaponType({ code:code, ...data, range:_close }));
});

ObjectHelper.each(ExtendedRangeWeapons, (code, data) => {
  WeaponType.register(new WeaponType({ code:code, ...data, range:_extended }));
});

ObjectHelper.each(LongRangeWeapons, (code, data) => {
  WeaponType.register(new WeaponType({ code:code, ...data, range:_long }));
});

['dagger','dirk','longbow','rapier','shortbow','shortsword'].forEach(code => {
  WeaponType.lookup(code).setAttribute('dex');
});

['arbalest','crossbow','handbow'].forEach(code => {
  WeaponType.lookup(code).setAttribute(null);
});
