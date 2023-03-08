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
    let defaultText = `<span class='plain-miss'>Miss</span>`;

    if (combatResult.getAttackResult() == 'critical-miss') {
      defaultText = `<span class='critical-miss'>Fumbles!</span>`;
    }

    return {
      type: combatResult.getAttackResult(),
      attackRoll: combatResult.getAttackRoll(),
      text: template ? Weaver.weave(template, context) : defaultText
    };
  }

  function renderSuccessSegment(combatResult, context) {
    return {
      type: combatResult.getAttackResult(),
      attackRoll: combatResult.getAttackRoll(),
      damage: combatResult.getAttackDamage(),
      text: Weaver.weave(combatResult.getStory().hit, context),
    };
  }

  function renderStatusSegment(statusChange, context) {
    let text;

    if (statusChange.on == 'target') {
      if (statusChange.add == 'bound-legs') { text = `<span class='status-added bound'>{{T::firstName's}} legs are bound.</span>` }
      if (statusChange.add == 'bound-arms') { text = `<span class='status-added bound'>{{T::firstName's}} arms are bound.</span>` }
    }

    if (text == null) {
      throw `TODO: Render this condition ${statusChange.on}:${statusChange.add}`;
    }

    return { type:'statusChange', text:Weaver.weave(text, context) };
  }

  function renderConditionSegment(conditionChange, context) {
    let text;

    if (conditionChange.on == 'self') {
      if (conditionChange.set == 'prone') { text = `<span class='condition-set prone'>{{A::TheMonster}} falls prone.</span>` }

      // No need to mention holds as that would be redundant.
      if (conditionChange.set == 'holding-legs') { return null; }
      if (conditionChange.set == 'holding-arms') { return null; }
    }

    if (text == null) {
      throw `TODO: Render this condition ${conditionChange.on}:${conditionChange.set}`;
    }

    return { type:'conditionChange', text:Weaver.weave(text, context) };
  }

  function renderTriggerSegment(trigger, context) {
    if (trigger == 'main-character-fainted') {
      let text =`<span class='main-character-faints'>{{T::firstName}} faints!</span>`;
      return { type:'trigger', triggers:'game-over', text:Weaver.weave(text,context)};
    }
    if (trigger == 'main-character-killed') {
      let text = `<span class='main-character-killed'>{{T::firstName}} was killed!</span>`;
      return { type:'trigger', triggers:'game-over', text:Weaver.weave(text,context)};
    }
    throw `TODO: Implement trigger ${trigger}`;
  }

  return {
    renderCombatRound
  };

})();
