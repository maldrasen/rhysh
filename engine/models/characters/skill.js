global.Skill = class Skill {

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
    let skill = new Skill(data.code);
    return skill;
  }

}