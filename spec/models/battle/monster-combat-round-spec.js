describe('MonsterCombatRound', function() {

  // Running a combat round for a single monster still produces very random
  // results, but its less random than running an entire combat round from the
  // battle engine and allows control over the target and ability used.
  it("uses an ability", function() {
    SpecHelper.randomMainCharacter({ archetype:'mindbender' });

    let crab = new Monster.Mudcrab();
        crab.setTarget('Main');

    let round = new MonsterCombatRound(crab);
        round.doAbility({ code:'crab-claw', damage:{ d:4 }, hit:10 });

    expect(round.getAbilityCode()).to.equal('crab-claw');
    expect(round.getTargetCode()).to.equal('Main');
    expect(round.getCombatResults()[0].getAttackRoll()).to.be.greaterThan(0);
  });

  it("uses an attack", function() {
    SpecHelper.randomMainCharacter({ archetype:'chosen' });

    let gobbo = new Monster.Goblin();
        gobbo.setTarget('Main');

    let round = new MonsterCombatRound(gobbo);
        round.doAttack();

    let results = round.getCombatResults()[0];

    expect(round.getTargetCode()).to.equal('Main');
    expect(results.getAttackRoll()).to.be.greaterThan(0);
    expect(results.getStory()).to.not.be.null;
  });

});
