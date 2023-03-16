global.SkillLevel = class SkillLevel {

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

  setLevel(level) { this.#level = level; }

  // TODO: Rather than making skill selection part of the level up process, I
  //       think I'll have skills level up only by using them. That makes sense
  //       to me anyway. Fighting monsters for experience shouldn't make your
  //       seduction skill any better after all. Casting spells though should
  //       increase your wizardry skill, and seeing new shit will raise your
  //       appraise skill.
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
    let skill = new SkillLevel(data.code);
        skill.#level = data.level;
        skill.#experience = data.experience;

    return skill;
  }

}
