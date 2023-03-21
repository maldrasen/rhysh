global.CombatRound = class CombatRound {

  #action;
  #result;

  #actionStory;
  #triggers;

  constructor(actor, action) {
    this.#action = action;
    this.#result = new CombatResult(this);
    this.#triggers = [];
  }

  getAction() { return this.#action; }
  getResult() { return this.#result; }

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
    const action = this.getAction();
    const actor = action.getActor();
    const mainHand = actor.getMainHand();
    const offHand = actor.getOffHand();
    const offHandPenalty = actor.getOffHandAttackPenalty();

    let hit = actor.getBaseHit();
    let mainMode = action.getMainMode();
    let offMode = action.getOffMode();

    if (mainHand && mainMode == null) { mainMode = mainHand.getRandomMode() }
    if (offHand && offMode == null) { offMode = offHand.getRandomMode() }

    while(hit >= 0 && this.#result.canContinueAttacking()) {
      if (mainMode) { this.doSingleAttack(hit, mainHand, mainMode); }
      if (offMode && offHand.isWeapon()) { this.doSingleAttack(hit + offHandPenalty, offHand, offMode); }
      hit = hit - 5;
    }
  }

  doSingleAttack(hit, weapon, mode) {
    console.log("Do single attack",hit,weapon.getWeaponTypeCode(),mode);
  }

  doAbility() {

  }

  // ===========================================================================

  pack() {
    let packed = {
      action: this.#action.pack(),
      actionStory: this.#actionStory,
    };
    if (this.#triggers.length > 0) { packed.triggers = this.#triggers; }
    return packed;
  }

}