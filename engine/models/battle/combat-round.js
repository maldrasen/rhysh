global.CombatRound = class CombatRound {

  #action;

  #actionStory;
  #triggers;

  constructor(actor, action) {
    this.#action = action;
    this.#triggers = [];
  }

  getAction() { return this.#action; }

  getActionStory() { return this.#actionStory; }
  setActionStory(story) { this.#actionStory = story; }

  getTriggers() { return this.#triggers; }
  addTrigger(trigger) { this.#triggers.push(trigger); }

  execute() {
    // TODO: If all monsters are dead then we do nothing.

    new InterruptComputer(this).checkForInterrupt();
    new TargetComputer(this).updateTarget();

    if (this.#action.isNothing()) { return; }
    if (this.#action.isAttack()) { return this.doAttack(); }
    if (this.#action.isAbility()) { return this.doAbility(); }
    throw `Unhandled action type: ${this.#action.getActionType()}`;
  }

  doAttack() {

  }

  doAbility() {

  }

  pack() {
    let packed = {
      action: this.#action.pack(),
      actionStory: this.#actionStory,
    };
    if (this.#triggers.length > 0) { packed.triggers = this.#triggers; }
    return packed;
  }

}