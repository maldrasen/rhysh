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

  constructor(code, options) {
    this.#code = code;
    this.#type = options.type;
  }

  get code() { return this.#code; }
  get type() { return this.#type; }
}

ConditionType.register(new ConditionType(_normal,  {}));
ConditionType.register(new ConditionType(_fainted, {}));
ConditionType.register(new ConditionType(_dead,    {}));

ConditionType.register(new ConditionType(_prone,   { type:'stun' }));
ConditionType.register(new ConditionType(_stunned, { type:'stun' }));

ConditionType.register(new ConditionType(_holdingArms, { type:'hold' }));
ConditionType.register(new ConditionType(_holdingBody, { type:'hold' }));
ConditionType.register(new ConditionType(_holdingLegs, { type: 'hold' }));
