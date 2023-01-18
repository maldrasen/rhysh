global.Wall = class Wall {

  static Type = {
    Normal: 0,
    Door: 1,
    Fence: 2,
  }

  static normal() {
    return new Wall(Wall.Type.Normal);
  }

  constructor(type) {
    this.type = type;
  }

  isNormal() { return this.type == Wall.Type.Normal; }
  isDoor() { return this.type == Wall.Type.Door; }
  isFence() { return this.type == Wall.Type.Fence; }

}
