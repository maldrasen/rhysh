
let fear = new Power('aura-fear',{
  name: 'Fear Aura',
  abilityCode: 'terrify',
});

// Just guessing how passive effects will be implemented right now.
fear.addPassiveEffect({
  type: 'savingThrowAdjustment',
  effects: _allMonsters,
  savingThrowCategory: _saveFear,
  adjustment: -2,
});

Power.register(fear);
