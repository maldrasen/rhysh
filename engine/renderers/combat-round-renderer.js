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

  /* --- From old renderer ---

  function renderStatusSegment(statusChange, context) {
    let text;
    let severity;

    if (statusChange.on == _single) {
      if (statusChange.add == _boundLegs) {
        text = `{{T::name's}} legs are bound.`;
        severity = 'bad';
      }
      if (statusChange.add == _boundArms) {
        text = `{{T::name's}} arms are bound.`;
        severity = 'bad';
      }
    }

    if (text == null) {
      throw `TODO: Render this condition ${statusChange.on}:${statusChange.add}`;
    }

    return {
      type: _statusChange,
      text: Weaver.weave(text, context),
      severity: severity
    };
  }

  function renderConditionSegment(conditionChange, context) {
    let text;
    let severity;

    if (conditionChange.on == _self) {
      if (conditionChange.set == _prone) {
        text = `{{A::Name}} falls prone.`
        severity = 'bad'
      }

      // No need to mention holds as that would be redundant.
      if (conditionChange.set == _holdingLegs) { return null; }
      if (conditionChange.set == _holdingArms) { return null; }
    }

    if (text == null) {
      throw `TODO: Render this condition ${conditionChange.on}:${conditionChange.set}`;
    }

    return {
      type: _conditionChange,
      text: Weaver.weave(text, context),
      severity: severity
    };
  }

  function renderTriggerSegment(trigger, context) {
    if (trigger == 'main-character-fainted') {
      let text =`<span class='main-character-faints'>{{T::name}} faints!</span>`;
      return { type:_trigger, triggers:'game-over', text:Weaver.weave(text,context)};
    }
    if (trigger == 'main-character-killed') {
      let text = `<span class='main-character-killed'>{{T::name}} was killed!</span>`;
      return { type:_trigger, triggers:'game-over', text:Weaver.weave(text,context)};
    }
    throw `TODO: Implement trigger ${trigger}`;
  }
*/

  return { render };

})();
