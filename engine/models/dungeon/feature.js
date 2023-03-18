global.Feature = class Feature {

  #tileSource;
  #canFlip;

  constructor(name) {
    const template = FeatureTemplate.lookup(name);
    if (template == null) {
      throw `Error: No template named ${name}`
    }

    this.#tileSource = template.copyTileSource();
    this.#canFlip = template.canFlip;
  }

  getName() { return this.#tileSource.name; }
  getSize() { return this.#tileSource.size; }
  getTile(index) { return this.#tileSource.getTile(index); }
  eachTile(callback) { this.#tileSource.each(callback); }

  randomFlip() {
    if (this.#canFlip) {
      if (Random.flipCoin()) { FeatureFlipper.flipV(this.#tileSource); }
      if (Random.flipCoin()) { FeatureFlipper.flipH(this.#tileSource); }
      if (Random.flipCoin()) { FeatureFlipper.flipD(this.#tileSource); }
    }
  }

  forClient() {
    return this.#tileSource.forClient();
  }

  // === Feature Preview =======================================================

  static previewFeature() {
    const feature = Feature.fromDebugOptions();
          feature.randomFlip();

    Switchboard.render({
      showView: "FeaturePreview",
      feature: { tileSource:feature.forClient() },
    });
  }

  static fromDebugOptions = function() {
    const options = Environment.debugOptions.featurePreview;

    if (options.featureSets) { return Feature.randomFrom(options.featureSets); }
    if (options.featureName) { return new Feature(featureName); }
  }

  static randomFrom(sets) {
    let featureList = []

    sets.forEach(setName => {
      ObjectHelper.each(FeatureTemplate.fromSet(setName), (code, template) => {
        featureList.push(template.name);
      });
    });

    return new Feature(Random.from(featureList));
  }
}
