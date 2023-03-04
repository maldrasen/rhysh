describe('BattleEngine', function() {

  it("executes a full round", function() {
    SpecHelper.randomMainCharacter({ archetype:'knight' });
    GameState.setCurrentBattle(new BattleState());

    let engine = new BattleEngine({ actions:{ Main:{ action:'attack', mainMode:'random', offMode:'random' }}});
    let events = engine.execute();
  });

  it.only("rolls for inititave", function() {
    SpecHelper.randomMainCharacter({ archetype:'knight' });
    GameState.setCurrentBattle(new BattleState());

    let engine = new BattleEngine({ actions:{ Main:{ action:'attack', mainMode:'random', offMode:'random' }}});
    engine.rollForInitiative();

    console.log(engine.getInitiativeOrder());


  });


});
