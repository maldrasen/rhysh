global.DeterminesTarget = (function() {

  // This class is only valid for Characters. Monsters have a different, threat
  // based method for determining their targets.
  //
  // The first thing we need to do when creating the CharacterCombatRound is
  // determine the target of the action. If the target is obvious (such as a
  // short ranged attack) this will be null. If a character attacks with an
  // extended weapon or uses a long range ability the target will be a given
  // squad of monsters. It's possible for an ability to target party members or
  // self as well.
  //
  // If we're targeting a rank of monsters we check to see if the monster we
  // targeted last round is in that rank. If so we attack the same monster.
  // If we don't have a previous monster or that monster is dead we choose one
  // at random.
  //
  // Using an area of effect ability, or an ability that doesn't target a
  // monster should clear the previous target.
  function determineTarget(round, action) {
    console.log("=== Determine Target ===");
    console.log("Action:",action.pack())

    let character = round.getActor();
    let previousTarget = GameState.getCurrentBattle().getCharacterTarget(character.getCode());
    let target = new Target(action.getTargetType());

    // We know we're targeting a single monster.
    if (target.getType() == 'monster') {
      if (previousTargetValid(previousTarget)) { return previousTarget; }

      // Target doesn't know rank... But the action should

    }

    throw `TODO: [DeterminesTarget] Implement other target types.`
  }

  // If this is a melee attack the target type should always be a single
  // monster. If the action is an ability then we can get the target type from
  // the ability template.
  function determineTargetType(action) {
    if (action.action == 'attack') { return 'monster' }
    throw `TODO: [DeterminesTarget] Figure out the target for this ability.`
  }

  // Target is no longer valid if dead or fainted.
  function previousTargetValid(monster) {
    if (monster == null) { return false; }
    if (monster.getCondition().hasCondition('dead')) { return false; }
    if (monster.getCondition().hasCondition('fainted')) { return false; }
    return true;
  }

  return { determineTarget };

})();