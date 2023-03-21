
StatusType.register(new StatusType(_defensive,{ armorClassAdjustment:4 }));
StatusType.register(new StatusType(_riposte,  { armorClassAdjustment:2 }));

// The chest or leg armor has been stripped off or destroyed somehow. These
// status effects don't prevent any actions, but influence story and
// monster ability selection.
StatusType.register(new StatusType(_groinExposed,{}));
StatusType.register(new StatusType(_chestExposed,{}));
