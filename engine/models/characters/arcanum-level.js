global.ArcanumLevel = class ArcanumLevel {

  #code;
  #level;
  #experience;

  constructor(code) {
    Arcanum.lookup(code);

    this.#code = code;
    this.#level = 0;
    this.#experience = 0;
  }

  getCode() { return this.#code; }
  getLevel() { return this.#level; }
  getExperience() { return this.#experience; }

  // TODO: Arcanum will gain experience when spells from that arcanum are cast
  addExperience() {}

  // TODO: The Arcanum level will determine which spells (which I'm assuming
  //       we'll just implement as abilities) are currently unlocked. This will
  //       need to return an array of ability codes.
  getAbilityCodes() { return []; }

  // === Persistance ===========================================================

  pack() {
    return {
      code: this.#code,
      level: this.#level,
      experience: this.#experience,
    }
  }

  static unpack(data) {
    let ability = new ArcanumLevel(data.code);
        ability.#level = data.level;
        ability.#experience = data.experience;

    return ability;
  }

}