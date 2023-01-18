

global.FeatureLoader = class FeatureLoader {

  constructor(name) {
    this.filename = name;
  }

  async loadFeatures() {
    this.featureMap = await DungeonBuilder.loadFeatureMap(this.filename)
    this.featureData = await DungeonBuilder.loadFeatureData(this.filename)

    this.featureData.Features.forEach(info => {
      this.loadFeature(info);
    });
  }

  loadFeature(featureInfo) {
    let tileData = this.loadTileData(featureInfo);
  //     var featureTemplate = FeatureTemplate.new(featureInfo)

  // if featureInfo.has("FeatureSet"):
  //   MapData.addTemplateToSet(featureInfo["FeatureSet"],featureInfo["Name"])

  // for layerIndex in tileData.size():
  //   var layer = tileData[layerIndex]
  //   for y in featureInfo["Height"]:
  //     for x in featureInfo["Width"]:
  //       var tileIndex = x + (y * featureInfo["Width"])
  //       if layer[tileIndex]:
  //         featureTemplate.setTile(Vector3i(x,y,layerIndex), Tile.fromTileData(layer[tileIndex]))

  // MapData.addTemplateToLibrary(featureTemplate)

  }



  // Though the features have to do the same kind of map parsing as the zones, the way these layers are loaded is
  // completely different. A feature map can contain many individual features, and can be of any size.
  loadTileData(featureInfo) {
    let dataLayers = []

    forUpTo(featureInfo["Depth"], i => {
      dataLayers.push(new Array(featureInfo["Width"] * featureInfo["Height"]));
    });

    this.featureMap.layers.forEach(mapLayer => {
      let layerInfo = DungeonBuilder.parseLayerName(mapLayer.name);

      forEachTile(featureInfo, (x,y) => {
        let tileIndex = getTileIndex(featureInfo, x, y);
        let tileData = this.tileDataAt(mapLayer, layerInfo.type, new Vector(x,y,layerInfo.index))

//         if tileData:
//           if dataLayers[layerInfo.index][tileIndex] == null:
//             dataLayers[layerInfo.index][tileIndex] = {}
//           dataLayers[layerInfo.index][tileIndex][layerInfo.type] = tileData

      });
    });

    return dataLayers;
  }

  // The mapLayer will have its tile data in either a 2D array of string if it's the regions layer, or as a 2D array of
  // numbers if it's one of the other layers.
  tileDataAt(mapLayer, layerType, point) {
    let extensionLoader = new ExtensionLoader(this.featureData);

    // TODO: The features don't fo anything with the region layers. The ZoneLoader uses the regions to add to the
    //       supplementary data used by the biome builders. They could be used for something else in the features, but
    //       I'd either need to figure out where to put supplementary data when outside of the biome builder, or find a
    //       way to include that data when the feature is loaded (but the build order gets super important, better not
    //       to faff about with all that)

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

};



const getTileIndex = function(featureInfo, x, y) {
  return x-featureInfo["X"] + ((y-featureInfo["Y"]) * featureInfo["Width"]);
}

const forEachTile = function(featureInfo, callback) {
  for (let y = featureInfo["Y"]; y < featureInfo["Height"] + featureInfo["Y"]; y++) {
    for (let x = featureInfo["X"]; x < featureInfo["Width"] + featureInfo["X"]; x++) {
      callback(x,y);
    }
  }
}