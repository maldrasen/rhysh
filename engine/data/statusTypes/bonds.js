
StatusType.register(new StatusType(_boundLegs,{
  attributeAdjustment:{ dex:-2 },
  binds:[_legs],
}));

StatusType.register(new StatusType(_boundArms,{
  attributeAdjustment:{ dex:-4 },
  binds:[_hands],
}));

StatusType.register(new StatusType(_boundBody,{
  attributeAdjustment:{ dex:-6 },
  binds:[_legs,_hands],
}));
