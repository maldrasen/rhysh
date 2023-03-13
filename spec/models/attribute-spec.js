describe('Attributes', function() {

  it("Calculates modifier values", function() {
    expect(Attributes.modifierFor(1)).to.equal(-5);
    expect(Attributes.modifierFor(2)).to.equal(-4);
    expect(Attributes.modifierFor(3)).to.equal(-4);
    expect(Attributes.modifierFor(8)).to.equal(-1);
    expect(Attributes.modifierFor(9)).to.equal(-1);
    expect(Attributes.modifierFor(10)).to.equal(0);
    expect(Attributes.modifierFor(11)).to.equal(0);
    expect(Attributes.modifierFor(12)).to.equal(1);
    expect(Attributes.modifierFor(13)).to.equal(1);
    expect(Attributes.modifierFor(18)).to.equal(4);
    expect(Attributes.modifierFor(19)).to.equal(4);
    expect(Attributes.modifierFor(20)).to.equal(5);
    expect(Attributes.modifierFor(30)).to.equal(10);
  });

  it("Sets and retrieves values", function() {
    let attributes = new Attributes({ str:16, dex:8, con:14, int:8, wis:8, cha:8 });

    expect(attributes.str()).to.equal(16);
    expect(attributes.conModifier()).to.equal(2);
    expect(attributes.getValue(_dex)).to.equal(8);
    expect(attributes.getModifier(_wis)).to.equal(-1);
  });

  it("Packs and unpacks attribute data", function() {
    let attributes = new Attributes({ str:19, dex:18, con:17, int:16, wis:15, cha:14 });
    let packed = attributes.pack();

    expect(packed.str).to.equal(19);
    expect(Attributes.unpack(packed).getValue(_dex)).to.equal(18);
  });

});
