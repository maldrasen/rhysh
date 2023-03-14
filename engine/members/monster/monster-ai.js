global.MonsterAI = (function() {

  let $currentRange;
  let $monster;

  // TODO: This needs to take condition into consideration. If a monster is
  //       prone for instance their action will be to get up. Some statuses
  //       randomly effect a character's actions too.
  function chooseCombatAction(monster) {
    $monster = monster;
    $currentRange = GameState.getCurrentBattle().getMonsterRange($monster.getID());


    chooseTarget();

    let availableAbilities = getAvailableAbilities();
    let canAttack = canAttackWithWeapon()

    // If they have no attacks or abilities that are off cooldown or are
    // currently in range, then there's nothing they can do.
    if (canAttack == false && availableAbilities.length == 0) {
      return new CombatAction({ action:_nothing, targetType:_none });
    }

    // Ability can be null here if they can make a regular melee attack, but
    // have no other available abilities.
    let ability = Random.from(availableAbilities);
    if (canAttack == false || Random.roll(100) < $monster.getAbilityChance()) {
      if (ability != null) {
        return new CombatAction({
          action: _ability,
          ability: ability.code,
          targetType: (AbilityDictionary.lookup(ability.code).targetType || _character),
        });
      }
    }

    return new CombatAction({
      action: _attack,
      targetType: _character,
    });
  }

  function buildAbilityAction(code) {
  }

  function getAvailableAbilities() {
    let available = [];

    let scrutinizer = new Scrutinizer(new Context({
      actor: $monster,
      target: $monster.getTarget().getActor(),
    }));

    $monster.getAbilities().forEach(ability => {
      if ($monster.isAbilityOnCooldown(ability.code) == false) {
        let template = AbilityDictionary.lookup(ability.code);
        let abilityRange = template.range || 'close';

        if (abilityInRange(abilityRange) && scrutinizer.meetsRequirements(template.requires)) {
          available.push(ability);
        }
      }
    });

    return available;
  }

  function canAttackWithWeapon(currentRange) {
    let mainHand = $monster.getMainHand();
    return mainHand ? abilityInRange(WeaponDictionary.lookup(mainHand).range) : false;
  }

  function abilityInRange(abilityRange) {
    if (abilityRange == 'close') { return $currentRange == _close; }
    if (abilityRange == 'extended') { return [_close,_extended].indexOf($currentRange) >= 0; }
    return true
  }

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
  //
  // This should always pick a character to target, even it they end up using
  // an area of effect ability or something that doesn't hit the characters at
  // all.

  function chooseTarget(monster) {
    let target = $monster.getTarget();

    if (target == null) {
      let roll = Random.roll(20) + $monster.getAttributes().intModifier();
      if (roll < 5) { target = chooseRandomTarget(); }
      if (roll < 10) { target = chooseMostHatedTarget(); }
      if (roll < 15) { target = chooseMostVulnerableTarget(); }
      target = chooseMostDangerousTarget();
    }

    // Temp, until we actually implement this.
    $monster.setTarget(new Target(_character,'Main'));
  }

  function chooseRandomTarget() {} // Pick randomly.
  function chooseMostHatedTarget() {} // Pick whoever has the most threat
  function chooseMostVulnerableTarget() {} // Pick whoever has the lowest armor or worse status
  function chooseMostDangerousTarget() {} // TODO: Need to keep track of who's done the most damage this fight.

  return {
    chooseCombatAction
  };

})();