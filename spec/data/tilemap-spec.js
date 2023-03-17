describe('Tilemap',function() {
  it("Loads Tilemaps and tile can be found.", function() {
    expect(Tilemap.lookupTile(_root,6).walls).to.equal('NSEW');
  });
})