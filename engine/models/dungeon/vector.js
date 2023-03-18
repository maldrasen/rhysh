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
    if (direction == _N) { return this.translate(new Vector( 0,-1, 0)); }
    if (direction == _S) { return this.translate(new Vector( 0, 1, 0)); }
    if (direction == _E) { return this.translate(new Vector( 1, 0, 0)); }
    if (direction == _W) { return this.translate(new Vector(-1, 0, 0)); }
    if (direction == _U) { return this.translate(new Vector( 0, 0, 1)); }
    if (direction == _D) { return this.translate(new Vector( 0, 0,-1)); }
  }

  // The vector argument doesn't have to be a vector, just an object with an x,
  // y, and z property.
  equals(vector) {
    return this.x == vector.x &&
           this.y == vector.y &&
           this.z == vector.z;
  }

  toString() {
    return `(${this.x},${this.y},${this.z})`;
  }

  pack() {
    return { x:this.x, y:this.y, z:this.z }
  }

}