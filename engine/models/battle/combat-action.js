global.CombatAction = class CombatAction {

  #actionType;
  #targetType;
  #targetRank;
  #abilityCode;

  #mainMode;
  #offMode;

  constructor(options) {
    this.#actionType = options.action;

    if (options.targetType) { this.#targetType = options.targetType; }
    if (options.targetRank) { this.#targetRank = options.targetRank; }
    if (options.ability)    { this.#abilityCode = options.ability; }
    if (options.mainMode)   { this.#mainMode = options.mainMode; }
    if (options.offMode)    { this.#offMode = options.offMode; }

    if (this.#targetType == null) {
      if (this.#actionType == 'attack') { this.#targetType = 'monster'; }
    }

    Validate.isIn(this.#targetType, TargetTypes);
  }

  getActionType() { return this.#actionType; }
  getTargetType() { return this.#targetType; }
  getTargetRank() { return this.#targetRank; }

  getAbilityCode() { return this.#abilityCode; }
  getAbilityTemplate() { return AbilityDictionary.lookup(this.#abilityCode); }

  getMainMode() { return this.#mainMode; }
  getOffMode() { return this.#offMode; }

  // Make any character specific adjustments needed for the action. Right now
  // this is just resetting the weapon modes if they're set to random. (which
  // only happens in the tests I think) This might need to make other
  // adjustments later though.
  adjustForCharacter(code) {
    let character = CharacterLibrary.getCachedCharacter(code);
    let mainHand = character.getMainHand();
    let offHand = character.getOffHand();

    if (this.#mainMode == 'random') {
      this.#mainMode = (mainHand && mainHand.isWeapon()) ? Random.from(mainHand.getModes()) : null;
    }
    if (this.#offMode == 'random') {
      this.#offMode = (offHand && offHand.isWeapon()) ? Random.from(offHand.getModes()) : null;
    }
  }

  pack() {
    let packed = {
      actionType: this.#actionType,
      targetType: this.#targetType,
    };

    if (this.#targetRank)  { packed.targetRank = this.#targetRank; }
    if (this.#abilityCode) { packed.abilityCode = this.#abilityCode; }
    if (this.#mainMode)    { packed.mainMode = this.#mainMode; }
    if (this.#offMode)     { packed.offMode = this.#offMode; }

    return packed;
  }

}