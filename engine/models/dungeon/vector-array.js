global.VectorArray = class VectorArray {

  constructor(size=0) {
    this.vectors = new Array(size);
  }

  get(index) { return this.vectors[index]; }
  size() { return this.vectors.length; }

  push(vector) {
    this.vectors.push(vector);
  }

  each(callback) {
    this.vectors.forEach(callback);
  }

  getRandom() {
    return Random.from(this.vectors);
  }

  copy() {
    let copy = new VectorArray();
    copy.vectors = [...this.vectors];
    return copy;
  }

  indexOf(vector) {
    for (let i=0; i<this.vectors.length; i++) {
      if (this.vectors[i].equals(vector)) {
        return i;
      }
    }
    return -1;
  }

  has(vector) {
    return this.indexOf(vector) >= 0
  }

  remove(vector) {
    let index = this.indexOf(vector);
    (index >= 0) ? this.vectors.splice(index, 1) : this.vectors;
  }

}