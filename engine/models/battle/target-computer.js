global.TargetComputer = class TargetComputer {

  #combatRound;

  constructor(combatRound) {
    this.#combatRound = combatRound;
  }

  getAction() { return this.#combatRound.getAction(); }

  // Depending on the current battle conditions the target may have changed
  // since the orders were given. If the current target isn't valid a new
  // target should be selected.
  updateTarget() {
    let action = this.getAction();

    // TODO: Check to see if target is still valid.

    if (action.isAttack() && action.getTargetType() == _rank) { return this.targetMonsterInRank(); }
  }

  // If the action is still targeting a monster rank we need to change it to an
  // actual monster. It's possible when this runs that the targeted rank won't
  // have a single monster left alive in which case we need to select the
  // closest rank to attack instead.
  targetMonsterInRank() {
    console.log("TODO: Update Target");
  }

}
