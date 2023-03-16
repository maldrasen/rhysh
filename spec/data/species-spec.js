describe("Species",function() {

  it("Builds and registers a species", function() {
    let dragon = Species.lookup('dragonkind');
    expect(dragon.name).to.equal('Dragonkind');
    expect(dragon.powerList).to.eql(['fire-breath']);
  });

});