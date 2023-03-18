describe('Feature', function() {

  it('gets a random feature from a set', function() {
    expect(Feature.randomFrom(['farms'])).to.not.be.null;
  });

});
