describe('Character', function() {

  it("Packs and unpacks character data", function() {
    let character = CharacterBuilder.buildMainCharacter({
      archetype: 'mindbender',
      species: 'dragonkind',
      sex: 'futa',
      firstName: 'Jada',
      lastName: 'Fire',
      attributes: { str:14, dex:14, con:12, int:14, wis:12, cha:12 },
    });

    let jada = Character.unpack(character.pack());

    expect(jada.getAttributes().strModifier()).to.equal(2);
  });

});
