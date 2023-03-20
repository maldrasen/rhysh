const berserk = new StatusType(_berserk, {
  hitAdjustment: -2,
  damageAdjustment: 4,
});

berserk.addInterruptAction(new InterruptAction({
  actionType: _attack,
  targetType: _random,
}));

StatusType.register(berserk);
