
const badIdea = new Ability({
  type: _attack,
  code: 'bad-idea',
  name: 'Bad Idea',
  damage:{ d:8, p:4 },
  setCondition: { on:_self, condition:_prone, when:_always },
  cooldown: 5,
});
badIdea.addStory(new Story({
  tryText: `{{A::Name}} charges at {{T::name}} swingingly {{A::his}} {{A::weapon.main-hand.name}} wildly.`,
  hitText: `{{A::His}} desprate attack scores a deep hit on {{T::name's}} {{battle|target-slot-word}}, but leaves
    {{A::him}} sprawled out on the ground.`,
  missText: `{{A::He}} misses badly, falling flat on {{A::his}} face.`,
}));

Ability.register(badIdea);
