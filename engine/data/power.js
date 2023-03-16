const PowerDictionary = {}

global.Power = class Power {

  static register(power) {
    PowerDictionary[power.code] = power;
  }

  static lookup(code) {
    if (PowerDictionary[code] == null) { throw `Unknown Power (${code})` }
    return PowerDictionary[code];
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
