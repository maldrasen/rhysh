const FeatureSetDictionary = {}

global.FeatureSet = class FeatureSet {

  static register(featureSet) {
    FeatureSetDictionary[featureSet.code] = featureSet;
  }

  static init() {
    Object.keys(FeatureSetDictionary).forEach(code => {
      FeatureSetDictionary[code].load();
    });
  }

  #code;
  #extensions;
  #featureSpecs;
  #filePath;

  constructor(code, options) {
    this.#code = code;
    this.#extensions = options.extensions;
    this.#filePath = options.filePath;
    this.#featureSpecs = options.featureSpecs;
  }

  get code() { return this.#code; }
  get extensions() { return this.#extensions; }
  get filePath() { return this.#filePath; }
  get featureSpecs() { return this.#featureSpecs; }

  load() {
    FeatureSetLoader.loadFeatures(this);
  }

}
