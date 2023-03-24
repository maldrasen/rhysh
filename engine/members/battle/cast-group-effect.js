global.CastGroupEffect = (function() {

  let $action;
  let $actor;
  let $result;
  let $ability;
  let $abilityLevel;
  let $context;
  let $event;

  function execute(combatRound) {
    $action = combatRound.getAction();
    $actor = combatRound.getActor();
    $result = combatRound.getResult();
    $ability = $action.getAbility();
    $abilityLevel = $action.getAbilityLevel();
    $context = $result.getContext();

    $event = new CombatEvent({
      ability: $ability,
      abilityLevel: $abilityLevel,
    });

    $event.setActionStory(AbilityStoryTeller.tellActionStory({
      context: $context,
      ability: $ability,
      abilityLevel: $abilityLevel,
    }));

    if ($action.getTargetType() == _allMonsters) {
      let monsters = GameState.getCurrentBattle().getMonsters();
      let targetsEffected = [];

      ObjectHelper.each(monsters, (id, monster) => {
        let effect = resolveTarget(monster, { id:monster.getID() });
        if (effect) {
          targetsEffected.push(effect);
        }
      });

      $event.setGroupEffects({
        targetType: _allMonsters,
        targetsEffected: targetsEffected,
        totalTargets: Object.keys(monsters).length,
      });
    }

    $result.addCombatEvent($event);
  }

  // TODO: While an actor who has been taken out of the fight cannot be
  //       targeted directly anymore, they can still take damage and get
  //       killed by AoE effects, both monsters and players. I think they they
  //       should be immune to most status effects though. That might be up to
  //       the condition to figure out though. When we try to set a status we
  //       can check the condition. If they've fainted, they can't be
  //       enraptured, but they could still be grappled or poisoned, at least
  //       until they die.
  //
  // TODO: Saving throws are assuming that an ability will do damage or cause
  //       a status effect, but some will do both. In that case should a passed
  //       saving throw should both prevent the status and all damage? I'm
  //       thinking something like "poison bomb" where the damage and status
  //       would go together. It's possible though that some abilities will
  //       primarily do damage, with the status effect as being optional.
  //
  // TODO: Normal damage save effect is to halve damage, but there might be
  //       abilities that quarter or prevent all damage on save. An anti-magic
  //       spell might do the same.
  //
  function resolveTarget(target, targetInfo) {
    if (target.hasCondition(_dead)) { return; }

    const saveResult = $ability.savingThrow ? target.rollSavingThrow($ability.savingThrow) : null;
    if (saveResult && saveResult.result == _savePassed) {
      if ($ability.isStatusAbility()) { return; }
      if ($ability.isConditionAbility()) { return; }
      if ($ability.isDamageAbility()) { throw `Handle passed damage ability saving throw.` }
    }

    if ($ability.isStatusAbility()) {
      target.getCondition().setStatus($ability.addStatus.status, { savingThrow:$ability.savingThrow });
      return { ...targetInfo, setStatus:$ability.addStatus.status }
    }

  }

  return { execute };

})()