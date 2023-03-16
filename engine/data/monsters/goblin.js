
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

Monster.Goblin = class Goblin extends Monster {
  constructor(options = {}) {
    super(options);

    let sex = Random.fromFrequencyMap({
      female: 20,
      futa: 30,
      male: 50,
    });

    this.setName('Goblin');
    this.buildBody({
      sizeClass: _small,
      sex: sex
    });

    this.setBaseArmorClass(11);
    this.setBaseHit(2);
    this.setEssence(50);
    this.setMaxHitPoints(Random.rollDice({ d:6, p:6 }));
    this.setAttributes(new Attributes({
      str:8, dex:14, con:10, int:10, wis:8, cha:8
    }));

    this.setRandomArmor(GoblinArmorMap);
    this.setRandomWeapon(GoblinWeaponMap);
    this.addAbility('bad-idea');
    this.makeLewd();
  }
}

// TODO:
//   Goblins should have a hide and sneak attack skill. The monster manual
//   gives them a +6 stealth skill.
//
//   Nimble Escape. Another monster manual skill. Should translate into a
//   grapple resistance or a bonus to break out of holds.

// Scimitar. Melee Weapon Attack: +4 to hit, reach 5 ft., one
// target. Hit: 5 (1d6 + 2) slashing damage.
