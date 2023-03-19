global.BattleRenderer = (function() {

  let $renderedEvents;

  function renderCombatRound(events) {
    $renderedEvents = []

    if (Environment.verbose) {
      console.log(`=== Render Combat Round (${GameState.getCurrentBattle().getRoundNumber()}) ===`)
    }

    events.forEach(event => {
      renderCombatEvent(event, event.getActorType());
    });

    Switchboard.renderBattleRound({
      battle: GameState.getCurrentBattle().pack(),
      events: $renderedEvents,
    });
  }

  function renderCombatEvent(combatRound, actorType) {
    combatRound.getCombatResults().forEach(combatResult => {
      if (combatResult.getStory() == null) { return null; }

      const context = new Context({
        combatResult: combatResult,
        combatRound: combatRound,
        actor: combatRound.getActor(),
        target: combatRound.getTarget(),
      });

      const rendered = {
        actorType: combatRound.getActorType(),
        segments: []
      };

      if (rendered.actorType == _characterActor) { rendered.characterCode = combatRound.getActor().getCode(); }
      if (rendered.actorType == _monsterActor) { rendered.monsterID = combatRound.getActor().getID(); }

      rendered.segments.push(renderAttemptSegment(combatResult, context));

      if (combatResult.isFailure()) { rendered.segments.push(renderFailureSegment(combatResult, context)); }
      if (combatResult.isSuccess()) { rendered.segments.push(renderSuccessSegment(combatResult, context)); }

      combatResult.getStatusChanges().forEach(statusChange => {
        rendered.segments.push(renderStatusSegment(statusChange, context));
      });

      combatResult.getConditionChanges().forEach(conditionChange => {
        rendered.segments.push(renderConditionSegment(conditionChange, context));
      });

      combatRound.getTriggers().forEach(trigger => {
        rendered.segments.push(renderTriggerSegment(trigger, context));
      });

      combatRound.clearTriggers();
      rendered.segments = ArrayHelper.compact(rendered.segments);

      $renderedEvents.push(rendered);

      printRenderedEvents(rendered);
    });
  }

  function printRenderedEvents(rendered) {
    if (Environment.verbose) {
      let id = rendered.actorType == _monsterActor ? rendered.monsterID : rendered.characterCode

      console.log(`\nEvent[${rendered.actorType}:${id}]`);
      rendered.segments.forEach(segment => {
        console.log(' - ',JSON.stringify(segment));
      });
    }
  }

  function renderAttemptSegment(combatResult, context) {
    let story = combatResult.getStory()
    let text = Weaver.weave((story.text || story.tryText), context);

    return { type:_attempt, text:text };
  }

  function renderFailureSegment(combatResult, context) {
    let template = combatResult.getStory().missText;
    let defaultText = combatResult.isCriticalMiss() ? `Fumbles!` : `Miss`;

    return {
      type: combatResult.getAttackResult(),
      attackRoll: combatResult.getAttackRoll(),
      attackBonus: combatResult.getAttackBonus(),
      text: template ? Weaver.weave(template, context) : defaultText
    };
  }

  function renderSuccessSegment(combatResult, context) {
    let hitStory = combatResult.getStory().hitText || composeHitStory(combatResult, context);
    let segment = {
      type: combatResult.getAttackResult(),
      attackRoll: combatResult.getAttackRoll(),
      attackBonus: combatResult.getAttackBonus(),
      damage: combatResult.getAttackDamage(),
      text: Weaver.weave(hitStory, context),
    };

    if (segment.damage > 0) {
      let condition = combatResult.getTarget().getCondition();
      segment.targetHitPoints = condition.getCurrentHitPoints();
      segment.targetMaxHitPoints = condition.getMaxHitPoints();
      segment.targetHealth = condition.getHealth();
    }

    return segment;
  }

  function composeHitStory(combatResult, context) {
    let text = combatResult.isCriticalHit() ?
      `{{T::Name's}} {{battle|target-slot-word}} was delt a critical blow!`:
      `Hit {{T::name's}} {{battle|target-slot-word}}.`

    return Weaver.weave(text,context);
  }

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

  return {
    renderCombatRound
  };

})();
