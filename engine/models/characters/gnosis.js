global.Gnosis = class Gnosis {

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
    let gnosis = new Gnosis(data.code);
    return gnosis;
  }

}