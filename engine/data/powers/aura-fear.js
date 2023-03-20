let fear = new Power('aura-fear',{
  name: 'Fear Aura',
  abilityCode: 'terrify',
});

// Just guessing how passive effects will be implemented right now.
fear.addPassiveEffect({
  type: 'savingThrowAdjustment',
  effects: _allMonsters,
  savingThrowCategory: 'fear',
  adjustment: -2,
});

Power.register(fear);
