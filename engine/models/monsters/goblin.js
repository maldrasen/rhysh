Monster.Goblin = class Goblin extends Monster {

  constructor(options = {}) {
    super(options);

    this.setArmorClass(15);
    this.setEssence(50);
    this.setHitPoints(Random.rollDice({ x:1, d:6, p:6 }));
    this.setAttributes(new Attributes({
      str:8, dex:14, con:10, int:10, wis:8, cha:8
    }));

    this.addAbility(Ability.weaponSlash({
      name: 'scimitar',
      toHit: 4,
      damage: { d:6, p:2 }
    }));

    this.addAbility(Ability.weaponWildSlash({
      name: 'scimitar',
      toHit: 0,
      damage: { d:6, p:6 },
      cooldown: 3,
    }))
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
