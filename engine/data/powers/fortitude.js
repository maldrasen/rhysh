
let fortitude = new Power('fortitude',{
  name: 'Fortitude',
  abilityCode: 'fortitude',
});

// Just guessing how passive effects will be implemented right now.
fortitude.addPassiveEffect({
  type: 'savingThrowAdjustment',
  effects: _self,
  savingThrowCategory: _saveAll,
  adjustment: 2,
});

Power.register(fortitude);
