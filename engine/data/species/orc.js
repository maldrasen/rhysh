
const orc = new Species('orc',{
  name: 'Orc',
  baseAttributes: { str:14, dex:12, con:16, int:8, wis:10, cha:8 },
  baseArmorClass: 10,
  baseHitPoints: 12,
});

orc.addGnosis('carnage');
orc.addGnosis('rage');
orc.addPower('bloodrage');

Species.register(orc);
