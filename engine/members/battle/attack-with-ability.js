global.AttackWithAbility = (function() {

  function execute(combatRound) {
    const action = combatRound.getAction();
    const actor = combatRound.getActor();
    const ability = action.getAbility();
    const abilityLevel = action.getAbilityLevel();
    const result = combatRound.getResult();

    const event = new CombatEvent({
      ability: ability,
      abilityLevel: abilityLevel,
      targetSlot: (ability.targetSlot || combatRound.chooseTargetSlot()),
    });

    const context = result.getContext();
          context.set('combatEvent',event);

    event.setActionStory(AbilityStoryTeller.tellActionStory({
      context: context,
      ability: ability,
      abilityLevel: abilityLevel,
    }));

    combatRound.rollAttack((ability.hitBonus || 0) + actor.getBaseHit(), event);
    combatRound.rollDamage(event);
    combatRound.updateCondition(event);
    combatRound.updateStatus(event);
    combatRound.commitDamage(event);
    combatRound.checkCondition(event);

    event.setResultStory(AbilityStoryTeller.tellResultStory({
      context: context,
      ability: ability,
      abilityLevel: abilityLevel,
      combatEvent: event,
    }));

    actor.useAbility(ability.code, event);

    result.addCombatEvent(event);
  }

  return { execute };

})()