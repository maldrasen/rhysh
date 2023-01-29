window.TileSource = class TileSource {

  constructor(source) {
    this.name = source.name;
    this.size = source.size;
    this.layers = source.layers;
    this.layerOffset = source.layerOffset;
  }

  each(callback) {
    forUpTo(this.size.z, z => {
      forUpTo(this.size.y, y => {
        forUpTo(this.size.x, x => {
          let index = new Vector(x,y,z);
          callback(new TileEntry(index, this.tileAt(index), this));
        });
      });
    });
  }

  tileAt(index) {
    return this.layers[index.z][this.tileIndex(index.x,index.y)]
  }

  tileIndex(x,y) {
    return x + (y * this.size.x);
  }

}


