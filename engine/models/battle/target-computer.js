global.TargetComputer = class TargetComputer {

  #combatRound;

  constructor(combatRound) {
    this.#combatRound = combatRound;
  }

  getAction() { return this.#combatRound.getAction(); }

  // Depending on the current battle conditions the target may have changed
  // since the orders were given. If the current target isn't valid a new
  // target should be selected.
  //
  // TODO: Check to see if target is still valid. Change to a new target if not
  //
  updateTarget() {
    let action = this.getAction();

    if (action.isAttack() && action.getTargetType() == _rank) {
      return this.targetMonsterInRank();
    }
  }

  // The target in the battle orders will only specify the monster rank, so if
  // the action is still targeting a monster rank we need to change it to an
  // actual monster.
  //
  // TODO: This function should determine the optimal monster in that rank to
  //       attack rather than picking one at random. I think I'll have that
  //       functionality be a gnosis ability though. If a character has
  //       "Battle Senses" have them pick the most injured monster in that
  //       rank. If they have "Improved Battle Senses" they prioritize picking
  //       a monster with status effects like prone.
  //
  // TODO: It's possible when this runs that the targeted rank won't have a
  //       single monster left alive in which case we need to select the
  //       closest rank to attack instead. The BattleState should keep track of
  //       which ranks are still active.
  //
  targetMonsterInRank() {
    let action = this.getAction();
    let battleState = GameState.getCurrentBattle();
    let monsters = battleState.getRank(action.getTargetRank()).monsters;
    let monsterID = Random.from(monsters).getID();

    action.setTargetType(_single);
    action.setTargetRank(null);
    action.setTargetIdentifier(monsterID);
  }

}
