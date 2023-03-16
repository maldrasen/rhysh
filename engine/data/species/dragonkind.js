
const dragonkind = new Species({
  name: 'Dragonkind',
  baseAttributes: { str:14, dex:14, con:12, int:14, wis:12, cha:12 },
  baseArmorClass: 14,
  baseHitPoints: 20,
  experienceFactor: 0.8,
});

dragonkind.addArcanum('flame');
dragonkind.addGnosis('scales');
dragonkind.addPower('fire-breath');

Species.register('dragonkind',dragonkind)

