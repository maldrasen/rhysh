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

    if (this.#targetType == null) {
      if (this.isNothing()) { this.setTargetType(_none); }
      if (this.isAbility()) { this.setTargetType(this.getAbility().targetType || _single); }
    }

    if (this.#targetType == null) { console.trace(); throw `Target type should have been set.` }
  }

  getActionType() { return this.#actionType; }
  isNothing() { return this.#actionType == _nothing; }
  isAttack() { return this.#actionType == _attack; }
  isAbility() { return this.#actionType == _ability; }

  // === Actors ================================================================

  getActorType() { return this.#actorClassname; }
  getActorIdentifier() { return this.#actorItentifier; }
  getActor() {
    return (this.isMonster()) ?
        GameState.getCurrentBattle().getMonster(this.#actorItentifier) :
        CharacterLibrary.getCachedCharacter(this.#actorItentifier);
  }

  isMonster() {
    if (this.#actorClassname == null) { throw `Actor classname is null`; }
    return this.#actorClassname == _monsterActor;
  }

  isCharacter() {
    if (this.#actorClassname == null) { throw `Actor classname is null`; }
    return this.#actorClassname == _characterActor;
  }

  // === Targets ===============================================================

  getTargetType() { return this.#targetType; }
  getTargetRank() { return this.#targetRank; }
  getTargetIdentifier() { return this.#targetIdentifier; }
  getTargetClassname() { return this.#targetClassname; }
  setTargetClassname(classname) { this.#targetClassname = classname; }

  // Need to add an ability that targets a group to make sure that's
  // implemented correctly.
  getTarget() {
    if (this.#targetType == _rank) { return this.#targetRank; }
    if (this.#targetType == _self) { return this.getActor(); }

    if (this.#targetType == _single) {
      return (this.#targetClassname == _monsterActor) ?
          GameState.getCurrentBattle().getMonster(this.#targetIdentifier) :
          CharacterLibrary.getCachedCharacter(this.#targetIdentifier);
    }

    throw `TODO: Implement this target type: ${this.#targetType}`
  }

  isTargetMonster() {
    if (this.#targetClassname == null) { throw `Target classname is null`; }
    return this.#targetClassname == _monsterActor;
  }

  isTargetCharacter() {
    if (this.#targetClassname == null) { throw `Target classname is null`; }
    return this.#targetClassname == _characterActor;
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

  getAbilityCode() { return this.#abilityCode; }
  getAbility() { return Ability.lookup(this.#abilityCode); }

  getAbilityLevel() {
    let ability = this.getAbility();
    if (this.isMonster()) { return null; }
    if (ability.fromPower) { return this.getActor().getPower(ability.code); }
    if (ability.fromGnosis) { return this.getActor().getGnosis(ability.code); }
  }

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