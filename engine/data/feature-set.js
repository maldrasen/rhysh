const FeatureSetDictionary = {}

global.FeatureSet = class FeatureSet {

  static register(featureSet) {
    FeatureSetDictionary[featureSet.code] = featureSet;
  }

  static lookup(code) {
    if (FeatureSetDictionary[code] == null) { throw `Unknown Feature Set (${code})` }
    return FeatureSetDictionary[code];
  }

  static init() {
    console.log(" - Loading feature sets.");
    Object.keys(FeatureSetDictionary).forEach(code => {
      FeatureSetDictionary[code].load();
    });
  }

  // TODO: We'll need these again.

  // function randomFeatureFromSet(name) {
  //   return new Feature(Random.from($featureSets[name]));
  // }

  // function randomFeatureFromSets(sets) {
  //   let featureList = []

  //   sets.forEach(setName => {
  //     if ($featureSets[setName]) {
  //       $featureSets[setName].forEach(featureName => {
  //         featureList.push(featureName);
  //       });
  //     }
  //   });

  //   return new Feature(Random.from(featureList));
  // }

  #code;
  #extensions;
  #featureTemplates;
  #featureSpecs;

  // Used when loading.
  #filePath;
  #featureMap;

  constructor(code, options) {
    this.#code = code;
    this.#extensions = options.extensions;
    this.#filePath = options.filePath;
    this.#featureSpecs = options.featureSpecs;
    this.#featureTemplates = [];
  }

  get code() { return this.#code; }
  get extensions() { return this.#extensions; }
  get filePath() { return this.#filePath; }
  get featureTemplates() { return this.#featureTemplates; }

  load() {
    this.#featureMap = JSON.parse(fs.readFileSync(this.#filePath));
    this.#featureSpecs.forEach(spec => {
      this.loadFeature(spec)
    });
  }

  loadFeature(spec) {
    let tileData = this.loadTileData(spec);
    let featureTemplate = new FeatureTemplate(spec);

    forUpTo(tileData.length, layerIndex => {
      let layer = tileData[layerIndex];
      forUpTo(spec.height, y => {
        forUpTo(spec.width, x => {
          let tileIndex = x + (y * spec.width);
          if (layer[tileIndex]) {
            let dungeonIndex = new Vector(x,y,layerIndex);
            featureTemplate.setTile(dungeonIndex, Tile.fromTileData(layer[tileIndex], null, dungeonIndex));
          }
        });
      });
    });

    this.#featureTemplates.push(featureTemplate);
  }

  // Though the features have to do the same kind of map parsing as the zones,
  // the way these layers are loaded is completely different. A feature map can
  // contain many individual features, and can be of any size.
  loadTileData(spec) {
    let dataLayers = []

    forUpTo(spec.depth, i => {
      dataLayers.push(new Array(spec.width * spec.height));
    });

    this.#featureMap.layers.forEach(mapLayer => {
      let layerInfo = MapHelper.parseLayerName(mapLayer.name);

      forEachTile(spec, (x,y) => {
        let tileIndex = getTileIndex(spec, x, y);
        let tileData = this.tileDataAt(mapLayer, layerInfo.type, new Vector(x,y,layerInfo.index))

        if (tileData) {
          if (dataLayers[layerInfo.index][tileIndex] == null) {
            dataLayers[layerInfo.index][tileIndex] = {};
          }
          dataLayers[layerInfo.index][tileIndex][layerInfo.type] = tileData;
        }

      });
    });

    return dataLayers;
  }

  // The mapLayer will have its tile data in either a 2D array of string if
  // it's the regions layer, or as a 2D array of numbers if it's one of the
  // other layers.
  //
  // TODO: The features don't do anything with the region layers. The
  //       ZoneLoader uses the regions to add to the supplementary data used by
  //       the biome builders. They could be used for something else in the
  //       features, but I'd either need to figure out where to put
  //       supplementary data when outside of the biome builder, or find a way
  //       to include that data when the feature is loaded (but the build order
  //       gets super important, better not to faff about with all that)

  tileDataAt(mapLayer, layerType, point) {
    let extensionLoader = new ExtensionLoader(this.extensions);

    if (mapLayer.grid2D) {
      let tileId = mapLayer.grid2D[point.y][point.x];
      if (tileId != "0") {
        return null; // TODO: implement regions in features.
      }
    }

    if (mapLayer.data2D) {
      let tileId = mapLayer.data2D[point.y][point.x];
      if (tileId >= 0) {
        return extensionLoader.adjustedLayerData(layerType, tileId, point);
      }
    }
  }
}

const getTileIndex = function(featureInfo, x, y) {
  return x-featureInfo.x + ((y-featureInfo.y) * featureInfo.width);
}

const forEachTile = function(featureInfo, callback) {
  for (let y = featureInfo.y; y < featureInfo.height + featureInfo.y; y++) {
    for (let x = featureInfo.x; x < featureInfo.width + featureInfo.x; x++) {
      callback(x,y);
    }
  }
}
