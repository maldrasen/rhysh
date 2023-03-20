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

  get classname() { return _characterActor; }

  getCode() { return this.#code; }

  getLevel() { return this.#level; }
  setLevel(level) { this.#level = level; }

  getExperience() { return this.#experience; }
  setExperience(experience) { this.#experience = experience; }

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

  getPortrait() {
    if (this.#speciesCode == _minotaur) { return `portraits/minotaur-01` }
    if (this.#speciesCode == _nymph) { return `portraits/nymph-01` }
    let sex = (this.#sex == _male) ? 'm' : 'f'
    return `portraits/${this.#speciesCode}-${sex}-01`
  }

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
  addArcanum(arcanumLevel) { this.#arcanumMap[arcanumLevel.getCode()] = arcanumLevel; }

  getGnosisMap() { return this.#gnosisMap; }
  getGnosis(code) { return this.#gnosisMap[code]; }
  hasGnosis(code) { return this.#gnosisMap[code] != null; }
  addGnosis(gnosisLevel) { this.#gnosisMap[gnosisLevel.getCode()] = gnosisLevel; }

  getPowerMap() { return this.#powerMap; }
  getPower(code) { return this.#powerMap[code]; }
  hasPower(code) { return this.#powerMap[code] != null; }
  addPower(powerLevel) { this.#powerMap[powerLevel.getCode()] = powerLevel; }

  getSkillMap() { return this.#skillMap; }
  getSkill(code) { return this.#skillMap[code]; }
  hasSkill(code) { return this.#skillMap[code] != null; }
  addSkill(skillLevel) { this.#skillMap[skillLevel.getCode()] = skillLevel; }

  // === Calculated Values =====================================================

  getBaseArmorClass() {
    return this.getSpecies().baseArmorClass;
  }

  getBaseHit() {
    let factor = {
      slowHitGrowth:   3.0,
      mediumHitGrowth: 1.5,
      fastHitGrowth:   1.0,
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

  save() { CharacterLibrary.saveCharacter(this); }
  pack() { return CharacterPacker.pack(this); }
  packForBattle() { return CharacterPacker.packForBattle(this); }
  packForStatus() { return CharacterPacker.packForStatus(this); }
  static unpack(data) { return CharacterPacker.unpack(data); }

  // === Abilities =============================================================

  getCooldown(abilityCode) { return this.#cooldownTable.get(abilityCode); }
  onBattleStart() { this.#cooldownTable = new CooldownTable(); }
  reduceCooldowns() { this.#cooldownTable.reduce(); }

  // Return a list of ability codes that the character has access too. This
  // needs to look in the power and gnosis levels because some abilities have
  // to be unlocked.
  getAbilities() {
    let abilities = []

    ObjectHelper.each(this.getGnosisMap(), (gnosisCode, gnosisLevel) => {
      gnosisLevel.getAbilityCodes().forEach(ability => { abilities.push(ability); });
    });

    ObjectHelper.each(this.getPowerMap(), (powerCode, powerLevel) => {
      abilities.push(powerLevel.getAbilityCode());
    });

    return ArrayHelper.compact(abilities);
  }

  getSpells() {
    let spells = []

    ObjectHelper.each(this.getArcanumMap(), (arcanumCode, arcanumLevel) => {
      arcanumLevel.getAbilityCodes().forEach(ability => { abilities.push(ability); });
    });

    return spells;
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

}
