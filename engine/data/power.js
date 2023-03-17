const PowerDictionary = {}

global.Power = class Power {

  static register(power) {
    PowerDictionary[power.code] = power;
  }

  static lookup(code) {
    if (PowerDictionary[code] == null) { throw `Unknown Power (${code})` }
    return PowerDictionary[code];
  }

  #code;
  #name;

  constructor(code, options) {
    this.#code = code;
    this.#name = options.name;
  }

  get code() { return this.#code; }
  get name() { return this.#name; }

}
