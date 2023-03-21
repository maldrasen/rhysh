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
  getActorType() { return _characterActor; }

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

  // TODO: Check condition. I think we need to add triggers for when monsters
  //       die or other things happen.
  checkCondition() {
    let condition = this.getTarget().getCondition();
  }

}
