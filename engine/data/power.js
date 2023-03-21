const PowerDictionary = {}

global.Power = class Power {

  static register(power) {
    PowerDictionary[power.code] = power;
  }

  static lookup(code) {
    if (PowerDictionary[code] == null) { console.trace(); throw `Unknown Power (${code})` }
    return PowerDictionary[code];
  }

  #code;
  #name;
  #abilityCode;
  #passiveEffects;

  constructor(code, options) {
    this.#code = code;
    this.#name = options.name;
    this.#abilityCode = options.abilityCode;
    this.#passiveEffects = [];
  }

  get code() { return this.#code; }
  get name() { return this.#name; }
  get abilityCode() { return this.#abilityCode; }
  get ability() { return Ability.lookup(this.#abilityCode); }
  get passiveEffects() { return this.#passiveEffects; }

  addPassiveEffect(effect) { this.#passiveEffects.push(effect); }

}
