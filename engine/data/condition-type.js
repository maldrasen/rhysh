const ConditionDictionary = {}

global.ConditionType = class Condition {

  static register(condition) {
    ConditionDictionary[condition.code] = condition;
  }

  static lookup(code) {
    if (ConditionDictionary[code] == null) { throw `Unknown Condition Type: ${code}` }
    return ConditionDictionary[code];
  }

  #code;
  #type;

  constructor(options) {
    this.#code = options.code;
    this.#type = options.type;
  }

  get code() { return this.#code; }
  get type() { return this.#type; }
}

ConditionType.register(new ConditionType({
  code:_normal
}));

ConditionType.register(new ConditionType({
  code:_fainted
}));

ConditionType.register(new ConditionType({
  code:_dead
}));

ConditionType.register(new ConditionType({
  code:_prone,
  type:'stun',
}));

ConditionType.register(new ConditionType({
  code:_stunned,
  type:'stun',
}));

ConditionType.register(new ConditionType({
  code: _holdingArms,
  type: 'hold',
}));

ConditionType.register(new ConditionType({
  code: _holdingBody,
  type: 'hold',
}));

ConditionType.register(new ConditionType({
  code: _holdingLegs,
  type: 'hold',
}));
