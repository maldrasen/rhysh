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

    if (options.targetType) { this.setTargetType(options.targetType); }
    if (options.targetRank) { this.setTargetRank(options.targetRank); }
    if (options.targetIdentifier) { this.setTargetIdentifier(options.targetIdentifier); }
    if (options.ability) { this.setAbilityCode(options.ability); }
    if (options.mainMode) { this.#mainMode = options.mainMode; }
    if (options.offMode) { this.#offMode = options.offMode; }
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

  getTarget() {
    if (this.#targetIdentifier == null) { throw `A target identifier has not been set.`; }
    if (this.#targetIdentifier == 'Main') { return CharacterLibrary.getMainCharacter(); }
    // if (this.#targetType == ) { return CharacterLibrary.getCachedCharacter(this.#targetIdentifier); }
    // if (this.#targetType == )   { return GameState.getCurrentBattle().getMonster(this.#targetIdentifier); }
    throw `TODO: Lookup ${this.#targetIdentifier}`;
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
  getOffMode() { return this.#offMode; }

  // Make any character specific adjustments needed for the action. When a
  // character is attacking with a short range weapon they don't need to
  // specify that they're targeting the front rank, but the battle engine does
  // need to know that.
  adjustForCharacter(code) {
    let character = CharacterLibrary.getCachedCharacter(code);
    let mainHand = character.getMainHand();
    let offHand = character.getOffHand();

    if (this.#actionType == _attack) {
      if (this.#targetType == null) { this.#targetType = _rank }
      if (this.#targetRank == null) { this.#targetRank = _rank_1 }

      if (this.#mainMode == 'random') {
        this.#mainMode = (mainHand && mainHand.isWeapon()) ? Random.from(mainHand.getModes()) : null;
      }
      if (this.#offMode == 'random') {
        this.#offMode = (offHand && offHand.isWeapon()) ? Random.from(offHand.getModes()) : null;
      }
    }
  }

  pack() {
    let packed = {
      actionType: this.#actionType,
      targetType: this.#targetType,
    };

    if (this.#targetRank)       { packed.targetRank = this.#targetRank; }
    if (this.#targetIdentifier) { packed.targetIdentifier = this.#targetIdentifier; }
    if (this.#abilityCode)      { packed.abilityCode = this.#abilityCode; }
    if (this.#mainMode)         { packed.mainMode = this.#mainMode; }
    if (this.#offMode)          { packed.offMode = this.#offMode; }

    return packed;
  }

}