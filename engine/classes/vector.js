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

}