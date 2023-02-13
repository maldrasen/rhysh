global.Character = class Character {

  // The character code is part of the filename where the character is saved
  // and how the character is referenced in the CharacterLibrary.
  constructor(code, options={}) {
    this.code = code;
    this.level = 1;
    this.experience = 0;

    if (options.experience != undefined) {
      this.gainExperience(options.experience);
    }
  }

  getCode() { return this.code; }

  setFirstName(name) { this.firstName = name; }
  setLastName(name) { this.lastName = name; }
  getFirstName() { return this.firstName; }
  getLastName()  { return this.lastName; }
  getFullName()  { return `${this.getFirstName()} ${this.getLastName()}`; }

  setSex(sex) { this.sex = sex; }
  getSex(sex) { return this.sex; }

  setArchetypeCode(code) { this.archetypeCode = code; }
  getArchetypeCode() { return this.archetypeCode; }
  getArchetype() { return Archetype.lookup(this.archetypeCode); }

  setSpeciesCode(code) { this.speciesCode = code; }
  getSpeciesCode() { return this.speciesCode; }
  getSpecies() { return Species.lookup(this.speciesCode); }

  setAttributes(attributesObject) { this.attributes = attributesObject; }
  getAttributes() { return this.attributes; }

  getLevel() { return this.level; }
  getExperience() { return this.experience; }

  // === Experience ============================================================

  gainExperience(points) {
    // TODO: Handle gaining levels. I think gaining experience will work in
    //       essentially the same way for all the character sub-classes. The
    //       amount of experience needed to gain a level won't depend on the
    //       archetype or species, but a character can have an experience
    //       penality (or a bonus) that changes the rate of leveling. Could
    //       even add an experience bonus as part of the game configuration as
    //       a cheat option.
    //
    //       The level attribute is secondary to experience. It's convinient to
    //       have as a reference and some skills will depend on level. The only
    //       way to set the character's level though is for them to
    //       gainExperience.
    //
    //       Gain experience should trigger a gainLevel() function each time
    //       the level threshold is met. gainLevel() can be overridded by the
    //       subclasses so that player's gain levels differently that party
    //       members or monsters.
  }

  // === Persistance ===========================================================

  save() {
    CharacterLibrary.saveCharacter(this);
  }

  pack() {
    return {
      code: this.code,
      firstName: this.firstName,
      lastName: this.lastName,
      sex: this.sex,
      archetypeCode: this.archetypeCode,
      speciesCode: this.speciesCode,
      attributes: this.attributes.pack(),
      experience: this.experience,
      level: this.level,
    }
  }

  static unpack(data) {
    let character = new Character(data.code);
    character.firstName = data.firstName;
    character.lastName = data.lastName;
    character.sex = data.sex;
    character.archetypeCode = data.archetypeCode;
    character.speciesCode = data.speciesCode;
    character.attributes = Attributes.unpack(data.attributes);
    character.experience = data.experience;
    character.level = data.level;
    return character;
  }

}
