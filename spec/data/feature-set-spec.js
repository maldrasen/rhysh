describe('FeatureSet',function() {
  it("Loads FeatureSets", function() {
    FeatureSet.init();

    let template = FeatureSet.lookup('caves').featureTemplates[0];
    let tile = template.getTile(new Vector(3,2,0));

    expect(template.getName()).to.equal('Cave-1-1');
    expect(tile.fillName).to.equal('dungeon');
  });
})