global.PowerLevel = class PowerLevel {

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

  // TODO: I think powers should gain experience when you use them as well as
  //       get some experience when the character gains experience. This will
  //       still allow mostly passive skills to level. Leveling a power is
  //       going to be like leveling an arcanum or gnosis. There will be a
  //       skill tree that you can add points into. A lot like WoW, but with a
  //       tree for each power like ability.
  //
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
    let power = new PowerLevel(data.code);
        power.#level = data.level;
        power.#experience = data.experience;

    return power;
  }

}
