global.MonsterCombatRound = class MonsterCombatRound {

  #actor;
  #action;
  #combatResults;
  #triggers;

  constructor(actor, action) {
    this.#actor = actor;
    this.#action = action;
    this.#combatResults = [];
    this.#triggers = [];
  }

  execute() {
    if (this.#action.isNothing()) { return; }
    if (this.#action.isAttack()) { return this.doAttack(); }
    if (this.#action.isAbility()) { return this.doAbility(); }
    throw `Unhandled action type: ${this.#action.getActionType()}`;
  }

  getActor() { return this.#actor; }
  getActorType() { return _monsterActor; }

  getCombatResults() { return this.#combatResults; }
  getTriggers() { return this.#triggers; }
  clearTriggers() { this.#triggers = []; }

  getCombatAction() { return this.#action; }
  getTarget() { return this.#action.getTarget(); }
  getTargetType() { return this.#action.getTargetType(); }
  getTargetIdentifier() { return this.#action.getTargetIdentifier(); }
  getAbility() { return this.#action.getAbility(); }

  addTrigger(trigger) {
    if (this.#triggers.indexOf(trigger) < 0) { this.#triggers.push(trigger); }
  }

  // TODO: Some abilities won't have a target.
  // TODO: Some abilities won't roll to hit.
  // TODO: Handle different ability types: attack, hold, coup-de-grace.
  doAbility() {
    let result = new CombatResult(this);
    let ability = this.getAbility();
    let monster = this.getActor();
    let hit = (ability.hitBonus || 0) + monster.getBaseHit();

    monster.useAbility(ability.code);

    result.chooseTargetSlot(ability.targetSlot);
    result.rollAttack(hit);
    result.rollDamage(ability.damage);
    result.updateCondition();
    result.updateStatus();
    result.selectStory();
    result.commitDamage();

    this.#combatResults.push(result);
    this.checkCondition();
  }

  checkCondition() {
    let target = this.getTarget();
    let condition = target.getCondition();

    if (target.getCode() == 'Main') {
      if (condition.hasCondition('fainted')) { this.addTrigger('main-character-fainted'); }
      if (condition.hasCondition('dead')) { this.addTrigger('main-character-killed'); }
    }
  }

}
