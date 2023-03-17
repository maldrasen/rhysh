global.ExtensionLoader = class ExtensionLoader {

  constructor(source) {
    this.dataSource = source;
  }

  // This function builds the tile data for this layer given a tile ID and a layer type. If we're building the extended
  // layer we need to also lookup what the actual extension value should be in the zoneData file. All extensions will
  // either have a value (which is a simple lookup by key on the dataSource) or a method to get that value.
  //
  // TODO: There are a few method types that I think we'll need that aren't implemented yet. I'm thinking something
  //       like LootTable and TrapTable? May need a ResourceTable too for random resources found in the dungeon. The
  //       problem is, when I'm building this, I don't know what kind of zone we're in. Might just ignore most methods
  //       here and handle them when we're at a place where we know what to do with them.
  //
  adjustedLayerData(layerType, tileId, point) {
    let layerData = { ...Tilemap.lookupTile(layerType, tileId) };

    if (layerType != "extended") { return layerData; }

    if (layerData.value) {
      layerData.value = this.lookupExtensionValue(layerData);
    }

    if (layerData.method && layerData.method == "Point") {
      layerData.value = this.lookupExtensionValueAt(layerData, point);
    }

    return layerData
  }

  lookupExtensionValue(layerData) {
    if (this.dataSource.extensions && this.dataSource.extensions[layerData.value]) {
      return this.dataSource.extensions[layerData.value];
    }
    console.error("Error: Extension should have a lookup value in the data file but does not. ",layerData)
  }

  lookupExtensionValueAt(layerData, point) {
    let key = `Point(${point.x},${point.y},${point.z})`;
    if (this.dataSource.extensions && this.dataSource.extensions[key]) {
      return this.dataSource.extensions[key]
    }
    console.error("Error: Extension should have ",key," in the data file but does not. ",layerData)
  }

}