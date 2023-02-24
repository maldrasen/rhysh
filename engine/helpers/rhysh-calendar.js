global.RhyshCalendar = (function() {

  // In the Rhysh Calander every day in the year has a unique name which is
  // generated from a pair of seasonal cycles. Between the 90 day seasons there
  // are four festivals with two festival days occuring at new years. This is
  // really just for display purposes and to give the world a bit of flavor.

  const Seasons = {
    'Spring': [ 'Laughing',  'Lustful',  'Singing',    'Young',      'Fertile',
                'Turgid',    'Lucky',    'Virgin',     'Delightful', 'Blushing'],
    'Summer': [ 'Screaming', 'Radiant',  'Naked',      'Well Hung',  'Sultry',
                'Dripping',  'Envious',  'Drunken',    'Formidable', 'Indefatigable'],
    'Autumn': [ 'Silent',    'Tranquil', 'Voluptuous', 'Hidden',     'Proud',
                'Abundant',  'Knotted',  'Dirty',      'Bound',      'Deceitful' ],
    'Winter': [ 'Frigid',    'Howling',  'Shadowed',   'Ancient',    'Slumbering',
                'Twisted',   'Defiled',  'Spectral',   'Merciless',  'Weeping' ],
  };

  const Honorifics = [
    'Centaur', 'Demon', 'Elf', 'Dragon', 'Goblin',
    'Knight', 'Wolf', 'Concubine', 'Fairies'
  ];

  const FestivalDays = {
    91:  'Festival of The Nymphs',
    182: 'Festival of The Satyrs',
    273: 'Festival of The Demons',
    364: 'Festival of The Dead',
    365: 'Great Festival of Rebirth',
  };

  function getSeason(dayNumber) {
    if (dayNumber > 365) { dayNumber = dayNumber % 365; }

    if (dayNumber <= 91)  { return 'Spring'; }
    if (dayNumber <= 182) { return 'Summer'; }
    if (dayNumber <= 273) { return 'Autumn'; }
    return 'Winter';
  }

  function getDayName(dayNumber) {
    if (dayNumber > 365) { dayNumber = dayNumber % 365; }

    if (FestivalDays[dayNumber]) { return FestivalDays[dayNumber]; }

    let season = getSeason(dayNumber);
    let seasonDays = Seasons[season];

    let cycleNumber = dayNumber;
    if (dayNumber > 91  && dayNumber < 182) { cycleNumber = dayNumber - 91; }
    if (dayNumber > 182 && dayNumber < 273) { cycleNumber = dayNumber - 182; }
    if (dayNumber > 273 && dayNumber < 364) { cycleNumber = dayNumber - 273; }

    let lesser = seasonDays[cycleNumber % 10];
    let greater = Honorifics[cycleNumber % 9];

    return `Day of the ${lesser} ${greater}`;
  }

  return {
    getSeason,
    getDayName,
  }

})();
