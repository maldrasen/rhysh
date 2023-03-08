
// TODO: Ability designed to destroy clothing. Should have a negative damage bonus.
// AbilityDictionary.register('sunder-armor', {});

AbilityDictionary.register('bad-idea', {
  type: 'attack',
  cooldown: 5,
  setCondition: { on:'self', condition:'prone', when:'always' },
  stories: [
    { attempt: `{{A::TheMonster}} charges at {{T::firstName}} swingingly {{A::his}} {{A::weapon.main-hand.name}} wildly.`,
      hit: `{{A::His}} desprate attack scores a deep hit on {{T::firstName's}} {{battle|target-slot-word}}, but leaves
            {{A::him}} sprawled out on the ground.`,
      miss: `{{A::He}} misses badly, falling flat on {{A::his}} face.` },
  ]
});
