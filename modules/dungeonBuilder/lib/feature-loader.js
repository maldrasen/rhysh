global.FeatureLoader = class FeatureLoader {

  constructor(name) {
    this.featureMap = DungeonBuilder.loadFeatureMap(name)
    this.featureData = DungeonBuilder.loadFeatureData(name)
  }

  loadFeatures() {
    console.log("  Load Features");
  }

};