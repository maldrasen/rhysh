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

  // A character has some (at least one) attributes that are never persisted.
  // The cooldown table for instance is reset at the start of every battle and
  // doesn't need to exist beyond that. There will probably be more temporary
  // state objects as well.
  #cooldownTable;

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
  doDamage(points) { this.#condition.doDamage(points); }

  getStoryName() { return this.#firstName; }
  getFirstName() { return this.#firstName; }
  getLastName()  { return this.#lastName; }
  getFullName()  { return `${this.getFirstName()} ${this.getLastName()}`; }
  setFirstName(name) { this.#firstName = name; }
  setLastName(name) { this.#lastName = name; }

  getPortrait() { return 'portraits/ass-m-15' }

  getSex(sex) { return this.#sex; }
  setSex(sex) {
    if (['female','futa','male'].indexOf(sex) < 0) { throw `Invalid Sex: ${sex}`; }
    this.#sex = sex;
  }

  getArchetypeCode() { return this.#archetypeCode; }
  getArchetype() { return Archetype.lookup(this.#archetypeCode); }
  setArchetypeCode(code) { this.#archetypeCode = code; }

  getSpeciesCode() { return this.#speciesCode; }
  getSpecies() { return Species.lookup(this.#speciesCode); }
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
  hasPussy() { return this.isFemale(); }
  hasTits() { return this.isNotMale(); }

  // === Members ===============================================================

  rollForInitiative() { return RollsInitiative.rollFor(this); }
  isCockExposed() { return CheckEquipment.isCockExposed(this); }
  isPussyExposed() { return CheckEquipment.isPussyExposed(this); }
  areTitsExposed() { return CheckEquipment.areTitsExposed(this); }

  // TODO: Body part describers.
  briefDescriptionOfBalls() {
    if (this.hasCock() == false) { throw 'Character has no balls.' }
    return 'balls'
  }

  briefDescriptionOfCock() {
    if (this.hasCock() == false) { throw 'Character has no cock.' }
    return 'cock'
  }

  briefDescriptionOfTits() {
    if (this.hasCock() == false) { throw 'Character has no tits.' }
    return 'tits'
  }

  // === Abilities =============================================================

  onBattleStart() {
    this.#cooldownTable = new CooldownTable();
  }

  reduceCooldowns() {
    this.#cooldownTable.reduce();
  }

  // === Experience ============================================================

  gainExperience(points) {}

  // === Equipment =============================================================

  // TODO: Make sure characters can equip items.
  canEquip(equipment) {
    return true;
  }

  // TODO: Some accessories can add armor.
  // TODO: A shield adds armor.
  // TODO: Spell effects can add armor.
  // TODO: Status effects can adjust armor class.
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

  getMainHand() { return Inventory.getEquippedBy(this)['mainHand']; }
  getOffHand() { return Inventory.getEquippedBy(this)['offHand']; }

  getMainHandCode() {
    let weapon = this.getMainHand();
    return weapon ? weapon.getWeaponTypeCode() : null;
  }

  getOffHandCode() {
    let weapon = this.getOffHand();
    return weapon ? weapon.getWeaponTypeCode() : null;
  }

  // === Persistance ===========================================================

  save() {
    CharacterLibrary.saveCharacter(this);
  }

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
      character.addArcanum(ArcanumLevel.unpack(arcanumData));
    });

    ObjectHelper.each(data.gnosisMap, (code, gnosisData) => {
      character.addGnosis(GnosisLevel.unpack(gnosisData));
    });

    ObjectHelper.each(data.powerMap, (code, powerData) => {
      character.addPower(PowerLevel.unpack(powerData));
    });

    ObjectHelper.each(data.skillMap, (code, skillData) => {
      character.addSkill(SkillLevel.unpack(skillData));
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

  packOrders() {
    return [{ name:"Retreat", code:'retreat' }];
  }

  packForStatus() {
    return {
      code: this.#code,
      portrait: this.getPortrait(),
      firstName: this.#firstName,
      condition: this.#condition.pack(),
    };
  }

}
