Monster.Mudcrab = class Mudcrab extends Monster {
  constructor() {
    super({});

    this.setName('Mudcrab');

    this.buildBody({
      bodyPlan: MonsterBodyPlans.Crabby,
      sizeClass: _small,
    });

    this.setBaseArmorClass(12);
    this.setBaseHit(0);
    this.setEssence(50);
    this.setMaxHitPoints(Random.rollDice({ x:1, d:6, p:2 }));
    this.setAttributes(new Attributes({
      str:12, dex:10, con:14, int:4, wis:4, cha:4
    }));

    this.setBasicAttackDamage({ d:4 });
    this.setBasicAttackText(`The Mudcrab attacks {{T::name}} with its claws.`);

    this.addAbility('crab-cock-claw');
    this.addAbility('crab-tit-claw');
    this.addAbility('crab-grab-legs');
    this.addAbility('crab-grab-arms');
    this.addAbility('crab-leg-crush');
    this.addAbility('crab-arm-crush');
    this.addAbility('crab-brutalize');
  }
}
