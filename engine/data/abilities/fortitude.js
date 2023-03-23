const fortitude = new Ability('fortitude',{
  type: _spell,
  spellType: _singleEffect,
  fromPower: 'fortitude',
  name: 'Testicular Fortitude',

  targetType: _self,
  cooldown: 8,
  icon: `../assets/icons/ability-fortitude.png`,
});

fortitude.addActionStory({ text:`{{A::Name}} throbs with virile strength.` });

Ability.register(fortitude);
