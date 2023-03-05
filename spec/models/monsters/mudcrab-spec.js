describe('Mudcrab', function() {

  it("Builds a Mudcrab", function() {
    let crab = new Monster.Mudcrab();

    expect(crab.getBaseArmorClass()).to.equal(12);
    expect(crab.getAbilities().length).to.equal(6);
    expect(crab.getSlots().claws).to.equal(1);
  });

  it('chooses a combat ability', function() {
    let state = new BattleState({ monster:'Mudcrab' });
    let crab = state.getMonster('M1');

    SpecHelper.randomMainCharacter();
    GameState.setCurrentBattle(state);

    expect(crab.chooseCombatAction().action).to.not.equal('nothing');
  });

});
