describe.only('BattleEngine', function() {

  // Should be able to look at events maybe?
  it("executes a full round", function() {
    SpecHelper.randomMainCharacter({ archetype:'knight' });
    GameState.setCurrentBattle(new BattleState());

    let engine = new BattleEngine({ actions:{ Main:{ action:'attack', mainMode:'random', offMode:'random' }}});
    let events = engine.execute();
  });

  // Nothing that can really be tested. Just make sure it doesn't blow up.
  it("rolls for inititave", function() {
    SpecHelper.randomMainCharacter({ archetype:'knight' });
    GameState.setCurrentBattle(new BattleState());

    let engine = new BattleEngine({ actions:{ Main:{ action:'attack', mainMode:'random', offMode:'random' }}});
        engine.rollForInitiative();
  });

});
