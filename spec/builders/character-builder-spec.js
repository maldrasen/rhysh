describe('CharacterBuilder', function() {

  it('builds a main character', function() {
    let main = CharacterBuilder.buildMainCharacter({
      archetype: 'chosen',
      species: 'elf',
      sex: 'futa',
      firstName: 'Jada',
      lastName: 'Fire',
      attributes: { str:12, dex:15, con:14, int:11, wis:12, cha:17 },
    });

    expect(main.getFullName()).to.equal('Jada Fire');
    expect(main.getArchetype().code).to.equal('chosen');
    expect(main.getSpecies().code).to.equal('elf');
    expect(main.getSkill('intimidation').getLevel()).to.equal(2);
  });

  it('sets their starting equipment', function() {
    let main = SpecHelper.randomMainCharacter({ archetype:'knight' });
    let equipped = Inventory.getEquippedBy(main);
    expect(equipped['head'].getMaterial()).to.equal('plate');
    expect(equipped['mainHand'].getBase()).to.equal('longsword');
    expect(equipped['offHand'].getEffects().armorClass).to.equal(2);
  });

});
