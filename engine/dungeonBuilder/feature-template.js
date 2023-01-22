global.FeatureTemplate = class FeatureTemplate {

  // A feature template is really just a tile source with some aditional properties.
  constructor(info) {
    this.canFlip = info["Flip"]
    this.tileSource = new TileSource({
      name: info["Name"],
      size: new Vector(info["Width"], info["Height"], info["Depth"]),
    });
  }

  // Pass through
  setTile(index, tile) { this.tileSource.setTile(index,tile); }
  getTile(index) { return this.tileSource.getTile(index); }
  copyLayers() { return this.tileSource.copyLayers(); }

}
