global.CombatRoundRenderer = (function() {

  function render(combatRound) {
    const action = combatRound.getAction();
    const result = combatRound.getResult();

    const rendered = {
      actor: renderActor(action),
      target: renderTarget(action),
    };

    if (result.getActionStory()) {
      rendered.actionStory = result.getActionStory();
    }

    if (result.hasAttackEvents()) {
      rendered.attackEvents = result.getAttackEvents().map(event => {
        return renderAttackEvent(event, combatRound);
      });
    }

    const targetCondition = combatRound.getTarget().getCondition();
    if (targetCondition.hasCondition(_dead)) { rendered.targetCondition = _dead; }
    if (targetCondition.hasCondition(_fainted)) {  rendered.targetCondition = _fainted; }

    return rendered;
  }

  function renderActor(action) {
    const rendered = {};

    if (action.isMonster()) {
      rendered.monsterID = action.getActorIdentifier();
    }

    if (action.isCharacter()) {
      rendered.characterCode = action.getActorIdentifier();
      rendered.characterPosition = CharacterLibrary.getCharacterPosition(action.getActorIdentifier());
    }

    return rendered;
  }

  function renderTarget(action) {
    const rendered = { targetType:action.getTargetType() };

    if (rendered.targetType == _single) {
      if (action.isTargetMonster()) {
        rendered.monsterID = action.getTargetIdentifier();
      }
      if (action.isTargetCharacter()) {
        rendered.characterCode = action.getTargetIdentifier();
        rendered.characterPosition = CharacterLibrary.getCharacterPosition(action.getTargetIdentifier());
      }
    }

    // TODO: Render other target types...

    return rendered;
  }

  function renderAttackEvent(action, combatRound) {
    const condition = combatRound.getTarget().getCondition();
    const rendered = {};

    if (action.getAttackResult()) { rendered.attackResult = action.getAttackResult(); }
    if (action.getAttackRoll())   { rendered.attackRoll =   action.getAttackRoll();   }
    if (action.getAttackBonus())  { rendered.attackBonus =  action.getAttackBonus();  }
    if (action.getAttackDamage()) { rendered.attackDamage = action.getAttackDamage(); }
    if (action.getActionStory())  { rendered.actionStory =  action.getActionStory();  }
    if (action.getResultStory())  { rendered.resultStory =  action.getResultStory();  }

    if (rendered.attackDamage) {
      rendered.targetHitPoints = condition.getCurrentHitPoints();
      rendered.targetMaxHitPoints = condition.getMaxHitPoints();
      rendered.targetHealth = condition.getHealth();
    }

    if (action.isTargetFallen()) { rendered.targetFallen = true; }

    return rendered;
  }

  return { render };

})();
