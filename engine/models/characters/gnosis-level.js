global.GnosisLevel = class GnosisLevel {

  #code;
  #level;
  #experience;

  constructor(code) {
    this.#code = code;
    this.#level = 0;
    this.#experience = 0;
  }

  getCode() { return this.#code; }
  getLevel() { return this.#level; }
  getExperience() { return this.#experience; }

  // TODO: Gnosis will gain experience when abilities within the gnosis are
  //       used.
  addExperience() {}

  // === Persistance ===========================================================

  pack() {
    return {
      code: this.#code,
      level: this.#level,
      experience: this.#experience,
    }
  }

  static unpack(data) {
    let gnosis = new GnosisLevel(data.code);
        gnosis.#level = data.level;
        gnosis.#experience = data.experience;

    return gnosis;
  }

}