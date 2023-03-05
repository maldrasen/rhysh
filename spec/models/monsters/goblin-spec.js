describe('Goblin', function() {

  it("Builds a goblin", function() {
    let gobbo = new Monster.Goblin({});
    let chestArmor = gobbo.getArmorClass('chest');
    let maxHP = gobbo.getCondition().getMaxHitPoints();
    let hp = gobbo.getCondition().getCurrentHitPoints();

    expect(gobbo.getBaseArmorClass()).to.equal(11);
    expect(maxHP).to.be.lessThan(13);
    expect(maxHP).to.be.greaterThan(6);
    expect(maxHP).to.equal(hp);
    expect(gobbo.getAttributes().dexModifier()).to.equal(2);
    expect(gobbo.getEssence()).to.equal(50);
    expect(chestArmor).to.be.lessThan(17);
    expect(chestArmor).to.be.greaterThan(12);
  });

  // This might build crabs too right now.
  it('chooses a combat ability', function() {
    let state = new BattleState();
    let gobbo = state.getMonster('M1');

    SpecHelper.randomMainCharacter();
    GameState.setCurrentBattle(state);

    console.log("Action:",gobbo.chooseCombatAction());
  });

});
