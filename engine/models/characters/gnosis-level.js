global.GnosisLevel = class GnosisLevel {

  #code;
  #level;
  #experience;

  constructor(code) {
    Gnosis.lookup(code);

    this.#code = code;
    this.#level = 0;
    this.#experience = 0;
  }

  getCode() { return this.#code; }
  getLevel() { return this.#level; }
  getExperience() { return this.#experience; }

  // TODO: Gnosis will gain experience when abilities within the gnosis are
  //       used.
  addExperience(info) {}

  // TODO: The Gnosis level will determine which abilities are currently
  //       unlocked. This will need to return an array of ability codes.
  getAbilityCodes() {
    return [];
  }

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