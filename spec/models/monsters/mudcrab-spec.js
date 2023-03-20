describe('Mudcrab', function() {

  it("Builds a Mudcrab", function() {
    let crab = new MonsterBuilder.build('mudcrab');

    expect(crab.getBaseArmorClass()).to.equal(12);
    expect(crab.getAbilities().length).to.equal(7);
    expect(crab.getSlots().claws).to.equal(2);
  });

});
