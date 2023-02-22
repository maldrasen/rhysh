Monster.Mudcrab = class Mudcrab extends Monster {

  constructor() {
    super({});

    this.setName("Mudcrab");
    this.setBaseArmorClass(12);
    this.setBaseHit(0);
    this.setEssence(50);
    this.setMaxHitPoints(Random.rollDice({ x:1, d:6, p:2 }));
    this.setAttributes(new Attributes({
      str:12, dex:10, con:14, int:4, wis:4, cha:4
    }));

    this.setSlots({ head:1, back:4, legs:3, claws:1 });
    this.addAbility({ code:'crab-claw', hit:0, damage:{ d:4 }});
    this.addAbility({ code:'crab-grab-legs', hit:0 });
    this.addAbility({ code:'crab-grab-arms', hit:0 });
    this.addAbility({ code:'crab-leg-crush', damage:{ d:4, p:4 }});
    this.addAbility({ code:'crab-arm-crush', damage:{ d:4, p:4 }});
    this.addAbility({ code:'crab-brutalize', damage:{ d:8, p:4 }});
  }

}
