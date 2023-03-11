global.BattleRenderer = (function() {

  let $renderedEvents;

  function renderCombatRound(events) {
    $renderedEvents = []

    if (Environment.verbose) {
      console.log(`=== Render Combat Round (${GameState.getCurrentBattle().getRoundNumber()}) ===`)
    }

    events.forEach(event => {
      if (event.getClassName() == 'MonsterCombatRound') { renderMonsterCombatRound(event); }
    });

    Messenger.publish('browser.render-battle-round', {
      battle: GameState.getCurrentBattle().pack(),
      events: $renderedEvents,
    });
  }

  function renderMonsterCombatRound(combatRound) {
    combatRound.getCombatResults().forEach(combatResult => {
      if (combatResult.getStory() == null) { return null; }

      let segments = [];
      let context = new Context({
        combatResult: combatResult,
        combatRound: combatRound,
        actor: combatRound.getMonster(),
        target: combatRound.getTarget(),
      });

      segments.push(renderAttemptSegment(combatResult, context));

      if (combatResult.isFailure()) { segments.push(renderFailureSegment(combatResult, context)); }
      if (combatResult.isSuccess()) { segments.push(renderSuccessSegment(combatResult, context)); }

      combatResult.getStatusChanges().forEach(statusChange => {
        segments.push(renderStatusSegment(statusChange, context));
      });

      combatResult.getConditionChanges().forEach(conditionChange => {
        segments.push(renderConditionSegment(conditionChange, context));
      });

      combatRound.getTriggers().forEach(trigger => {
        segments.push(renderTriggerSegment(trigger, context));
      });

      combatRound.clearTriggers();
      segments = ArrayHelper.compact(segments)

      if (Environment.verbose) {
        console.log(`${combatRound.getMonster().getName()}[${combatRound.getMonster().getID()}]`);
        segments.forEach(segment => {
          console.log(' - ',JSON.stringify(segment));
        });
      }

      $renderedEvents.push({
        actorType: 'Monster',
        monsterID: combatRound.getMonsterID(),
        segments: segments,
      });
    });
  }

  function renderAttemptSegment(combatResult, context) {
    return { type:'attempt', text:Weaver.weave(combatResult.getStory().attempt, context) };
  }

  function renderFailureSegment(combatResult, context) {
    let template = combatResult.getStory().miss;
    let defaultText = combatResult.isCriticalMiss() ? `Fumbles!` : `Miss`;

    return {
      type: combatResult.getAttackResult(),
      attackRoll: combatResult.getAttackRoll(),
      text: template ? Weaver.weave(template, context) : defaultText
    };
  }

  function renderSuccessSegment(combatResult, context) {
    let hitStory = combatResult.getStory().hit;

    if (hitStory == null) {
      hitStory = combatResult.isCriticalHit() ? 'Critical Hit!' : 'Hit!';
    }

    return {
      type: combatResult.getAttackResult(),
      attackRoll: combatResult.getAttackRoll(),
      damage: combatResult.getAttackDamage(),
      text: Weaver.weave(hitStory, context),
    };
  }

  function renderStatusSegment(statusChange, context) {
    let text;
    let severity;

    if (statusChange.on == 'target') {
      if (statusChange.add == 'bound-legs') {
        text = `{{T::name's}} legs are bound.`;
        severity = 'bad';
      }
      if (statusChange.add == 'bound-arms') {
        text = `{{T::name's}} arms are bound.`;
        severity = 'bad';
      }
    }

    if (text == null) {
      throw `TODO: Render this condition ${statusChange.on}:${statusChange.add}`;
    }

    return {
      type: 'statusChange',
      text: Weaver.weave(text, context),
      severity: severity
    };
  }

  function renderConditionSegment(conditionChange, context) {
    let text;
    let severity;

    if (conditionChange.on == 'self') {
      if (conditionChange.set == 'prone') {
        text = `{{A::Name}} falls prone.`
        severity = 'bad'
      }

      // No need to mention holds as that would be redundant.
      if (conditionChange.set == 'holding-legs') { return null; }
      if (conditionChange.set == 'holding-arms') { return null; }
    }

    if (text == null) {
      throw `TODO: Render this condition ${conditionChange.on}:${conditionChange.set}`;
    }

    return {
      type: 'conditionChange',
      text: Weaver.weave(text, context),
      severity: severity
    };
  }

  function renderTriggerSegment(trigger, context) {
    if (trigger == 'main-character-fainted') {
      let text =`<span class='main-character-faints'>{{T::name}} faints!</span>`;
      return { type:'trigger', triggers:'game-over', text:Weaver.weave(text,context)};
    }
    if (trigger == 'main-character-killed') {
      let text = `<span class='main-character-killed'>{{T::name}} was killed!</span>`;
      return { type:'trigger', triggers:'game-over', text:Weaver.weave(text,context)};
    }
    throw `TODO: Implement trigger ${trigger}`;
  }

  return {
    renderCombatRound
  };

})();
