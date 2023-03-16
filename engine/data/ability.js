const AbilityDictionary = {}

global.Ability = class Ability {

  static register(ability) {
    AbilityDictionary[ability.code] = ability;
  }

  static lookup(code) {
    if (AbilityDictionary[code] == null) { console.trace(); throw `Unknown Ability (${code})` }
    return AbilityDictionary[code];
  }

  #code;
  #type;
  #name;

  #range;
  #targetType;
  #targetSlot;
  #hitBonus;
  #damage;
  #cooldown;
  #requires;
  #setCondition;
  #addStatus;

  #stories;
  #storyTeller;

  constructor(options) {
    if (options.range == null && this.shouldHaveRangeSet(options.type)) { options.range = _close; }

    this.#code = options.code;
    this.#type = options.type;
    this.#name = options.name;

    this.#range = options.range;
    this.#targetType = options.targetType;
    this.#targetSlot = options.targetSlot;
    this.#hitBonus = options.hitBonus;
    this.#damage = options.damage;
    this.#cooldown = options.cooldown;
    this.#requires = options.requires;
    this.#setCondition = options.setCondition;
    this.#addStatus = options.addStatus;

    this.#stories = [];
    this.#storyTeller = options.storyTeller;

    this.validate();
  }

  get code() { return this.#code; }
  get type() { return this.#type; }
  get name() { return this.#name; }

  get range() { return this.#range; }
  get targetType() { return this.#targetType; }
  get targetSlot() { return this.#targetSlot; }
  get hitBonus() { return this.#hitBonus; }
  get damage() { return this.#damage; }
  get cooldown() { return this.#cooldown; }
  get requires() { return this.#requires; }
  get setCondition() { return this.#setCondition; }
  get addStatus() { return this.#addStatus; }

  get stories() { return this.#stories; }
  get storyTeller() { return this.#storyTeller; }

  addStory(story) {
    this.#stories.push(story);
  }

  // Ability types that use the attack range. We keep track of these because if
  // a range isn't specified we use close range by default. This isn't a normal
  // default value though because some abilities don't have ranges.
  shouldHaveRangeSet(type) {
    return ArrayHelper.contains([_attack,_grapple,_coupDeGrace], type);
  }

  validate() {
    try {
      Validate.isIn('abilityType',this.type, AbilityTypes);
      if (this.range) { Validate.isIn('range',this.range, [_close,_extended,_long]); }
      if (this.targetSlot) { Validate.isIn('targetSlot',this.targetSlot, ArmorSlots); }
      if (this.setCondition) { this.validateSetCondition(); }
      if (this.addStatus) { this.validateAddStatus(); }
    } catch(error) {
      console.error(`Ability(${this.code}) [${error}]`);
    }
  }

  // Validate both the condition and the condition target (on value).
  validateSetCondition() {
    ConditionDictionary.lookup(this.setCondition.condition);
    Validate.isIn('setCondition.on',this.setCondition.on, [_self,_single]);
    Validate.isIn('setCondition.when',this.setCondition.when, [_always,_success,_failure]);
  }

  // Validate both the status and the status target (on value).
  // addStatus can also have a duration set. If duration is null the status is
  // valid until something removes it.
  validateAddStatus() {
    StatusDictionary.lookup(this.addStatus.status);
    Validate.isIn('setStatus.on',this.addStatus.on, [_self,_single,_rank,_allMonsters,_allCharacters,_everyone]);
  }

}
