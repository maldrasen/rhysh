
const satyr = new Species({
  name: 'Satyr',
  baseAttributes: { str:14, dex:12, con:12, int:8,  wis:8,  cha:14 },
  baseArmorClass: 10,
  baseHitPoints: 10,
});

satyr.addArcanum('deep-wood');
satyr.addPower('aura-lust');

Species.register('satyr',satyr)
