global.CombatResult = class CombatResult {

  #combatRound;

  #actionStory;
  #combatEvents;

  constructor(round) {
    this.#combatRound = round;
    this.#combatEvents = [];
  }

  getCombatRound() { return this.#combatRound; }
  getActionStory() { return this.#actionStory; }
  setActionStory(text) { this.#actionStory = Weaver.weave(text, this.getContext()); }

  hasCombatEvents() { return this.#combatEvents.length > 0; }
  getCombatEvents() { return this.#combatEvents; }
  addCombatEvent(event) { this.#combatEvents.push(event); }

  // The context will only have a target if this is a single target action.
  getContext() {
    const round = this.getCombatRound();
    const action = round.getAction();
    const context = new Context({ actor:round.getActor() });

    if (action.isSingleTarget()) {
      context.set('target',round.getTarget());
    }

    return context;
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
