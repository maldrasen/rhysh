global.CharacterCombatRound = class CharacterCombatRound {

  #character;
  #action;
  #ability;
  #abilityTemplate;

  #combatResults;
  #triggers;

  constructor(character, action) {
    this.#character = character;
    this.#action = action;
    this.#combatResults = [];
    this.#triggers = [];
  }

  execute() {
    if (this.#action.isAttack()) { return this.doAttack(); }
    if (this.#action.isAbility()) { return this.doAbility(); }
    throw `Unhandled action type: ${this.#action.getActionType()}`;
  }

  getActor() { return this.#character; }
  getActorType() { return _character; }

  getCombatResults() { return this.#combatResults; }
  getTriggers() { return this.#triggers; }
  clearTriggers() { this.#triggers = []; }

  getCombatAction() { return this.#action; }

  getTarget() { return this.#action.getTarget(); }
  getTargetType() { return this.#action.getTargetType(); }
  getTargetIdentifier() { return this.#action.getTargetIdentifier(); }

  getAbilityCode() { return this.#action.getAbilityCode(); }
  getAbilityTemplate() { return this.#action.getAbilityTemplate(); }

  addTrigger(trigger) {
    if (this.#triggers.indexOf(trigger) < 0) { this.#triggers.push(trigger); }
  }

  doAttack() {
    this.determineAttackTarget();

    const mainMode = this.#action.getMainMode();
    const offMode = this.#action.getOffMode();
    const mainHand = this.#character.getMainHand();
    const offHand = this.#character.getOffHand();

    let hit = this.#character.getBaseHit();
    let result;

    while(hit >= 0) {
      result = null;

      if (mainMode) {
        result = this.doSingleAttack(hit, mainHand, mainMode);
      }
      if (offMode && hit-2 >= 0) {
        result = this.doSingleAttack(hit-2, offHand, offMode);
      }

      if (result == null) { return; } else {
        hit = (result.isCriticalMiss()) ? -1 : hit - 5;
        this.#combatResults.push(result);
      }
    }
  }

  doSingleAttack(hitBonus, weapon, mode) {
    let result = new CombatResult(this);
    result.setWeapon(weapon);
    result.setWeaponMode(mode);
    result.chooseTargetSlot();

    if (result.isWeaponAttackMode()) {
      result.rollAttack(hitBonus);
      result.rollDamage(weapon.damage, this.getTarget().getAttributes().strModifier());
      result.setStory(new WeaponAttackStoryTeller(result).tellStory());
    } else {
      result.useWeapon();
    }

    result.commitDamage();
    this.checkCondition();
    return result;
  }

  // TODO: Check condition. I think we need to add triggers for when monsters
  //       die or other things happen.
  checkCondition() {
    let condition = this.getTarget().getCondition();
  }

  // The first thing we need to do when executing an attack is determine the
  // specific monster we're attacking. The target in the battle orders will
  // only specify the monster rank, so this function should determine the
  // optimal monster in that rank to attack.
  //
  // TODO: If a character has "Battle Senses" have them pick the most injured
  //       monster in that rank. If they have "Improved Battle Senses" they
  //       prioritize picking a monster with status effects like prone. This
  //       will be complicated enough to offload onto a member I think.
  determineAttackTarget() {
    let battleState = GameState.getCurrentBattle();
    let monsters = battleState.getRank(this.#action.getTargetRank()).monsters;
    let monsterID = Random.from(monsters).getID();

    this.#action.setTargetType(_monster);
    this.#action.setTargetRank(null);
    this.#action.setTargetIdentifier(monsterID);
  }

  pack() {
    let packed = {
      character: this.#character.getCode(),
      action: this.#action.pack(),
      results: this.#combatResults.map(combatResult => { return combatResult.pack(); }),
    };

    if (this.#ability) { packed.ability = this.#ability.code; }
    if (this.#triggers) { packed.triggers = this.#triggers; }

    return packed;
  }

}
