const fortitude = new Ability('fortitude',{
  type: _spell,
  name: 'Strong Like Bull',
  targetType: _self,
  cooldown: 8,
  icon: `../assets/icons/ability-fortitude.png`,
});

fortitude.addStory(new BattleStory({
  actionText: `{{A::Name}} throbs with virile strength.`,
}));

Ability.register(fortitude);
