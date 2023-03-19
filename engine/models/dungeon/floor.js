global.Floor = class Floor {

  static normal() { return new Floor(_floorNormal); }

  static fromString(string) {
    return {
      Void:   () => { return null },
      Normal: () => { return new Floor(_floorNormal) },
      Water:  () => { return new Floor(_floorWater) },
    }[string]();
  }

  #type;

  constructor(type) {
    this.#type = type;
  }

  get type() { console.trace(); throw 'Use getType() instead.' }

  getType() { return this.#type; }
  isNormal() { return this.#type == _floorNormal; }
  isWater() { return this.#type == _floorWater; }

  // === Persistance ===========================================================

  copy() {
    return new Floor(this.#type);
  }

  pack() {
    return { type: this.#type };
  }

  static unpack(data) {
    return new Floor(data.type);
  }

}
