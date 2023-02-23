global.Character = class Character {

  #code;
  #level = 0;
  #experience = 0;
  #attributes;
  #maxHitPoints;
  #currentHitPoints;

  #firstName;
  #lastName;
  #sex;

  #archetypeCode;
  #speciesCode;

  #skillList = [];
  #gnosisList = [];
  #arcanumList = [];
  #abilityList = [];
  #equipment;

  #condition = 'normal';
  #statuses = {};

  // The character code is part of the filename where the character is saved
  // and how the character is referenced in the CharacterLibrary.
  constructor(code, options={}) {
    this.#code = code;
    if (options.experience != undefined) {
      this.gainExperience(options.experience);
    }
  }

  getCode() { return this.#code; }
  getLevel() { return this.#level; }
  getExperience() { return this.#experience; }

  getAttributes() { return this.#attributes; }
  setAttributes(attributesObject) { this.#attributes = attributesObject; }

  // === TODO ===
  // The max hit points should only be set when the character is first created
  // by the character builder and only updated when the character levels or
  // something unusual happens. Setting the hitpoints to a negative should set
  // the character condition to unconcious or dead. This brings up an important
  // point though. Conditions have priorities. A dead condition should not
  // accidently be overridden by a lesser condition. Sometimes a condition can
  // be though. If a character is healed from being unconcious they need to
  // move from unconcious to being prone. So... condition needs to be a whole
  // state machine thing.
  getCurrentHitPoints() { return this.#currentHitPoints; }
  setCurrentHitPoints(points) { this.#currentHitPoints = points; }
  getMaxHitPoints() { return this.#maxHitPoints; }
  setMaxHitPoints(points) { this.#maxHitPoints = points; }

  getFirstName() { return this.#firstName; }
  getLastName()  { return this.#lastName; }
  getFullName()  { return `${this.getFirstName()} ${this.getLastName()}`; }
  setFirstName(name) { this.#firstName = name; }
  setLastName(name) { this.#lastName = name; }

  getSex(sex) { return this.#sex; }
  setSex(sex) { this.#sex = sex; }

  getArchetypeCode() { return this.#archetypeCode; }
  getArchetype() { return Archetype.lookup(this.#archetypeCode); }
  setArchetypeCode(code) { this.#archetypeCode = code; }

  getSpeciesCode() { return this.#speciesCode; }
  getSpecies() { return Species.lookup(this.#speciesCode); }
  setSpeciesCode(code) { this.#speciesCode = code; }

  // #skillList
  // #gnosisList
  // #arcanumList
  // #abilityList
  // #equipment

  // #condition = 'normal';
  // #statuses = {};



  // === Calculated Values =====================================================

  getBaseArmorClass() {
    return this.getSpecies().baseArmorClass;
  }

  getBaseHit() {
    let factor = {
      slow:   3.0,
      medium: 1.5,
      fast:   1.0,
    }[this.getArchetype().hitGrowth];

    return Math.ceil(this.getLevel() / factor);
  }

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

  // === New Attributes ===
  // #skillList
  // #gnosisList
  // #arcanumList
  // #abilityList
  // #equipment

  // #condition = 'normal';
  // #statuses = {};
  // #cooldowns = {}; // Are cooldowns part of Abilities? Probably for characters yes.

  pack() {
    return {
      code: this.#code,
      level: this.#level,
      experience: this.#experience,
      attributes: this.#attributes.pack(),
      maxHitPoints: this.#maxHitPoints,
      currentHitPoints: this.#currentHitPoints,

      firstName: this.#firstName,
      lastName: this.#lastName,
      sex: this.#sex,

      archetypeCode: this.#archetypeCode,
      speciesCode: this.#speciesCode,
    }
  }






  static unpack(data) {
    let character = new Character(data.code);
    character.#level = data.level;
    character.#experience = data.experience;
    character.#attributes = Attributes.unpack(data.attributes);
    character.#maxHitPoints = data.maxHitPoints;
    character.#currentHitPoints = data.currentHitPoints;

    character.#firstName = data.firstName;
    character.#lastName = data.lastName;
    character.#sex = data.sex;

    character.#archetypeCode = data.archetypeCode;
    character.#speciesCode = data.speciesCode;

    return character;
  }

}
