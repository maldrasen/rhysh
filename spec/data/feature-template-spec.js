describe('FeatureTemplate',function() {

  it("Loads FeatureSets", function() {
    let template = FeatureTemplate.lookup('Cave-1-1');
    let tile = template.getTile(new Vector(3,2,0));
    expect(tile.fillName).to.equal('dungeon');
    expect(template.setName).to.equal('caves');
  });

  it('gets all features in a set', function() {
    let templates = FeatureTemplate.fromSet('farms')
    expect(Object.keys(templates).length).to.equal(17);
    expect(templates['Farm-1-1']).to.not.be.null;
  });

});
