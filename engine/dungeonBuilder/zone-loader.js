global.ZoneLoader = class ZoneLoader {

  constructor(name) {
    this.zoneName = name;
    this.freeTiles = {}
    this.supplementaryData = {}
  }

  hasBeenBuilt() { return false }
  loadZone() { return null }

  async createZoneFromTemplate() {
    console.log(`Create Zone(${this.zoneName})`);

    this.zoneMap = await DungeonBuilder.loadZoneMap(this.zoneName);
    this.zoneData = await DungeonBuilder.loadZoneData(this.zoneName);
    this.zoneInfo = ZoneInfo.build(this.zoneName, this.zoneData);
    this.extensionLoader = new ExtensionLoader(this.zoneData);

    this.layerSize = new Vector(this.zoneMap.layers[0].gridCellsX, this.zoneMap.layers[0].gridCellsY, 1);
    this.layers = [];

    this.loadMapData();
    this.generateBiomes();
    this.saveFile();
  }

  // ==== Step 1 : Load Map Data =======================================================================================

  loadMapData() {
    this.zoneData.layers.forEach(layerData => {
      layerData.tileData = new Array(this.layerSize.x * this.layerSize.y);
      this.layers.push(layerData);
    });

    this.zoneMap.layers.forEach(layerMap => { this.loadLayer(layerMap); });
    this.layers.forEach(layer => { this.buildTiles(layer); });
    console.log("Map Data Loaded")
  }


  // Get all of the tile data from the Zone and put it the tile array for this layer. We need to do this step before
  // building the tiles because tile data comes from multiple separate map layers.
  loadLayer(layerMap) {
    let layerInfo = DungeonBuilder.parseLayerName(layerMap.name);
    let layer = this.layers[layerInfo.index];

    forUpTo(this.layerSize.y, y => {
      forUpTo(this.layerSize.x, x => {
        let tileIndex = x + (y * this.layerSize.x);
        let dungeonIndex = new Vector(x,y,layer.level);
        let tileId = this.lookupTileId(layerMap,x,y);

        this.saveRegionData(layerMap, dungeonIndex);

        if (tileId && tileId >= 0) {
          this.saveTile(layer, layerInfo, tileIndex, dungeonIndex, tileId);
        }
      });
    });
  }

  lookupTileId(layerMap,x,y) {
    return layerMap.data2D ? layerMap.data2D[y][x] : null;
  }

  // Like the extensions and such we need to lookup the actual meaning of the region which will be different in every
  // zone. We save this as supplementary data along with things like Connection points and such. The supplementaryData
  // should always contain arrays of points.
  saveRegionData(layerMap, index) {
    if (layerMap.grid2D == null) { return; }
    if (layerMap.grid2D[index.y][index.x] == "0") { return; }

    let regionID = layerMap.grid2D[index.y][index.x];
    let regionType = this.zoneData.regions[regionID];
    if (regionType == null) {
      console.error(`No region (${regionID}) found in zone data.`);
    }

    if (this.supplementaryData[regionType] == null) {
      this.supplementaryData[regionType] = [];
    }
    this.supplementaryData[regionType].push(index);
  }

  saveTile(layer, layerInfo, tileIndex, dungeonIndex, tileId) {
    if (layer.tileData[tileIndex] == null) {
      layer.tileData[tileIndex] = {};
    }
    layer.tileData[tileIndex][layerInfo.type] =
      this.extensionLoader.adjustedLayerData(layerInfo.type, tileId, dungeonIndex);
  }

  buildTiles(layer) {}

  generateBiomes() {}
  saveFile() {}
}
