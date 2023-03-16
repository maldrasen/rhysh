
const elf = new Species({
  code: 'elf',
  name: 'Elf',
  baseAttributes: { str:12, dex:14, con:10, int:12, wis:10, cha:10 },
  baseArmorClass: 10,
  baseHitPoints: 10,
});

elf.addArcanum('dreams');
elf.addGnosis('strife');

Species.register(elf);
