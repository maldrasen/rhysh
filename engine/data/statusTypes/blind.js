const blind = new StatusType(_blind, {
  hitAdjustment: -4
});

blind.addInterruptAction(new InterruptAction({
  chance: 20,
  actionType: _nothing,
  story: `{{A::Name}} stumbles blindly.`,
}));

StatusType.register(blind);
