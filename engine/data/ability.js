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
  #icon;

  #uses;
  #range;
  #targetType;
  #targetSlot;
  #hitBonus;
  #damage;
  #cooldown;
  #requires;
  #setCondition;
  #addStatus;
  #savingThrow;

  #stories;
  #storyTeller;

  constructor(code, options) {
    if (options.range == null && this.shouldHaveRangeSet(options.type)) { options.range = _close; }

    this.#code = code;
    this.#type = options.type;
    this.#name = options.name;
    this.#icon = options.icon;

    this.#uses = options.uses || [];
    this.#range = options.range;
    this.#targetType = options.targetType;
    this.#targetSlot = options.targetSlot;
    this.#hitBonus = options.hitBonus;
    this.#damage = options.damage;
    this.#cooldown = options.cooldown;
    this.#requires = options.requires;
    this.#setCondition = options.setCondition;
    this.#addStatus = options.addStatus;
    this.#savingThrow = options.savingThrow;

    this.#stories = [];
    this.#storyTeller = options.storyTeller;
  }

  get code() { return this.#code; }
  get type() { return this.#type; }
  get name() { return this.#name; }

  get uses() { return this.#uses; }
  get range() { return this.#range; }
  get targetType() { return this.#targetType; }
  get targetSlot() { return this.#targetSlot; }
  get hitBonus() { return this.#hitBonus; }
  get damage() { return this.#damage; }
  get cooldown() { return this.#cooldown; }
  get requires() { return this.#requires; }
  get setCondition() { return this.#setCondition; }
  get addStatus() { return this.#addStatus; }
  get savingThrow() { return this.#savingThrow; }

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

  pack() {
    let packed = {
      code: this.#code,
      type: this.#type,
      uses: this.#uses,
    };

    if (this.#name) { packed.name = this.#name; }
    if (this.#range) { packed.range = this.#range; }
    if (this.#targetType) { packed.targetType = this.#targetType; }
    if (this.#targetSlot) { packed.targetSlot = this.#targetSlot; }
    if (this.#hitBonus) { packed.hitBonus = this.#hitBonus; }
    if (this.#damage) { packed.damage = this.#damage; }
    if (this.#cooldown) { packed.cooldown = this.#cooldown; }
    if (this.#requires) { packed.requires = this.#requires; }
    if (this.#setCondition) { packed.setCondition = this.#setCondition; }
    if (this.#addStatus) { packed.addStatus = this.#addStatus; }
    if (this.#savingThrow) { packed.savingThrow = this.#savingThrow; }

    return packed;
  }

}
