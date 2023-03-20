global.CombatAction = class CombatAction {

  #actionType;
  #actionStory;

  #actorClassname;
  #actorItentifier;
  #targetType;
  #targetRank;
  #targetClassname;
  #targetIdentifier;

  #abilityCode;
  #mainMode;
  #offMode;

  constructor(options) {
    this.#actionType = options.action;
    this.#actorClassname = options.actorClassname;
    this.#actorItentifier = options.actorItentifier;

    if (options.targetType) { this.setTargetType(options.targetType); }
    if (options.targetRank) { this.setTargetRank(options.targetRank); }
    if (options.targetClassname) { this.setTargetClassname(options.targetClassname); }
    if (options.targetIdentifier) { this.setTargetIdentifier(options.targetIdentifier); }

    if (options.ability) { this.setAbilityCode(options.ability); }
    if (options.mainMode) { this.#mainMode = options.mainMode; }
    if (options.offMode) { this.#offMode = options.offMode; }
  }

  getActionType() { return this.#actionType; }
  isNothing() { return this.#actionType == _nothing; }
  isAttack() { return this.#actionType == _attack; }
  isAbility() { return this.#actionType == _ability; }

  getActorType() { return this.#actorClassname; }
  getActorIdentifier() { return this.#actorItentifier; }
  getActor() {
    return (this.#actorClassname == _monsterActor) ?
        GameState.getCurrentBattle().getMonster(this.#actorItentifier) :
        CharacterLibrary.getCachedCharacter(this.#targetIdentifier);
  }

  // === Targets ===============================================================

  getTargetType() { return this.#targetType; }
  getTargetRank() { return this.#targetRank; }
  getTargetIdentifier() { return this.#targetIdentifier; }
  setTargetClassname(classname) { this.#targetClassname = classname; }

  // Need to add an ability that targets a group to make sure that's
  // implemented correctly.
  getTarget() {
    if (this.#targetType == _single) {
      return (this.#targetClassname == _monsterActor) ?
          GameState.getCurrentBattle().getMonster(this.#targetIdentifier) :
          CharacterLibrary.getCachedCharacter(this.#targetIdentifier);
    }
    if (this.#targetType == _rank) {
      return this.#targetRank;
    }
    throw `TODO: Implement this target type: ${this.#targetType}`
  }

  setTargetType(type) {
    Validate.isIn('targetType',type, TargetTypes);
    this.#targetType = type;
  }

  setTargetRank(rank) {
    if (rank != null) { Validate.isIn('rank',rank, SquadRanks); }
    if (this.#targetIdentifier != null) { throw 'Target cannot have a rank if an identifier is set.'; }
    this.#targetRank = rank;
  }

  setTargetIdentifier(identifier) {
    if (this.#targetRank != null) { throw 'Target cannot have an identifier if a rank is set.'; }
    this.#targetIdentifier = identifier;
  }

  // === Attacks & Abilities ===================================================

  getAbility() { return Ability.lookup(this.#abilityCode); }
  setAbilityCode(code) {
    Ability.lookup(code);
    this.#abilityCode = code;
  }

  getMainMode() { return this.#mainMode; }
  setMainMode(mode) { this.#mainMode = mode; }

  getOffMode() { return this.#offMode; }
  setOffMode(mode) { this.#offMode = mode; }

  // ===========================================================================

  pack() {
    let packed = {
      actionType: this.#actionType,
      actorClassname: this.#actorClassname,
      actorItentifier: this.#actorItentifier,
      targetType: this.#targetType,
    };

    if (this.#targetRank)       { packed.targetRank = this.#targetRank; }
    if (this.#targetClassname)  { packed.targetClassname = this.#targetClassname; }
    if (this.#targetIdentifier) { packed.targetIdentifier = this.#targetIdentifier; }
    if (this.#abilityCode)      { packed.abilityCode = this.#abilityCode; }
    if (this.#mainMode)         { packed.mainMode = this.#mainMode; }
    if (this.#offMode)          { packed.offMode = this.#offMode; }
    if (this.#actionStory)      { packed.actionStory = this.#actionStory; }

    return packed;
  }

}