global.CombatRoundRenderer = (function() {

  function render(combatRound) {
    const action = combatRound.getAction();
    const result = combatRound.getResult();
    const target = combatRound.getTarget();

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

    if (target) {
      if (target.getCondition().hasCondition(_dead)) { rendered.targetCondition = _dead; }
      if (target.getCondition().hasCondition(_fainted)) {  rendered.targetCondition = _fainted; }
    }

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
      return rendered;
    }

    throw `Render Target Type: ${rendered.targetType}`;
  }

  function renderAttackEvent(event, combatRound) {
    const condition = combatRound.getTarget().getCondition();
    const rendered = {};

    if (event.getAttackResult()) { rendered.attackResult = event.getAttackResult(); }
    if (event.getAttackRoll())   { rendered.attackRoll =   event.getAttackRoll();   }
    if (event.getAttackBonus())  { rendered.attackBonus =  event.getAttackBonus();  }
    if (event.getAttackDamage()) { rendered.attackDamage = event.getAttackDamage(); }
    if (event.getActionStory())  { rendered.actionStory =  event.getActionStory();  }
    if (event.getResultStory())  { rendered.resultStory =  event.getResultStory();  }

    if (rendered.attackDamage) {
      rendered.targetHitPoints = condition.getCurrentHitPoints();
      rendered.targetMaxHitPoints = condition.getMaxHitPoints();
      rendered.targetHealth = condition.getHealth();
    }

    if (event.isStatusChanged()) { rendered.statusChanges = renderStatusChanges(event, combatRound); }
    if (event.isConditionChanged()) { rendered.conditionChanges = renderConditionChanges(event, combatRound); }
    if (event.isTargetFallen()) { rendered.targetFallen = true; }

    return rendered;
  }

  function renderConditionChanges(event, combatRound) {
    return event.getConditionChanges().map(change => renderConditionChange(change, event, combatRound));
  }

  function renderStatusChanges(event, combatRound) {
    return event.getStatusChanges().map(change => renderStatusChange(change, event, combatRound));
  }

  function renderConditionChange(change, event, combatRound) {
    console.log("Render Condition Change:",change)
  }

  function renderStatusChange(change, event, combatRound) {
    console.log("Render Condition Change:",change)
  }

  return { render };

})();
