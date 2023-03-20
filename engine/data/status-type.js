const StatusDictionary = {}

global.StatusType = class Condition {

  static register(status) {
    StatusDictionary[status.code] = status;
  }

  static lookup(code) {
    if (StatusDictionary[code] == null) { throw `Unknown Status Type: ${code}` }
    return StatusDictionary[code];
  }

  #code;
  #armorClassAdjustment;
  #attributeAdjustment;
  #damageAdjustment;
  #hitAdjustment;
  #binds;
  #interruptActions;

  constructor(code, options) {
    this.#code = code;
    this.#armorClassAdjustment = options.armorClassAdjustment;
    this.#attributeAdjustment = options.attributeAdjustment;
    this.#damageAdjustment = options.damageAdjustment;
    this.#hitAdjustment = options.hitAdjustment;
    this.#binds = options.binds || [];
    this.#interruptActions = [];
  }

  get code() { return this.#code; }
  get armorClassAdjustment() { return this.#armorClassAdjustment; }
  get attributeAdjustment() { return this.#attributeAdjustment; }
  get hitAdjustment() { return this.#hitAdjustment; }
  get binds() { return this.#binds; }
  get interruptActions() { return this.#interruptActions; }

  addInterruptAction(action) {
    this.interruptActions.push(action);
  }

  pack() {
    let packed = { code:this.#code }

    if (this.#armorClassAdjustment) { packed.armorClassAdjustment = this.#armorClassAdjustment; }
    if (this.#attributeAdjustment) { packed.attributeAdjustment = this.#attributeAdjustment; }
    if (this.#damageAdjustment) { packed.damageAdjustment = this.#damageAdjustment; }
    if (this.#hitAdjustment) { packed.hitAdjustment = this.#hitAdjustment; }
    if (this.#binds) { packed.binds = this.#binds; }

    if (this.#interruptActions) {
      packed.interruptActions = this.#interruptActions.map(interrupt => {
        return interupt.pack();
      });
    }

    return packed;
  }

}
