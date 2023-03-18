const FeatureTemplateDictionary = {}

global.FeatureTemplate = class FeatureTemplate {

  static register(template) {
    FeatureTemplateDictionary[template.name] = template;
  }

  static lookup(name) {
    if (FeatureTemplateDictionary[name] == null) { throw `Unknown Feature Template (${name})` }
    return FeatureTemplateDictionary[name];
  }

  #setName;
  #canFlip;
  #tileSource;

  // A feature template is really just a tile source with some aditional properties.
  constructor(setName, spec) {
    this.#setName = setName;
    this.#canFlip = spec.flip;
    this.#tileSource = new TileSource({
      name: spec.name,
      size: new Vector(spec.width, spec.height, spec.depth),
    });
  }

  get setName() { return this.#setName; }
  get canFlip() { return this.#canFlip; }
  get name() { return this.#tileSource.name; }
  get size() { return this.#tileSource.size; }

  getTile(index) { return this.#tileSource.getTile(index); }
  setTile(index, tile) { this.#tileSource.setTile(index,tile); }
  copyTileSource() { return this.#tileSource.copy(); }
}
