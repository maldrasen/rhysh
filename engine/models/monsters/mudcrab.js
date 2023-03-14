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

    this.addAbility({ code:'crab-claw', damage:{ d:4 }});
    this.addAbility({ code:'crab-grab-legs', hit:-2 });
    this.addAbility({ code:'crab-grab-arms', hit:-2 });
    this.addAbility({ code:'crab-leg-crush', damage:{ d:4, p:4 }});
    this.addAbility({ code:'crab-arm-crush', damage:{ d:4, p:4 }});
    this.addAbility({ code:'crab-brutalize', damage:{ d:8, p:4 }});
  }
}
