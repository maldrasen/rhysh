global.FeatureTemplate = class FeatureTemplate {

  #canFlip;
  #tileSource;

  // A feature template is really just a tile source with some aditional properties.
  constructor(spec) {
    this.#canFlip = spec.flip;
    this.#tileSource = new TileSource({
      name: spec.name,
      size: new Vector(spec.width, spec.height, spec.depth),
    });
  }

  canFlip() { return this.#canFlip; }
  getName() { return this.#tileSource.name; }
  getSize() { return this.#tileSource.size; }
  getTile(index) { return this.#tileSource.getTile(index); }
  setTile(index, tile) { this.#tileSource.setTile(index,tile); }
  copyTileSource() { return this.#tileSource.copy(); }
}
