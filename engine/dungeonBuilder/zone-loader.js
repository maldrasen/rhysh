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
    print("Map Data Loaded")
  }

  loadLayer(layerMap) {}
  buildTiles(layer) {}

  generateBiomes() {}
  saveFile() {}
}
