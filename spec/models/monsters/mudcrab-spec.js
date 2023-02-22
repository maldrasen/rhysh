describe('Mudcrab', function() {

  it("Builds a Mudcrab", function() {
    let crab = new Monster.Mudcrab();

    expect(crab.getNaturalArmorClass()).to.equal(12);
    expect(crab.getAbilities().length).to.equal(6);
    expect(crab.getSlots().claws).to.equal(1);
  });

  it("Has available abilities", function() {
    let crab = new Monster.Mudcrab();
    let available = crab.getAvailableAbilities();
  });


  it("Has grapple states", function() {
    let crab = new Monster.Mudcrab();
  });

});
