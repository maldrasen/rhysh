
// TODO: Special Armor Materials:
//   Glass Armor
//   Ember Armor
//   Ivory Armor
//   Ebony Armor
//   Demonskin
//   Dragonscale

const ArmorMaterials = {
  cloth:   { rarity:_normalQuality, name:'Cloth',   ac:1, weight:_lightArmor  },
  leather: { rarity:_normalQuality, name:'Leather', ac:2, weight:_mediumArmor },
  hide:    { rarity:_normalQuality, name:'Hide',    ac:3, weight:_mediumArmor },
  chain:   { rarity:_normalQuality, name:'Chain',   ac:4, weight:_mediumArmor, maxDex:2, minStr:14 },
  scale:   { rarity:_normalQuality, name:'Scale',   ac:5, weight:_mediumArmor, maxDex:1, minStr:15 },
  plate:   { rarity:_normalQuality, name:'Plate',   ac:6, weight:_heavyArmor,  maxDex:0, minStr:16 },
}

const ArmorDictionary = {};

global.ArmorType = class ArmorType {

  static register(armor) {
    ArmorDictionary[armor.code] = armor;
  }

  static lookup(code) {
    if (ArmorDictionary[code] == null) { throw `Unknown Armor Type: ${code}` }
    return ArmorDictionary[code];
  }

  #code;
  #rarity;
  #name;
  #ac;
  #weight;
  #maxDex;
  #minStr;

  constructor(code, options) {
    this.#code = code;
    this.#rarity = options.rarity;
    this.#name = options.name;
    this.#ac = options.ac;
    this.#weight = options.weight;
    this.#maxDex = options.maxDex;
    this.#minStr = options.minStr;
  }

  get code() { return this.#code; }
  get rarity() { return this.#rarity; }
  get name() { return this.#name; }
  get ac() { return this.#ac; }
  get weight() { return this.#weight; }
  get maxDex() { return this.#maxDex; }
  get minStr() { return this.#minStr; }

  pack() {
    let packed = {
      code: this.#code,
      rarity: this.#rarity,
      name: this.#name,
      ac: this.#ac,
      weight: this.#weight,
    }

    if (this.#maxDex) { packed.maxDex = this.#maxDex; }
    if (this.#minStr) { packed.minStr = this.#minStr; }

    return packed;
  }
}

ObjectHelper.each(ArmorMaterials, (code, options) => {
  ArmorType.register(new ArmorType(code, options));
});
