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
      console.log("Wat?",action.getTargetIdentifier(),action.getTargetClassname());
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

    const statusChanges = renderStatusChanges(event);
    const conditionChanges = renderConditionChanges(event);

    if (statusChanges.length > 0) { rendered.statusChanges = statusChanges; }
    if (conditionChanges.length > 0) { rendered.conditionChanges = conditionChanges; }
    if (event.isTargetFallen()) { rendered.targetFallen = true; }

    return rendered;
  }

  function renderConditionChanges(event) {
    return ArrayHelper.compact(event.getConditionChanges().map(change => {
      if (change.story) { return change; }
    }));
  }

  function renderStatusChanges(event) {
    return ArrayHelper.compact(event.getStatusChanges().map(change => {
      if (change.story) { return change; }
    }));
  }

  return { render };

})();
