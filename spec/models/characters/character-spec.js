describe('Character', function() {

  it("Packs and unpacks character data", function() {
    let character = CharacterBuilder.buildMainCharacter({
      archetype: 'mindbender',
      species: 'dragonkind',
      sex: 'futa',
      firstName: 'Jada',
      lastName: 'Fire',
    });

    expect(character.getFullName()).to.equal('Jada Fire');
  });

});
