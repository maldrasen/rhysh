global.ThreatTable = class ThreatTable {

  #threat;

  constructor() {
    this.#threat = {};
  }

  getThreat(code) { return this.#threat[code]; }
  setThreat(code, threat) { this.#threat[code] = threat; }
  dropThreat(code) { this.#threat[code] = 0; }

  addThreat(code, threat) {
    if (this.#threat[code] == null) { this.#threat[code] = 0; }
    this.#threat[code] += threat;
  }

  getHighestThreat() {
    let maxCode = null;
    let maxValue = 0;

    ObjectHelper.each(this.#threat, (code, value) => {
      if (value > maxValue) {
        maxCode = code;
        maxValue = value;
      }
    });

    return maxCode;
  }

}