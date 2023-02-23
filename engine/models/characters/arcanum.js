global.Arcanum = class Arcanum {

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

  // TODO: Arcanum will gain experience when spells from that arcanum are cast
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
    let ability = new Arcanum(data.code);
        ability.#level = data.level;
        ability.#experience = data.experience;

    return ability;
  }

}