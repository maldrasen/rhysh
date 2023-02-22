describe('Goblin', function() {

  it("Builds a goblin", function() {
    let gobbo = new Monster.Goblin({});
    let chestArmor = gobbo.getArmorClass('chest');

    expect(gobbo.getNaturalArmorClass()).to.equal(11);
    expect(gobbo.getHitPoints()).to.be.lessThan(13);
    expect(gobbo.getHitPoints()).to.be.greaterThan(6);
    expect(gobbo.getAttributes().dexModifier()).to.equal(2);
    expect(gobbo.getEssence()).to.equal(50);
    expect(chestArmor).to.be.lessThan(17);
    expect(chestArmor).to.be.greaterThan(12);
  });

});
