describe('Rhysh Calandar', function() {

  it('gets the season', function() {
    expect(RhyshCalendar.getSeason(50)).to.equal('Spring')
    expect(RhyshCalendar.getSeason(120)).to.equal('Summer')
    expect(RhyshCalendar.getSeason(250)).to.equal('Autumn')
    expect(RhyshCalendar.getSeason(300)).to.equal('Winter')
  });

  it('gets day names', function() {
    expect(RhyshCalendar.getDayName(50)).to.equal('Day of the Laughing Knight');
    expect(RhyshCalendar.getDayName(69)).to.equal('Day of the Blushing Wolf');
    expect(RhyshCalendar.getDayName(120)).to.equal('Day of the Indefatigable Elf');
    expect(RhyshCalendar.getDayName(250)).to.equal('Day of the Bound Knight');
    expect(RhyshCalendar.getDayName(300)).to.equal('Day of the Spectral Centaur');
    expect(RhyshCalendar.getDayName(700)).to.equal('Day of the Shadowed Fairies');
    expect(RhyshCalendar.getDayName(91)).to.equal('Festival of The Nymphs');
    expect(RhyshCalendar.getDayName(365)).to.equal('Great Festival of Rebirth');
  });

  it('gets the time of day', function() {
    expect(RhyshCalendar.getTimeOfDay(24*RhyshCalendar.TicksPerHour)).to.equal('Midnight');
    expect(RhyshCalendar.getTimeOfDay(0*RhyshCalendar.TicksPerHour)).to.equal('Midnight');
    expect(RhyshCalendar.getTimeOfDay(2*RhyshCalendar.TicksPerHour)).to.equal('Late Night');
    expect(RhyshCalendar.getTimeOfDay(4*RhyshCalendar.TicksPerHour)).to.equal('The Witching Hour');
    expect(RhyshCalendar.getTimeOfDay(7*RhyshCalendar.TicksPerHour)).to.equal('Dawn');
    expect(RhyshCalendar.getTimeOfDay(10*RhyshCalendar.TicksPerHour)).to.equal('Morning');
    expect(RhyshCalendar.getTimeOfDay(12*RhyshCalendar.TicksPerHour)).to.equal('Noon');
    expect(RhyshCalendar.getTimeOfDay(14*RhyshCalendar.TicksPerHour)).to.equal('Afternoon');
    expect(RhyshCalendar.getTimeOfDay(18*RhyshCalendar.TicksPerHour)).to.equal('Sunset');
    expect(RhyshCalendar.getTimeOfDay(20*RhyshCalendar.TicksPerHour)).to.equal('Evening');
    expect(RhyshCalendar.getTimeOfDay(22*RhyshCalendar.TicksPerHour)).to.equal('Night');
  });

});
