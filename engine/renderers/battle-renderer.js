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
    let segments = [];

    let context = new Context({
      round: round,
      monster: round.getMonster(),
      target: round.getTarget(),
    });

    segments.push({ type:'attempt', text:Weaver.weave(round.getStory().attempt, context) });

    console.log(segments)
  }

  return {
    renderCombatRound
  };

})();