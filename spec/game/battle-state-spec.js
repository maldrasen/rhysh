describe('BattleState', function() {

  it.only("rolls for inititave", function() {
    let main = SpecHelper.randomMainCharacter({ archetype:'knight' });
    let battle = new BattleState();

    battle.startNextRound();

  });

});
