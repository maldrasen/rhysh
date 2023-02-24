describe.only('Rhysh Calandar', function() {

  it('gets the season', function() {
    expect(RhyshCalendar.getSeason(50)).to.equal('Spring')
    expect(RhyshCalendar.getSeason(120)).to.equal('Summer')
    expect(RhyshCalendar.getSeason(250)).to.equal('Autumn')
    expect(RhyshCalendar.getSeason(300)).to.equal('Winter')
  });

  it('gets day names', function() {
    expect(RhyshCalendar.getDayName(50)).to.equal('Day of the Laughing Knight');
    expect(RhyshCalendar.getDayName(120)).to.equal('Day of the Indefatigable Elf');
    expect(RhyshCalendar.getDayName(250)).to.equal('Day of the Bound Knight');
    expect(RhyshCalendar.getDayName(300)).to.equal('Day of the Spectral Centaur');
    expect(RhyshCalendar.getDayName(700)).to.equal('Day of the Shadowed Fairies');
    expect(RhyshCalendar.getDayName(91)).to.equal('Festival of The Nymphs');
    expect(RhyshCalendar.getDayName(365)).to.equal('Great Festival of Rebirth');
  });

});
