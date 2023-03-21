global.CombatResult = class CombatResult {

  #combatRound;
  #attackEvents;

  #actionStory;

  constructor(round) {
    this.#combatRound = round
    this.#attackEvents = [];
  }

  setActionStory(text) {
    this.#actionStory = Weaver.weave(text, this.getContext());
  }

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

    if (this.#attackEvents.length > 0) {
      packed.attackEvents = this.#attackEvents.map(event => { return event.pack(); })
    }

    return packed;
  }

}
