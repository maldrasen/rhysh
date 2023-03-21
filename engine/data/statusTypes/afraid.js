const afraid = new StatusType(_afraid, {
  hitAdjustment: -2
});

afraid.addInterruptAction(new InterruptAction({
  chance: 10,
  actionType: _nothing,
  story: `{{A::Name}} cowers in fear.`,
}));

StatusType.register(afraid);
