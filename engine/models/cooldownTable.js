global.CooldownTable = class CooldownTable {

  #table;

  constructor() { this.#table = {} }

  get(code) { return this.#table[code]; }
  set(code, rounds) { this.#table[code] = rounds; }
  onCooldown(code) { return this.#table[code] != null; }

  reduce() {
    let old = this.#table;
    this.#table = {};

    ObjectHelper.each(old, (code, rounds) => {
      if (rounds-1 > 0) { this.#table[code] = rounds - 1; }
    });
  }

}

