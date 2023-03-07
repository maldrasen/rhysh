
// TODO: Ability designed to destroy clothing. Should have a negative damage bonus.
// AbilityDictionary.register('sunder-armor', {});

AbilityDictionary.register('bad-idea', {
  type: 'attack',
  cooldown: 5,
  setCondition: { on:'self', condition:'prone', when:'always' },
  stories: [
    { bonusDamage: 3,
      attempt: `{{M::name}} charges at {{T::firstName}} swingingly his {{M::weapon.main-hand.name}} wildly.`,
      hit: `{{M::His}} desprate attack scores a deep hit on {{T::firstName's}} {{attack.slot-word}}, but leaves
            {{M::him}} sprawled out on the ground.`,
      miss: `He misses badly, falling flat on {{M::his}} face.` },
  ]
});
