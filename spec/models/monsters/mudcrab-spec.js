describe('Mudcrab', function() {

  it("Builds a Mudcrab", function() {
    let crab = new Monster.Mudcrab();

    expect(crab.getBaseArmorClass()).to.equal(12);
    expect(crab.getAbilities().length).to.equal(6);
    expect(crab.getSlots().claws).to.equal(1);
  });

});
