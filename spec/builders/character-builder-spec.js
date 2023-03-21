describe('CharacterBuilder', function() {

  it('builds a chosen main character', function() {
    let main = CharacterBuilder.buildMainCharacter({
      archetype: 'chosen',
      species: 'elf',
      sex: 'futa',
      firstName: 'Jada',
      lastName: 'Fire',
      attributes: { str:12, dex:15, con:14, int:11, wis:12, cha:17 },
    });

    let equipped = Inventory.getEquippedBy(main);
    let mainHand = equipped['mainHand'];
    let offHand = equipped['offHand'];

    expect(main.getFullName()).to.equal('Jada Fire');
    expect(main.getArchetype().code).to.equal('chosen');
    expect(main.getSpecies().code).to.equal('elf');
    expect(main.getSkill('intimidation').getLevel()).to.equal(2);
    expect(mainHand.getWeaponTypeCode()).to.equal(offHand.getWeaponTypeCode());
  });

  it('sets their starting equipment', function() {
    let main = SpecHelper.randomMainCharacter({ archetype:'knight' });
    let equipped = Inventory.getEquippedBy(main);

    expect(equipped['head'].getArmorTypeCode()).to.equal('plate');
    expect(equipped['mainHand'].getWeaponTypeCode()).to.equal('longsword');
    expect(equipped['offHand'].getEffects().armorClass).to.equal(2);

    let ac = main.getArmorClass('chest');
    expect(ac).to.be.lessThan(19);
    expect(ac).to.be.greaterThan(15);
  });

  it('sets their starting abilities', function() {
    let main = SpecHelper.randomMainCharacter({ archetype:'knight', species:'minotaur' });
    let fear = main.getPower('aura-fear');
    let fort = main.getPower('fortitude');
    let abilities = main.getAbilities();

    expect(fort.getCode()).to.equal('fortitude');
    expect(fear.getCode()).to.equal('aura-fear');
    expect(fear.getLevel()).to.equal(0);
    expect(abilities).to.eql(['terrify','fortitude']);
  });

});
