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
    if (round.getAttackResult() == 'miss') {
      segments.push(renderMissSegment(story, context));
    }
    if (round.getAttackResult() == 'hit') {
      segments.push(renderHitSegment(story, context));
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
    return { type:'damage', ramage:round.getAttackDamage() };
  }

  function renderMissSegment(story, context) {
    return {
      type: 'miss',
      text: story.miss ? Weaver.weave(story.miss, context) : `<span class='plain-miss'>Miss</span>`
    };
  }

  function renderHitSegment(story, context) {
    return { type:'hit', text:Weaver.weave(story.hit, context) };
  }


  return {
    renderCombatRound
  };

})();