describe.only('CombatRound', function() {

  const knightSetup = function() {
    SpecHelper.randomMainCharacter({ archetype:'knight' });

    let combatAction = new CombatAction({
      actorClassname: _characterActor,
      actorItentifier: 'Main',
      action: _attack,
      targetType: _rank,
      targetRank: _rank_1,
      mainMode: _slash,
      offMode: _block,
    });

    return combatAction;
  }

  it('builds and executes an attack combat round', function() {
    let action = knightSetup();
    let round = new CombatRound(CharacterLibrary.getMainCharacter(), action);
        round.execute();

    console.log(round.pack());
  });

});