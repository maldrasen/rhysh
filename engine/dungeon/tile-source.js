global.TileSource = class TileSource {

  constructor(properties) {
    this.name = properties.name;
    this.size = properties.size;
    this.layerOffset = (properties.layerOffset || 0);
    this.layers = [];

    forUpTo(this.size.z, _ => {
      this.layers.push(new Array(this.size.x * this.size.y));
    });
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

  // I'm storing the tiles in kind of a strange way. A FeatureTemplate has a 3D volume of tiles, though they'll usually
  // only be a single z-level. There's a layer for each z level, and each layer has a 1D array of tiles which is
  // indexed as a 2D plane.
  setTile(index, tile) {
    this.getLayer(index.z)[this.tileIndex(index.x,index.y)] = tile;
  }

  getTile(index) {
    return this.getLayer(index.z)[this.tileIndex(index.x,index.y)];
  }

  getLayer(z) {
    return this.layers[z - this.layerOffset];
  }

  tileIndex(x,y) {
    return x + (y * this.size.x);
  }

  // Because the feature will manipulate the tiles when it's built we need to provide a deep copy of the layers when
  // building features. We can't use JSON serialization to do the deepcopy because we need the class objects intact.
  copyLayers() {
    return this.layers.map(layer => {
      return layer.map(tile => {
        return tile.copy();
      })
    });
  }



}