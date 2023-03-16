const GnosisDictionary = {}

global.Gnosis = class Gnosis {

  static register(gnosis) {
    GnosisDictionary[gnosis.code] = gnosis;
  }

  static lookup(code) {
    if (GnosisDictionary[code] == null) { throw `Unknown Gnosis (${code})` }
    return GnosisDictionary[code];
  }

  #code;
  #name;

  constructor(options) {
    this.#code = options.code;
    this.#name = options.name;
  }

  get code() { return this.#code; }
  get name() { return this.#name; }

}