global.MonsterTarget = (function() {

  // TODO: This is all well and good, but for now we only have a single
  //       character, so the target will always be the main character. We can
  //       look into implementing all this once we have a few party members.
  //
  // Normally we want to return whoever the monster was targeting last turn.
  // However, if the current target cannot be attacked clear the target and
  // pick a new one.
  //
  // If another character is at least 50% higher on the threat table than the
  // current target should switch to that target.
  //
  // Otherwise we need to pick another target. Some methods of selecting a
  // target are more intelligent than others so a int bonus will help picking
  // a better strategy.

  function chooseTarget(monster) {
    let target = monster.getTarget();

    if (target == null) {
      let roll = Random.roll(20) + monster.getAttributes().intModifier();
      let strategy = 'random';

      if (roll < 10) { target = chooseRandomTarget(); }
      if (roll < 15) { target = chooseMostVulnerableTarget(); }

      target = chooseMostDangerousTarget();
    }

    // Temp, until we actually implement this.
    monster.setTarget('Main')
  }

  function chooseRandomTarget() {} // Pick randomly.
  function chooseMostVulnerableTarget() {} // Pick whoever has the lowest armor.
  function chooseMostDangerousTarget() {} // TODO: Need to keep track of who's done the most damage this fight.

  return { chooseTarget };

})();


