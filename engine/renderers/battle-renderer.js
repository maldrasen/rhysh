global.BattleRenderer = (function() {

  function renderCombatRound(events) {
    let rendered = ArrayHelper.compact(events.map(event => {
      if (event.getClassName() == 'MonsterCombatRound') { return renderMonsterCombatRound(event) }
    }));
  }

  function renderMonsterCombatRound(round) {
    if (round.getStory() == null) { return null; }

    // console.log("\n---Render---")
    // console.log(round.pack());

    let packed = round.pack();

    let story = round.getStory();
    let segments = [];

    let context = new Context({
      round: round,
      monster: round.getMonster(),
      target: round.getTarget(),
    });

    segments.push(renderAttemptSegment(story, context));
    segments.push(renderAttackRollSegment(round));

    if (round.getAttackDamage()) {
      segments.push(renderAttackDamageSegment(round))
    }
    if (round.isFailure()) {
      segments.push(renderFailureSegment(round, context));
    }
    if (round.isSuccess()) {
      segments.push(renderSuccessSegment(round, context));
    }

    if (round.isStatusAdded()) {
      segments.push(renderStatusSegment(round, context));
    }
    if (round.isConditionSet()) {
      segments.push(renderConditionSegment(round, context));
    }
    if (round.getTargetBeaten()) {
      segments.push(renderTargetBeatenSegment(round, context));
    }

    console.log(segments)
  }


  function renderAttemptSegment(story, context) {
    return { type:'attempt', text:Weaver.weave(story.attempt, context) };
  }

  function renderAttackRollSegment(round) {
    return { type:'attackRoll', roll:round.getAttackRoll() };
  }

  function renderAttackDamageSegment(round) {
    return { type:'damage', damage:round.getAttackDamage() };
  }

  function renderConditionSegment(round, context) {
    let conditionSet = round.getConditionSet();
    let text;

    if (conditionSet.on == 'self') {
      if (conditionSet.code == 'prone') { text = `<span class='condition-set prone'>{{M::TheMonster}} falls prone.</span>` }
    }

    return { type:'conditionSet', text:Weaver.weave(text, context) };
  }

  function renderStatusSegment(round, context) {
    return { type:'statusAdded', ...round.getStatusAdded() };
  }

  function renderFailureSegment(round, context) {
    let template = round.getStory().miss;

    return {
      type: round.getAttackResult(),
      text: template ? Weaver.weave(template, context) : `<span class='plain-miss'>Miss</span>`
    };
  }

  function renderSuccessSegment(round, context) {
    return {
      type: round.getAttackResult(),
      text: Weaver.weave(round.getStory().hit, context)
    };
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