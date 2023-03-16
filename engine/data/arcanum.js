const ArcanumDictionary = {}

global.Arcanum = class Arcanum {

  static register(arcanum) {
    ArcanumDictionary[arcanum.code] = arcanum;
  }

  static lookup(code) {
    if (ArcanumDictionary[code] == null) { throw `Unknown Arcanum (${code})` }
    return ArcanumDictionary[code];
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
