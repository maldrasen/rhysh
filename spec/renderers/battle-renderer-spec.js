describe('BattleRenderer', function() {

  const mainAction = {
    action: _attack,
    targetType: _rank,
    targetRank: _rank_1,
    mainMode: _random,
    offMode: _random
  };

  it(`Doesn't blow up.`, function() {
    SpecHelper.randomMainCharacter({ archetype:'knight' });
    GameState.setCurrentBattle(new BattleState({}));

    let engine = new BattleEngine({ actions:{ Main:mainAction }});
    let events = engine.execute();

    BattleRenderer.renderCombatRound(events);
  });

});
