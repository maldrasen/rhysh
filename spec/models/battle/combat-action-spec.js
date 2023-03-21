describe('CombatAction', function() {

  // { action: 'attack', mainMode: 'slash', offMode: 'block' }
  it('builds an attack combat action', function() {
    let main = SpecHelper.randomMainCharacter({ archetype:'knight' });

    let combatAction = new CombatAction({
      actorClassname: _characterActor,
      actorItentifier: 'Main',
      action: _attack,
      targetType: _rank,
      targetRank: _rank_1,
      mainMode: _slash,
      offMode: _block,
    });

    console.log(combatAction.pack());

    expect(combatAction.getActor().getCode()).to.equal('Main');
  });

  it('builds an ability combat action', function() {
    let main = SpecHelper.randomMainCharacter({ archetype:'knight', species:'minotaur' });

    let combatAction = new CombatAction({
      actorClassname: _characterActor,
      actorItentifier: 'Main',
      action: _ability,
      ability: 'fortitude',
    });

    expect(combatAction.getTargetType()).to.equal(_self);
    expect(combatAction.getTarget().getCode()).to.equal('Main');
    expect(combatAction.getAbility().code).to.equal('fortitude');
    expect(combatAction.getAbilityLevel().getCode()).to.equal('fortitude');
  });

});
