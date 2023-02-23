global.Equipment = class Equipment {

  constructor() {}

  // === Persistance ===========================================================

  pack() {
    return {
    }
  }

  static unpack(data) {
    let equipment = new Equipment();
    return equipment;
  }

}
