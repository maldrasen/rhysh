describe('MonsterCombatRound', function() {

  // Running a combat round for a single monster still produces very random
  // results, but its less random than running an entire combat round from the
  // battle engine and allows control over the target and ability used.
  it("uses an ability", function() {
    SpecHelper.randomMainCharacter({ archetype:'mindbender' });

    let crab = MonsterBuilder.build('mudcrab');
    let action = new CombatAction({
      action: _ability,
      actorClassname: _monsterActor,
      actorItentifier: $monster.getID(), // FIXME
      ability: 'crab-grab-legs',
      targetType: _single,
      targetIdentifier: 'Main',
    });

    let round = new MonsterCombatRound(crab, action);
        round.doAbility();

    let results = round.getCombatResults()[0];

    expect(round.getAbility().code).to.equal('crab-grab-legs');
    expect(round.getCombatResults()[0].getAttackRoll()).to.be.greaterThan(0);
    expect(results.getStory()).to.not.be.null;
  });

  it("uses an attack", function() {
    SpecHelper.randomMainCharacter({ archetype:'chosen' });

    let gobbo = MonsterBuilder.build('goblin');
    let action = new CombatAction({
      action: _attack,
      actorClassname: _monsterActor,
      actorItentifier: $monster.getID(), // FIXME
      targetType: _single,
      targetIdentifier: 'Main',
    });

    let round = new MonsterCombatRound(gobbo, action);
        round.doAttack();

    let results = round.getCombatResults()[0];

    expect(results.getStory()).to.not.be.null;
  });

});
