describe('Scrutinizer', function() {

  it('checks a single basic requirement', function() {
    let screw = new Scrutinizer();
    expect(screw.meetsRequirements('TRUE')).to.be.true;
    expect(screw.meetsRequirements('FALSE')).to.be.false;
  });

  it('checks basic requirements as an And', function() {
    let screw = new Scrutinizer();
    expect(screw.meetsRequirements(['TRUE','TRUE'])).to.be.true;
    expect(screw.meetsRequirements(['TRUE','FALSE'])).to.be.false;
  });

  it('checks basic requirements as an Or', function() {
    let screw = new Scrutinizer();
    expect(screw.meetsRequirements([{ or:['TRUE','FALSE'] }])).to.be.true;
    expect(screw.meetsRequirements([{ or:['FALSE','FALSE'] }])).to.be.false;
  });

  it('checks state values', function() {
    let screw = new Scrutinizer();
        screw.setState({ sex:'filthy', gallonsOfCum:40 });

    expect(screw.meetsRequirements('state.sex=christian')).to.be.false;
    expect(screw.meetsRequirements('state.sex=filthy')).to.be.true;
    expect(screw.meetsRequirements('state.gallonsOfCum>30')).to.be.true;
    expect(screw.meetsRequirements('state.gallonsOfCum<30')).to.be.false;
  });

  it('checks flag values', function() {
    Flag.set('best.cock','horse');
    Flag.set('dicks.sucked',37);

    let screw = new Scrutinizer();

    expect(screw.meetsRequirements('flag.best.cock')).to.be.true;
    expect(screw.meetsRequirements('no-flag.worst.cock')).to.be.true;
    expect(screw.meetsRequirements('flag.best.cock=human')).to.be.false;
    expect(screw.meetsRequirements('flag.best.cock=horse')).to.be.true;
    expect(screw.meetsRequirements('flag.dicks.sucked>37')).to.be.false;
    expect(screw.meetsRequirements('flag.dicks.sucked>=37')).to.be.true;
  });

  describe("checkComparisonOperation()", function() {
    it('checks =', function() {
      expect(Scrutinizer.checkComparisonOperation('3','=','3')).to.be.true;
      expect(Scrutinizer.checkComparisonOperation('3','=','4')).to.be.false;
    });

    it('checks <=', function() {
      expect(Scrutinizer.checkComparisonOperation('3','<=','2')).to.be.false;
      expect(Scrutinizer.checkComparisonOperation('3','<=','3')).to.be.true;
      expect(Scrutinizer.checkComparisonOperation('3','<=','4')).to.be.true;
    });

    it('checks >=', function() {
      expect(Scrutinizer.checkComparisonOperation('3','>=','2')).to.be.true;
      expect(Scrutinizer.checkComparisonOperation('3','>=','3')).to.be.true;
      expect(Scrutinizer.checkComparisonOperation('3','>=','4')).to.be.false;
    });

    it ('checks <', function() {
      expect(Scrutinizer.checkComparisonOperation('2','<','3')).to.be.true;
      expect(Scrutinizer.checkComparisonOperation('3','<','3')).to.be.false;
    });

    it ('checks >', function() {
      expect(Scrutinizer.checkComparisonOperation('4','>','3')).to.be.true;
      expect(Scrutinizer.checkComparisonOperation('3','>','3')).to.be.false;
    });
  });

});
