global.BattleRenderer = (function() {

  function renderCombatRound(events) {
    let battleState = GameState.getCurrentBattle();

    if (Environment.verbose) {
      console.log(`=== Render Combat Round (${battleState.getRoundNumber()}) ===`)
    }

    let renderedEvents = ArrayHelper.compact(events.map(event => {
      if (event.getClassName() == 'MonsterCombatRound') { return renderMonsterCombatRound(event) }
    }));

    Messenger.publish('browser.render-battle-round', {
      battle: battleState.pack(),
      events: renderedEvents,
    });
  }

  function renderMonsterCombatRound(round) {
    if (round.getStory() == null) { return null; }

    let segments = [];
    let context = new Context({
      round: round,
      monster: round.getMonster(),
      target: round.getTarget(),
    });

    segments.push(renderAttemptSegment(round, context));

    if (round.isFailure())       { segments.push(renderFailureSegment(round, context));      }
    if (round.isSuccess())       { segments.push(renderSuccessSegment(round, context));      }
    if (round.isStatusAdded())   { segments.push(renderStatusSegment(round, context));       }
    if (round.isConditionSet())  { segments.push(renderConditionSegment(round, context));    }
    if (round.getTargetBeaten()) { segments.push(renderTargetBeatenSegment(round, context)); }

    segments = ArrayHelper.compact(segments)

    if (Environment.verbose) {
      console.log(`${round.getMonster().getName()}[${round.getMonster().getID()}]`);
      segments.forEach(segment => {
        console.log(' - ',JSON.stringify(segment));
      });
    }

    return segments;
  }

  function renderAttemptSegment(round, context) {
    return { type:'attempt', text:Weaver.weave(round.getStory().attempt, context) };
  }

  function renderFailureSegment(round, context) {
    let template = round.getStory().miss;
    let defaultText = `<span class='plain-miss'>Miss</span>`;

    if (round.getAttackResult() == 'critical-miss') {
      defaultText = `<span class='critical-miss'>Fumbles!</span>`;
    }

    return {
      type: round.getAttackResult(),
      attackRoll: round.getAttackRoll(),
      text: template ? Weaver.weave(template, context) : defaultText
    };
  }

  function renderSuccessSegment(round, context) {
    return {
      type: round.getAttackResult(),
      attackRoll: round.getAttackRoll(),
      damage: round.getAttackDamage(),
      text: Weaver.weave(round.getStory().hit, context),
    };
  }

  function renderConditionSegment(round, context) {
    let conditionSet = round.getConditionSet();
    let text;

    if (conditionSet.on == 'self') {
      if (conditionSet.code == 'prone') { text = `<span class='condition-set prone'>{{M::TheMonster}} falls prone.</span>` }

      // No need to mention holds as that would be redundant.
      if (conditionSet.code == 'holding-legs') { return null; }
      if (conditionSet.code == 'holding-arms') { return null; }
    }

    if (text == null) {
      throw `TODO: Render this condition ${conditionSet.on}:${conditionSet.code}`;
    }

    return { type:'conditionSet', text:Weaver.weave(text, context) };
  }

  function renderStatusSegment(round, context) {
    let statusAdded = round.getStatusAdded();
    let text;

    if (statusAdded.on == 'target') {
      if (statusAdded.code == 'bound-legs') { text = `<span class='status-added bound'>{{T::firstName's}} legs are bound.</span>` }
      if (statusAdded.code == 'bound-arms') { text = `<span class='status-added bound'>{{T::firstName's}} arms are bound.</span>` }
    }

    if (text == null) {
      throw `TODO: Render this condition ${statusAdded.on}:${statusAdded.code}`;
    }

    return { type:'statusAdded', text:Weaver.weave(text, context) };
  }

  function renderTargetBeatenSegment(round, context) {
    if (round.getTargetCode() == 'Main') {
      let text = (round.getTargetBeaten() == 'dead') ?
        `<span class='main-character-killed'>{{T::firstName}} was killed!</span>` :
        `<span class='main-character-faints'>{{T::firstName}} faints!</span>`;
      return { type:'defeat', text:Weaver.weave(text, context) };
    }
    throw `TODO: Handle defeat of another character.`
  }

  return {
    renderCombatRound
  };

})();
