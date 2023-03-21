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
  #category;

  constructor(code, options) {
    this.#code = code;
    this.#category = options.category;
  }

  get code() { return this.#code; }
  get category() { return this.#category; }
}
