global.CombatResult = class CombatResult {

  #combatRound;

  #actionStory;
  #combatEvents;

  constructor(round) {
    this.#combatRound = round;
    this.#combatEvents = [];
  }

  getActionStory() { return this.#actionStory; }
  setActionStory(text) { this.#actionStory = Weaver.weave(text, this.getContext()); }

  hasCombatEvents() { return this.#combatEvents.length > 0; }
  getCombatEvents() { return this.#combatEvents; }
  addCombatEvent(event) { this.#combatEvents.push(event); }

  // Fixme: These old properties may not work now that this class is completely
  //        different.
  //
  // combatResult: this,
  // combatRound: this.#combatRound,
  //
  getContext() {
    return new Context({
      actor: this.#combatRound.getActor(),
      target: this.#combatRound.getTarget(),
    });
  }

  // TODO: If the target dies or the attacker critically fails then they stop
  //       attacking.
  canContinueAttacking() {
    return true;
  }

  // ===========================================================================

  pack() {
    let packed = {};

    if (this.#actionStory) { packed.actionStory = this.#actionStory; }

    if (this.#combatEvents.length > 0) {
      packed.combatEvents = this.#combatEvents.map(event => { return event.pack(); })
    }

    return packed;
  }

}
