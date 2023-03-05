describe.only('ThreatTable', function() {

  it('sets and adds threat', function() {
    let table = new ThreatTable();
    table.setThreat('Bussy',100);
    table.addThreat('Bussy',10);
    expect(table.getThreat('Bussy')).to.equal(110);
  });

  it('drops threat', function() {
    let table = new ThreatTable();
    table.setThreat('Bussy',100);
    table.dropThreat('Bussy');
    expect(table.getThreat('Bussy')).to.equal(0);
  });

  it('gets highest threat', function() {
    let table = new ThreatTable();
    table.setThreat('Bussy',10);
    table.setThreat('Slappy',100);
    table.setThreat('Stabby',1000);
    expect(table.getHighestThreat()).to.equal('Stabby');
  });

});
