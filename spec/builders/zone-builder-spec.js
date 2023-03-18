describe('ZoneBuilder', function() {

  it('builds Wolgur', function() {
    let builder = new ZoneBuilder('wolgur');
    builder.buildZone();
  });

  it.only('builds Wolgur Cleft', function() {
    let builder = new ZoneBuilder('wolgur-cleft');
    builder.buildZone();
  });

});
