global.CastAreaOfEffect = (function() {

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

    console.log("=== AoE ===")
    console.log("Action:",$action.pack());
    console.log("Ability:",$ability.pack());
    console.log("Event:",$event.pack());

    if ($action.getTargetType() == _allMonsters) {
      ObjectHelper.each(GameState.getCurrentBattle().getMonsters(), (id, monster) => {
        resolveMonster(monster)
      });
    }
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
  function resolveMonster(monster) {
    if (monster.hasCondition(_dead)) { return; }

    if ($ability.savingThrow) {
      let save = monster.rollSavingThrow($ability.savingThrow);
    }
  }

  return { execute };

})()