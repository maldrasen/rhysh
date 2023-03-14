global.CombatAction = class CombatAction {

  #actionType;
  #targetType;
  #targetRank;
  #targetIdentifier;
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
      if (this.#actionType == _attack) { this.#targetType = _monster; }
      if (this.#actionType == _ability) { throw `An ability should know it's targetType.` }
    }

    if (this.#targetRank == null) {
      if (this.#targetType == _monster) { this.#targetRank = _rank_1; }
      if (this.#targetType == _rank) { throw `A target rank should have been set.` }
    }

    Validate.isIn(this.#actionType, ActionTypes);
    Validate.isIn(this.#targetType, TargetTypes);
  }

  getActionType() { return this.#actionType; }
  isNothing() { return this.#actionType == _nothing; }
  isAttack() { return this.#actionType == _attack; }
  isAbility() { return this.#actionType == _ability; }

  // === Targets ===============================================================

  getTargetType() { return this.#targetType; }
  getTargetRank() { return this.#targetRank; }
  getTargetIdentifier() { return this.#targetIdentifier; }

  isSingleTarget() { return [_monster,_character].indexOf(this.#targetType) >= 0; }
  targetsCharacters() { return [_party,_character,_everyone].indexOf(this.#targetType) >= 0; }
  targetsMonsters() { return [_monster,_rank,_allMonsters,_everyone].indexOf(this.#targetType) >= 0; }

  setTargetRank(rank) {
    if (rank != null) { Validate.isIn(rank, SquadRanks); }
    if (this.#targetIdentifier != null) { throw 'Target cannot have a rank if an identifier is set.'; }
    this.#targetRank = rank;
  }

  setTargetIdentifier(identifier) {
    if (this.#targetRank != null) { throw 'Target cannot have an identifier if a rank is set.'; }
    this.#targetIdentifier = identifier;
  }

  getTarget() {
    if (this.#targetType == _character) {
      return CharacterLibrary.getCachedCharacter(this.#targetIdentifier);
    }
    if (this.#targetType == _monster) {
      return GameState.getCurrentBattle().getMonster(this.#targetIdentifier);
    }
  }

  // === Attacks & Abilities ===================================================


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