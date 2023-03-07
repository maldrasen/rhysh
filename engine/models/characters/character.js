global.Character = class Character {

  #code;
  #level = 0;
  #experience = 0;
  #attributes;
  #condition;

  #firstName;
  #lastName;
  #sex;

  #archetypeCode;
  #speciesCode;

  #arcanumMap = {};
  #gnosisMap = {};
  #powerMap = {};
  #skillMap = {};

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

  getCondition() { return this.#condition; }
  hasCondition(condition) { return this.#condition.hasCondition(condition); }
  hasStatus(status) { return this.#condition.hasStatus(status); }
  setCondition(conditionObject) { this.#condition = conditionObject; }

  getName() { return this.#firstName; }
  getFirstName() { return this.#firstName; }
  getLastName()  { return this.#lastName; }
  getFullName()  { return `${this.getFirstName()} ${this.getLastName()}`; }
  setFirstName(name) { this.#firstName = name; }
  setLastName(name) { this.#lastName = name; }

  getSex(sex) { return this.#sex; }
  setSex(sex) {
    if (['female','futa','male'].indexOf(sex) < 0) { throw `Invalid Sex: ${sex}`; }
    this.#sex = sex;
  }

  getArchetypeCode() { return this.#archetypeCode; }
  getArchetype() { return ArchetypeDictionary.lookup(this.#archetypeCode); }
  setArchetypeCode(code) { this.#archetypeCode = code; }

  getSpeciesCode() { return this.#speciesCode; }
  getSpecies() { return SpeciesDictionary.lookup(this.#speciesCode); }
  setSpeciesCode(code) { this.#speciesCode = code; }

  getArcanumMap() { return this.#arcanumMap; }
  getArcanum(code) { return this.#arcanumMap[code]; }
  hasArcanum(code) { return this.#arcanumMap[code] != null; }
  addArcanum(arcanum) { this.#arcanumMap[arcanum.getCode()] = arcanum; }

  getGnosisMap() { return this.#gnosisMap; }
  getGnosis(code) { return this.#gnosisMap[code]; }
  hasGnosis(code) { return this.#gnosisMap[code] != null; }
  addGnosis(gnosis) { this.#gnosisMap[gnosis.getCode()] = gnosis; }

  getPowerMap() { return this.#powerMap; }
  getPower(code) { return this.#powerMap[code]; }
  hasPower(code) { return this.#powerMap[code] != null; }
  addPower(power) { this.#powerMap[power.getCode()] = power; }

  getSkillMap() { return this.#skillMap; }
  getSkill(code) { return this.#skillMap[code]; }
  hasSkill(code) { return this.#skillMap[code] != null; }
  addSkill(skill) { this.#skillMap[skill.getCode()] = skill; }

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

  isFemale() { return this.#sex == 'female'; }
  isFuta() { return this.#sex == 'futa'; }
  isMale() { return this.#sex == 'male'; }

  isNotFemale() { return this.#sex != 'female'; }
  isNotFuta() { return this.#sex != 'futa'; }
  isNotMale() { return this.#sex != 'male'; }

  hasCock() { return this.isNotFemale(); }
  hasTits() { return this.isNotMale(); }

  // === Members ===============================================================

  rollForInitiative() { return RollsInitiative.rollFor(this); }
  isCockExposed() { return CheckEquipment.isCockExposed(this); }

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

  // === Equipment =============================================================

  // TODO: Make sure characters can equip items.
  canEquip(equipment) {
    return true;
  }

  // TODO: Some accessories can add armor.
  // TODO: Spell effects can add armor.
  getArmorClass(slot) {
    let baseArmor = this.getBaseArmorClass();
    let dexBonus = this.getAttributes().dexModifier();
    let armorBonus = 0;

    let armor = Inventory.getEquippedBy(this)[slot];
    if (armor) {
      let maxDex = armor.getMaxDex();
      if (maxDex && maxDex > dexBonus) {
        dexBonus = maxDex;
      }

      armorBonus = armor.getArmorClass();
    }

    return baseArmor + dexBonus + armorBonus;
  }

  // === Persistance ===========================================================

  save() {
    CharacterLibrary.saveCharacter(this);
  }

  // === New Attributes ===
  // #arcanumMap = {};
  // #gnosisMap = {};
  // #powerMap = {};
  // #skillMap = {};

  pack() {
    let data = {
      code: this.#code,
      level: this.#level,
      experience: this.#experience,
      attributes: this.#attributes.pack(),
      condition: this.#condition.pack(),

      firstName: this.#firstName,
      lastName: this.#lastName,
      sex: this.#sex,

      archetypeCode: this.#archetypeCode,
      speciesCode: this.#speciesCode,

      arcanumMap: {},
      gnosisMap: {},
      powerMap: {},
      skillMap: {},
    }

    ObjectHelper.each(this.#arcanumMap, (code, arcanum) => {
      data.arcanumMap[code] = arcanum.pack();
    });

    ObjectHelper.each(this.#gnosisMap, (code, gnosis) => {
      data.gnosisMap[code] = gnosis.pack();
    });

    ObjectHelper.each(this.#powerMap, (code, power) => {
      data.powerMap[code] = power.pack();
    });

    ObjectHelper.each(this.#skillMap, (code, skill) => {
      data.skillMap[code] = skill.pack();
    });

    return data;
  }

  static unpack(data) {
    let character = new Character(data.code);
    character.#level = data.level;
    character.#experience = data.experience;
    character.#attributes = Attributes.unpack(data.attributes);
    character.#condition = Condition.unpack(data.condition);

    character.#firstName = data.firstName;
    character.#lastName = data.lastName;
    character.#sex = data.sex;

    character.#archetypeCode = data.archetypeCode;
    character.#speciesCode = data.speciesCode;

    ObjectHelper.each(data.arcanumMap, (code, arcanumData) => {
      character.addArcanum(Arcanum.unpack(arcanumData));
    });

    ObjectHelper.each(data.gnosisMap, (code, gnosisData) => {
      character.addGnosis(Gnosis.unpack(gnosisData));
    });

    ObjectHelper.each(data.powerMap, (code, powerData) => {
      character.addPower(Power.unpack(powerData));
    });

    ObjectHelper.each(data.skillMap, (code, skillData) => {
      character.addSkill(Skill.unpack(skillData));
    });

    return character;
  }

  // TODO: We also need to include a list of spells and abilities.
  packForBattle() {
    let abilityList = [];
    let spellList = [];

    let packed = {
      code: this.#code,
      condition: this.#condition.pack(),
      fullName: this.getFullName(),
      abilityList: abilityList,
      spellList: spellList,
    };

    if (this.#code == 'Main') {
      packed.orders = this.packOrders();
    }

    let equipped = Inventory.getEquippedBy(this);
    let mainHand = equipped['mainHand'];
    let offHand = equipped['offHand'];

    if (mainHand) { packed.mainHand = mainHand.packForBattle(); }
    if (offHand) { packed.offHand = offHand.packForBattle(); }

    return packed;
  }

  // TODO: A main character can issue orders to his followers. This is their
  //       action and takes their entire turn, but should buff the rest of the
  //       party somehow. Running is also an order that only the main character
  //       can give, so it's bundled in with the rest of the orders.
  packOrders() {
    return [{ name:"Retreat", code:'retreat' }];
  }

  // TODO: Need to select portrait at character creation. Should also allow
  //       people to change portrait and name at any time. For now we're just
  //       getting a random elf portrait.
  packForStatus() {
    let image = `minotaur-03`;

    return {
      code: this.#code,
      portrait: image,
      firstName: this.#firstName,
      condition: this.#condition.pack(),
    };
  }

}
