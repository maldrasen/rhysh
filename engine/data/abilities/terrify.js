const terrify = new Ability('terrify',{
  type: _spell,
  name: 'All Hope is Lost',
  targetType: _allMonsters,
  cooldown: 8,
  savingThrow: { category:_fear, dc:10 },
  addStatus: { on:_allMonsters, status:_afraid, when:_success },
});

Ability.register(terrify);
