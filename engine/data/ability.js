const AbilityDictionary = {}

global.Ability = class Ability {

  static register(ability) {
    AbilityDictionary[ability.code] = ability;
  }

  static lookup(code) {
    if (AbilityDictionary[code] == null) { throw `Unknown Ability (${code})` }
    return AbilityDictionary[code];
  }

  constructor(options) {
    this.#code = options.code;
    this.#name = options.name;
  }

  #code;
  #name;

  get code() { return this.#code; }
  get name() { return this.#name; }

}
