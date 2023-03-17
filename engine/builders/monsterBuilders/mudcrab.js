
MonsterBuilder.register('mudcrab', options => {
  const crab = new Monster(options)

  crab.setName('Mudcrab');
  crab.buildBody({
    bodyPlan: 'crabby',
    sizeClass: _small,
  });

  crab.setBaseArmorClass(12);
  crab.setBaseHit(0);
  crab.setEssence(50);
  crab.setMaxHitPoints(Random.rollDice({ x:1, d:6, p:2 }));
  crab.setAttributes(new Attributes({
    str:12, dex:10, con:14, int:4, wis:4, cha:4
  }));

  crab.setBasicAttackDamage({ d:4 });
  crab.setBasicAttackText(`The Mudcrab attacks {{T::name}} with its claws.`);

  crab.addAbility('crab-cock-claw');
  crab.addAbility('crab-tit-claw');
  crab.addAbility('crab-grab-legs');
  crab.addAbility('crab-grab-arms');
  crab.addAbility('crab-leg-crush');
  crab.addAbility('crab-arm-crush');
  crab.addAbility('crab-brutalize');

  return crab;
});
