global.FeatureTemplate = class FeatureTemplate {

  constructor(info) {
    this.layers = []
    this.name = info["Name"]
    this.canFlip = info["Flip"]
    this.size = new Vector(info["Width"], info["Height"], info["Depth"])

    // TODO: May get rid of this actually.
    if (info["SectorType"]) {
      this.sectorType = info["SectorType"]
    }

    forUpTo(this.size.z, _ => {
      this.layers.push(new Array(this.size.x * this.size.y));
    });
  }

  // I'm storing the tiles in kind of a strange way. A FeatureTemplate has a 3D volume of tiles, though they'll usually
  // only be a single z-level. There's a layer for each z level, and each layer has a 1D array of tiles which is
  // indexed as a 2D plane.
  setTile(index, tile) {
    this.layers[index.z][this.tileIndex(index)] = tile;
  }

  getTile(index) {
    return this.layers[index.z][this.tileIndex(index)];
  }

  tileIndex(index) {
    return index.x + (index.y * this.size.x);
  }

  // Because the feature will manipulate the tiles when it's built we need to provide a deep copy of the template when
  // building features. We can't use JSON serialization to do the deepcopy because we need the class objects intact.
  copyLayers() {
    return this.layers.map(layer => {
      return layer.map(tile => {
        return tile.copy();
      })
    });
  }

}
