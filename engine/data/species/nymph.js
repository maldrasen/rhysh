
const nymph = new Species('nymph',{
  name: 'Nymph',
  baseAttributes: { str:8, dex:10, con:8, int:14, wis:12, cha:16 },
  baseArmorClass: 10,
  baseHitPoints: 8,
});

nymph.addArcanum('delight');
nymph.addArcanum('rushing-waters');
nymph.addPower('aura-lust');

Species.register(nymph);
