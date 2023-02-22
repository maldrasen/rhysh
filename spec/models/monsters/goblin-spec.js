describe('Goblin', function() {

  it("Builds a goblin", function() {
    let gobbo = new Monster.Goblin({});
    let chestArmor = gobbo.getArmorClass('chest');

    expect(gobbo.getBaseArmorClass()).to.equal(11);
    expect(gobbo.getMaxHitPoints()).to.be.lessThan(13);
    expect(gobbo.getMaxHitPoints()).to.be.greaterThan(6);
    expect(gobbo.getMaxHitPoints()).to.equal(gobbo.getCurrentHitPoints());
    expect(gobbo.getAttributes().dexModifier()).to.equal(2);
    expect(gobbo.getEssence()).to.equal(50);
    expect(chestArmor).to.be.lessThan(17);
    expect(chestArmor).to.be.greaterThan(12);
  });

});
