global.Archetype = class Archetype {

  #code;

  constructor(code) {
    this.#code = code;
  }

  getCode() { return this.#code; }

  // === Persistance ===========================================================

  pack() {
    return {
      code: this.#code,
    }
  }

  static unpack(data) {
    let ability = new Archetype(data.code);
    return ability;
  }

}