global.Vector = class Vector {

  static from(object) {
    return new Vector(object.x, object.y, object.z);
  }
  
  constructor(x,y,z=null) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  translate(vector) {
    return new Vector(
      this.x + vector.x,
      this.y + vector.y,
      this.z + vector.z);
  }

  go(direction) {
    if (direction == N) { return this.translate(new Vector( 0,-1, 0)); }
    if (direction == S) { return this.translate(new Vector( 0, 1, 0)); }
    if (direction == E) { return this.translate(new Vector( 1, 0, 0)); }
    if (direction == W) { return this.translate(new Vector(-1, 0, 0)); }
    if (direction == U) { return this.translate(new Vector( 0, 0, 1)); }
    if (direction == D) { return this.translate(new Vector( 0, 0,-1)); }
  }

  equals(vector) {
    return this.x == vector.x &&
           this.y == vector.y &&
           this.z == vector.z;
  }

  toString() {
    return `(${this.x},${this.y},${this.z})`;
  }

}