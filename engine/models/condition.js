global.Condition = class Condition {

  #condition;
  #statuses;
  #maxHitPoints;
  #currentHitPoints;

  constructor() {
    this.#condition = 'normal';
    this.#statuses = {};
  }

  getMaxHitPoints() { return this.#maxHitPoints; }
  setMaxHitPoints(points) {
    this.#maxHitPoints = points;
    this.#currentHitPoints = points;
  }

  getCurrentHitPoints() { return this.#currentHitPoints; }
  setCurrentHitPoints(points) { this.#currentHitPoints = points; }

  // The max hit points should only be set when the character is first created
  // by the character builder and only updated when the character levels or
  // something unusual happens. Setting the mex hitpoints also

  getMaxHitPoints() { return this.#maxHitPoints; }
  setMaxHitPoints(points) {
    this.#maxHitPoints = points;
    this.#currentHitPoints = points;
  }

  getCurrentHitPoints() { return this.#currentHitPoints; }

  adjustCurrentHitPoints(points) {
    this.#currentHitPoints += points;
    this.checkCondition();
  }

  setCurrentHitPoints(points) {
    this.#currentHitPoints = points;
    this.checkCondition();
  }

  doDamage(points) {
    this.#currentHitPoints -= points;
    this.checkCondition();
  }

  // Health is a percentage of current and max health.
  getHealth() {
    return Math.ceil(100 * this.getCurrentHitPoints() / this.getMaxHitPoints());
  }

  // When a character's hit points drop into the negative they've been knocked
  // unconcious. If their hit points drop to -max hitpoints they've been
  // killed.
  checkCondition() {
    let hp = this.getCurrentHitPoints();
    let max = this.getMaxHitPoints();

    if (hp <= 0 && hp > -max) { this.setCondition('fainted'); }
    if (hp <= -max) { this.setCondition('dead'); }
  }

  // === TODO ===
  // Conditions have priorities. A dead condition should not accidently be
  // overridden by a lesser condition. Sometimes a higher priority condition
  // can be overwritten though. If a character is healed from being unconcious
  // they need to move from 'fainted' to 'prone'. So setting the condition will
  // need to be a whole state machine thing, which is why I made it a separate
  // class, and made it work the same for monsters and normal characters.

  getCondition() { return this.#condition; }
  hasCondition(code) { return this.#condition == code; }

  setCondition(code) {
    ConditionType.lookup(code);
    this.#condition = code;
  }

  getStatuses() { return { ...this.#statuses }; }
  hasStatus(code) { return this.#statuses[code] != null; }
  removeStatus(code) { delete this.#statuses[code]; }
  setStatus(code, duration) {
    StatusDictionary.lookup(code);
    this.#statuses[code] = duration;
  }

  // === Persistance ===========================================================

  pack() {
    return {
      condition: this.#condition,
      statuses: this.#statuses,
      maxHitPoints: this.#maxHitPoints,
      currentHitPoints: this.#currentHitPoints,
    }
  }

  static unpack(data) {
    let condition = new Condition();
    condition.#condition = data.condition;
    condition.#statuses = data.statuses;
    condition.#maxHitPoints = data.maxHitPoints;
    condition.#currentHitPoints = data.currentHitPoints;

    return condition;
  }

}