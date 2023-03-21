
ConditionType.register(new ConditionType(_normal,  { type:_normal }));

ConditionType.register(new ConditionType(_fainted, { type:_fallen }));
ConditionType.register(new ConditionType(_dead,    { type:_fallen }));

ConditionType.register(new ConditionType(_prone,     { type:_helpless }));
ConditionType.register(new ConditionType(_stunned,   { type:_helpless }));
ConditionType.register(new ConditionType(_paralyzed, { type:_helpless }));

ConditionType.register(new ConditionType(_holdingArms, { type:_hold }));
ConditionType.register(new ConditionType(_holdingBody, { type:_hold }));
ConditionType.register(new ConditionType(_holdingLegs, { type:_hold }));
