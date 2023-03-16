describe('Mudcrab', function() {

  it("Builds a Mudcrab", function() {
    let crab = new Monster.Mudcrab();

    expect(crab.getBaseArmorClass()).to.equal(12);
    expect(crab.getAbilities().length).to.equal(7);
    expect(crab.getSlots().claws).to.equal(2);
  });

  it('chooses a combat ability', function() {
    let state = new BattleState({ monster:'Mudcrab' });
    let crab = state.getMonster('M1');

    SpecHelper.randomMainCharacter();
    GameState.setCurrentBattle(state);

    expect(crab.chooseCombatAction()).to.not.be.null;
  });

});
