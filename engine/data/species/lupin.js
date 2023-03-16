
const lupin = new Species({
  name: 'Lupin',
  baseAttributes: { str:14, dex:14, con:16, int:12, wis:10, cha:10 },
  baseArmorClass: 12,
  baseHitPoints: 16,
  experienceFactor: 0.9,
});

lupin.addArcanum('dreams');
lupin.addGnosis('strife');
lupin.addGnosis('claw');
lupin.addPower('regeneration');

Species.register('lupin',lupin)
