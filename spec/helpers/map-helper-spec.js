describe('MapHelper', function() {

  it("parses layer names", function() {
    let info = MapHelper.parseLayerName("Extra 2");
    expect(info.type).to.equal("extra");
    expect(info.index).to.equal(1);
  });

});
