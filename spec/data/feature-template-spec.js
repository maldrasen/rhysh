describe('FeatureTemplate',function() {

  it("Loads FeatureSets", function() {
    let template = FeatureTemplate.lookup('Cave-1-1');
    let tile = template.getTile(new Vector(3,2,0));
    expect(tile.fillName).to.equal('dungeon');
  });

});
