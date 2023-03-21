describe('BattleEngine', function() {

  const mainActions = {
    action: _attack,
    targetType: _rank,
    targetRank: _rank_1,
    mainMode: _random,
    offMode: _random
  };

  // Should be able to look at events maybe?
  it("executes a full round", function() {
    SpecHelper.randomMainCharacter({ archetype:'knight' });
    GameState.setCurrentBattle(new BattleState());

    let engine = new BattleEngine({ actions:{ Main:mainActions }});
    let events = engine.execute();
  });

  // Nothing that can really be tested. Just make sure it doesn't blow up.
  it("rolls for inititave", function() {
    SpecHelper.randomMainCharacter({ archetype:'knight' });
    GameState.setCurrentBattle(new BattleState());

    let engine = new BattleEngine({ actions:{ Main:mainActions }});
        engine.rollForInitiative();
  });

});
