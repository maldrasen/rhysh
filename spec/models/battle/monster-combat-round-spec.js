describe('MonsterCombatRound', function() {

  // Running a combat round for a single monster still produces very random
  // results, but its less random than running an entire combat round from the
  // battle engine and allows control over the target and ability used.
  it("uses an ability", function() {
    SpecHelper.randomMainCharacter({ archetype:'mindbender' });

    let crab = new Monster.Mudcrab();
        crab.setTarget('Main');

    let round = new MonsterCombatRound(crab);
        round.doMonsterAbility({ code:'crab-claw', damage:{ d:4 }, hit:0 });

    expect(round.getAbilityCode()).to.equal('crab-claw');
    expect(round.getTargetCode()).to.equal('Main');
    expect(round.getAttackRoll()).to.be.greaterThan(0);
  });

});
