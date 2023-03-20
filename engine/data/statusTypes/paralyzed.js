
const paralyzed = new StatusType(_paralyzed, {
  attributeAdjustment: { dex:-100 },
  binds: [_hands, _legs, _mouth],
});

paralyzed.addInterruptAction(new InterruptAction({
  chance: 100,
  actionType: _nothing,
  story: `{{A::Name}} can't move.`,
}));

StatusType.register(paralyzed);
