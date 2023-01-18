global.Floor = class Floor {

  static Type = {
    Normal: 0,
    Water: 1,
  }

  static normal() {
    return new Floor(Floor.Type.Normal);
  }

  constructor(type) {
    this.type = type;
  }

  isNormal() { return this.type == Floor.Type.Normal; }
  isWater() { return this.type == Floor.Type.Water; }

}
