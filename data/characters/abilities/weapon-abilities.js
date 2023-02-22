
// TODO: Ability designed to destroy clothing. Should have a negative damage bonus.
// Ability.register('sunder-armor', {});

Ability.register('bad-idea', {
  type: 'attack',
  cooldown: 5,
  setCondition: { on:'self', condition:'prone' },
  stories: [
    { bonusDamage: 3,
      attempt: `{{monster-name}} charges at {{T::firstName}} swingingly his {{M::weapon.name}} wildly.`,
      hit: `{{M::His}} desprate attack scores a deep hit on {{T::firstName's}} {{attack-slot-word}}, but leaves
            {{M::him}} sprawled out on the ground.`,
      miss: `He misses badly, falling flat on {{M::his}} face.` },
  ]
});
