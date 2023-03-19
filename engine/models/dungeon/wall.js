global.Wall = class Wall {

  static normal() { return new Wall(_wallNormal); }
  static door() { return new Wall(_wallDoor); }

  #type;

  constructor(type) {
    this.#type = type;
  }

  get type() { console.trace(); throw 'Use getType() instead.' }

  getType() { return this.#type; }
  isNormal() { return this.#type == _wallNormal; }
  isDoor() { return this.#type == _wallDoor; }
  isFence() { return this.#type == _wallFence; }

  // === Persistance ===========================================================

  copy() {
    return new Wall(this.#type);
  }

  pack() {
    return { type: this.#type };
  }

  static unpack(data) {
    return new Wall(data.type);
  }

}
