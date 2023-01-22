global.Vector = class Vector {
  
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

  equals(vector) {
    return this.x == vector.x &&
           this.y == vector.y &&
           this.z == vector.z;
  }

  toString() {
    return `(${this.x},${this.y},${this.z})`;
  }

}