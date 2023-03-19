
const GoblinArmorMap = {
  head:  { none:7, leather:2,  hide:1 },
  chest: { none:3, leather:5,  hide:2 },
  legs:  { none:2, leather:20, hide:2, cloth:4 },
  hands: { none:9, leather:1,  },
  feet:  { none:2, leather:6,  hide:2 },
}

const GoblinWeaponMap = {
  'club': 2,
  'club-shield': 1,
  'scimitar': 5,
  'scimitar-shield': 2,
  'spear': 3,
  'two-daggers': 2,
};

const GoblinSexMap = {
  female: 20,
  futa: 30,
  male: 50,
};

const GoblinAttributes = {
  str:8, dex:14, con:10, int:10, wis:8, cha:8
};

MonsterBuilder.register('goblin', options => {
  const goblin = new Monster(options);

  goblin.setName('Goblin');
  goblin.buildBody({
    sizeClass: _small,
    sex: Random.fromFrequencyMap(GoblinSexMap)
  });

  goblin.setBaseArmorClass(11);
  goblin.setBaseHit(2);
  goblin.setEssence(50);
  goblin.setMaxHitPoints(Random.rollDice({ d:6, p:6 }));
  goblin.setAttributes(new Attributes(GoblinAttributes));

  goblin.setRandomArmor(GoblinArmorMap);
  goblin.setRandomWeapon(GoblinWeaponMap);
  goblin.addAbility('bad-idea');
  goblin.makeLewd();

  setPortrait(goblin);

  return goblin;
});

function setPortrait(goblin) {
  if (goblin.getSex() == _female) { goblin.setPortrait(`monsters/goblin-f-01`); }
  if (goblin.getSex() == _futa)   { goblin.setPortrait(`monsters/goblin-h-0${Random.between(1,2)}`); }
  if (goblin.getSex() == _male)   { goblin.setPortrait(`monsters/goblin-m-0${Random.between(1,3)}`); }
}

// TODO:
//   Goblins should have a hide and sneak attack skill. The monster manual
//   gives them a +6 stealth skill.
//
//   Nimble Escape. Another monster manual skill. Should translate into a
//   grapple resistance or a bonus to break out of holds.

// Scimitar. Melee Weapon Attack: +4 to hit, reach 5 ft., one
// target. Hit: 5 (1d6 + 2) slashing damage.
