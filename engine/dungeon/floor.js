global.Floor = class Floor {

  static Type = {
    Normal: 0,
    Water: 1,
  }

  static normal() { return new Floor(Floor.Type.Normal); }
  static unpack(data) { return new Floor(data.type); }

  static fromString(string) {
    return {
      "Void":   () => { return null },
      "Normal": () => { return new Floor(Floor.Type.Normal) },
      "Water":  () => { return new Floor(Floor.Type.Water) },
    }[string]();
  }

  constructor(type) {
    this.type = type;
  }

  copy() {
    return new Floor(this.type);
  }

  isNormal() { return this.type == Floor.Type.Normal; }
  isWater() { return this.type == Floor.Type.Water; }

  forClient() {
    return {
      type: ObjectHelper.reverseLookup(Floor.Type, this.type)
    };
  }


}
