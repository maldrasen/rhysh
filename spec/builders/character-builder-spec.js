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

    expect(main.getArchetype().code).to.equal('chosen');
    expect(main.getSpecies().code).to.equal('elf');
  });

});