
// TODO: Ability designed to destroy clothing. Should have a negative damage bonus.
// AbilityDictionary.register('sunder-armor', {});

AbilityDictionary.register('bad-idea', {
  type: 'attack',
  cooldown: 5,
  setCondition: { on:'self', condition:'prone', when:'always' },
  stories: [
    { attempt: `{{M::TheMonster}} charges at {{T::firstName}} swingingly {{M::his}} {{M::weapon.main-hand.name}} wildly.`,
      hit: `{{M::His}} desprate attack scores a deep hit on {{T::firstName's}} {{battle|target-slot-word}}, but leaves
            {{M::him}} sprawled out on the ground.`,
      miss: `{{M::He}} misses badly, falling flat on {{M::his}} face.` },
  ]
});
