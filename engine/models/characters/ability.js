global.Ability = class Ability {

  #code;

  constructor(code) {
    this.#code = code;
  }

  // === Persistance ===========================================================

  pack() {
    return {
      code: this.#code,
    }
  }

  static unpack(data) {
    let ability = new Ability(data.code);
    return ability;
  }

}