
const minotaur = new Species({
  code: 'minotaur',
  name: 'Minotaur',
  baseAttributes: { str:18, dex:8, con:16, int:8, wis:8, cha:10 },
  baseArmorClass: 11,
  baseHitPoints: 24,
});

minotaur.addGnosis('strife');
minotaur.addGnosis('hooves');
minotaur.addPower('fortitude');

Species.register(minotaur);
