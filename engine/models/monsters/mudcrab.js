Monster.Mudcrab = class Mudcrab extends Monster {

  constructor() {
    super({});

    this.setNaturalArmorClass(12);
    this.setEssence(50);
    this.setHitPoints(Random.rollDice({ x:1, d:6, p:2 }));
    this.setAttributes(new Attributes({
      str:12, dex:10, con:14, int:4, wis:4, cha:4
    }));

    this.setSlots({ head:1, back:4, legs:3, claws:1 });
    this.addAbility({ type:'crab-claw', hit:0, damage:{ d:4 }});
    this.addAbility({ type:'crab-grab-legs', hit:0 });
    this.addAbility({ type:'crab-grab-arms', hit:0 });
    this.addAbility({ type:'crab-leg-crush', damage:{ d:4, p:4 }});
    this.addAbility({ type:'crab-arm-crush', damage:{ d:4, p:4 }});
    this.addAbility({ type:'crab-brutalize', damage:{ d:8, p:4 }});
  }
}




