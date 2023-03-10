global.Wall = class Wall {

  static Type = {
    Normal: 0,
    Door: 1,
    Fence: 2,
  }

  static normal() { return new Wall(Wall.Type.Normal); }
  static door() { return new Wall(Wall.Type.Door); }
  static unpack(data) { return new Wall(data.type); }

  constructor(type) {
    this.type = type;
  }

  copy() {
    return new Wall(this.type);
  }

  isNormal() { return this.type == Wall.Type.Normal; }
  isDoor() { return this.type == Wall.Type.Door; }
  isFence() { return this.type == Wall.Type.Fence; }

  forClient() {
    return {
      type: ObjectHelper.reverseLookup(Wall.Type, this.type)
    };
  }

}
