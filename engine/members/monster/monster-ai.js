global.MonsterAI = (function() {

  let $currentRange;
  let $monster;
  let $targetCode;

  // TODO: This needs to take condition into consideration. If a monster is
  //       prone for instance their action will be to get up. Some statuses
  //       randomly effect a character's actions too.
  function chooseCombatAction(monster) {
    $currentRange = GameState.getCurrentBattle().getMonsterRange(monster.getID());
    $monster = monster;

    chooseTarget();

    let availableAbilities = getAvailableAbilities();
    let canAttack = canAttackWithWeapon()

    // If they have no attacks or abilities that are off cooldown or are
    // currently in range, then there's nothing they can do.
    if (canAttack == false && availableAbilities.length == 0) {
      return new CombatAction({
        action:_nothing,
        actorClassname: _monsterActor,
        actorItentifier: $monster.getID(),
        targetType:_none
      });
    }

    // Ability can be null here if they can make a regular melee attack, but
    // have no other available abilities.
    let ability = Random.from(availableAbilities);
    if (canAttack == false || Random.roll(100) < $monster.getAbilityChance()) {
      if (ability != null) { return buildAbilityAction(ability); }
    }

    return new CombatAction({
      action: _attack,
      actorClassname: _monsterActor,
      actorItentifier: $monster.getID(),
      targetType: _single,
      targetIdentifier: $targetCode,
    });
  }

  function buildAbilityAction(abilityCode) {
    let template = Ability.lookup(abilityCode);
    let targetType = template.targetType || _single;

    let action = new CombatAction({
      action: _ability,
      actorClassname: _monsterActor,
      actorItentifier: $monster.getID(),
      ability: abilityCode,
      targetType: targetType,
    });

    if (targetType == _single) {
      action.setTargetIdentifier($targetCode);
    }

    return action;
  }

  function getAvailableAbilities() {
    let available = [];
    let target = CharacterLibrary.getCachedCharacter($targetCode);

    let scrutinizer = new Scrutinizer(new Context({
      actor: $monster,
      target: target,
    }));

    $monster.getAbilities().forEach(ability => {
      if ($monster.isAbilityOnCooldown(ability) == false) {
        let template = Ability.lookup(ability);
        let abilityRange = template.range || 'close';

        if (abilityInRange(abilityRange) && scrutinizer.meetsRequirements(template.requires)) {
          available.push(ability);
        }
      }
    });

    return available;
  }

  function canAttackWithWeapon(currentRange) {
    let mainHand = $monster.getMainHandCode();
    return mainHand ? abilityInRange(WeaponType.lookup(mainHand).range) : false;
  }

  function abilityInRange(abilityRange) {
    if (abilityRange == 'close') { return $currentRange == _close; }
    if (abilityRange == 'extended') { return [_close,_extended].indexOf($currentRange) >= 0; }
    return true
  }

  // Some methods of selecting a target are more intelligent than others so an
  // int bonus will help the monster pick a better strategy. This should always
  // pick a character to target, even it they end up using an area of effect
  // ability or something that doesn't hit the characters at all.

  function chooseTarget(monster) {

    // TODO: This is all well and good, but for now we only have a single
    //       character, so the target will always be the main character. We can
    //       look into implementing all this once we have a few party members.
    $targetCode = 'Main';
    return;

    let roll = Random.roll(20) + $monster.getAttributes().intModifier();
    if (roll < 5) { target = chooseRandomTarget(); }
    if (roll < 10) { target = chooseMostHatedTarget(); }
    if (roll < 15) { target = chooseMostVulnerableTarget(); }
    target = chooseMostDangerousTarget();
  }

  function chooseRandomTarget() {} // Pick randomly.
  function chooseMostHatedTarget() {} // Pick whoever has the most threat
  function chooseMostVulnerableTarget() {} // Pick whoever has the lowest armor or worse status
  function chooseMostDangerousTarget() {} // TODO: Need to keep track of who's done the most damage this fight.

  return {
    chooseCombatAction
  };

})();