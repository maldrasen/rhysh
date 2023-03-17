describe('BattleRenderer', function() {

  it(`Doesn't blow up.`, function() {
    SpecHelper.randomMainCharacter({ archetype:'knight' });
    GameState.setCurrentBattle(new BattleState({ monster:'goblin' }));

    let engine = new BattleEngine({ actions:{ Main:{ action:'attack', mainMode:'random', offMode:'random' }}});
    let events = engine.execute();

    BattleRenderer.renderCombatRound(events);
  });

});
