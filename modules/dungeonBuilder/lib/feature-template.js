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

  // # We need to force this to make a copy of all the tiles when creating a feature.
  // func copyLayers():
  //   var copy = []
  //   for layer in this.layers:
  //     var tiles = []
  //     for tile in layer:
  //       if tile:
  //         tiles.push_back(Tile.unpack(tile.pack()))
  //       else:
  //         tiles.push_back(null)
  //     copy.push_back(tiles)
  //   return copy

}
