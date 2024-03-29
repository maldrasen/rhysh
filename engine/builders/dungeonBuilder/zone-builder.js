global.ZoneBuilder = class ZoneBuilder {

  #zone;
  #zoneMap;
  #extensionLoader;

  #supplementaryData;
  #freeTiles;
  #tileSource;

  #layerSize;
  #layers;

  constructor(code) {
    this.#zone = Zone.lookup(code);
    this.#freeTiles = {};
    this.#supplementaryData = {};
    this.#layers = [];

    this.#extensionLoader = new ExtensionLoader(this.#zone.extensions);
    this.#zoneMap = JSON.parse(fs.readFileSync(this.#zone.mapFilePath));
    this.#layerSize = new Vector(this.#zoneMap.layers[0].gridCellsX, this.#zoneMap.layers[0].gridCellsY, 1);

    this.#tileSource = new TileSource({
      name: this.#zone.name,
      size: new Vector(this.#layerSize.x, this.#layerSize.y, this.#zone.layers.length),
      layerOffset: this.#zone.layers[0].level,
    });
  }

  buildZone() {
    console.log(`Create Zone(${this.#zone.name})`);
    this.loadMapData();
    this.generateBiomes();
  }

  getTileSource() {
    return this.#tileSource;
  }

  // ==== Step 1 : Load Map Data ===============================================

  loadMapData() {
    this.#zone.layers.forEach(layerData => {
      layerData.tileData = new Array(this.#layerSize.x * this.#layerSize.y);
      this.#layers.push(layerData);
    });

    this.#zoneMap.layers.forEach(layerMap => { this.loadLayer(layerMap); });
    this.#layers.forEach(layer => { this.buildTiles(layer); });
  }

  // Get all of the tile data from the Zone and put it the tile array for this
  // layer. We need to do this step before building the tiles because tile data
  // comes from multiple separate map layers.
  loadLayer(layerMap) {
    let layerInfo = MapHelper.parseLayerName(layerMap.name);
    let layer = this.#layers[layerInfo.index];

    this.forEachTile(layer.level, (tileIndex, dungeonIndex) => {
      this.saveRegionData(layerMap, dungeonIndex);

      let tileId = this.lookupTileId(layerMap,dungeonIndex);
      if (tileId != null && tileId >= 0) {

        // Create a tile if this is the first layer with any data for that tile.
        if (layer.tileData[tileIndex] == null) {
          layer.tileData[tileIndex] = {};
        }

        // The tile data may need to be transformed by the extension loader
        // before saving it in the tileData array.
        layer.tileData[tileIndex][layerInfo.type] =
          this.#extensionLoader.adjustedLayerData(layerInfo.type, tileId, dungeonIndex);
      }
    });
  }

  lookupTileId(layerMap, dungeonIndex) {
    return layerMap.data2D ? layerMap.data2D[dungeonIndex.y][dungeonIndex.x] : null;
  }

  // Like the extensions and such we need to lookup the actual meaning of the
  // region which will be different in every zone. We save this as
  // supplementary data along with things like Connection points and such. The
  // supplementaryData should always contain arrays of points.
  saveRegionData(layerMap, index) {
    if (layerMap.grid2D == null) { return; }
    if (layerMap.grid2D[index.y][index.x] == "0") { return; }

    let regionID = layerMap.grid2D[index.y][index.x];
    let regionType = this.#zone.regions[regionID];
    if (regionType == null) {
      console.error(`No region (${regionID}) found in zone data.`);
    }

    if (this.#supplementaryData[regionType] == null) {
      this.#supplementaryData[regionType] = [];
    }
    this.#supplementaryData[regionType].push(index);
  }


  // Now that we have all the data for each tile we can build all the tiles, adding them to a single tile array.
  buildTiles(layer) {
    this.forEachTile(layer.level, (tileIndex, dungeonIndex) => {
      let tileData = layer.tileData[tileIndex];
      if (tileData && tileData.root) {
        if (tileData.root.biome) {
          this.saveAsFreeTile(dungeonIndex, tileData);
        }
        if (tileData.root.tile) {
          this.#tileSource.setTile(dungeonIndex, TileLoader.fromTileData(tileData, this.#zone, dungeonIndex));
        }
      }
    });
  }

  // As we go through the layers we save biomes as an array of points. These will be fed into the biome builders to
  // randomly generate these areas.
  saveAsFreeTile(index, tileData) {
    let biomeColor = tileData.root.biome;
    if (this.#freeTiles[biomeColor] == null) {
      this.#freeTiles[biomeColor] = new VectorArray();
    }
    this.#freeTiles[biomeColor].push(index);
  }

  // ==== Step 2 : Generate Biomes =============================================

  generateBiomes() {
    ObjectHelper.each(this.#freeTiles, (biomeColor,biomeTiles) => {
      let biomeOptions = this.#zone.biomes[biomeColor];
      let biomeName = biomeOptions.biomeName;

      let properties = {
        biomeName: biomeOptions.biomeName,
        biomeOptions: biomeOptions,
        zone: this.#zone,
        tileSource: this.#tileSource,
        freeTiles: biomeTiles,
        supplementaryData: this.#supplementaryData,
      };

      if (biomeName == "Cleft") { new CleftBuilder(properties).fullBuild(); }
      if (biomeName == "Farm")  { new FarmBuilder(properties).fullBuild();  }
    });

    new TileFixer({ tileSource:this.#tileSource }).start()
  }

  // Iterator through all the tiles based on the size of the zone. Both the
  // tileIndex (the actual array index) and the dungeonIndex (the tile's
  // logical location in the dungeon) are sent as parameters.
  forEachTile(level, callback) {
    forUpTo(this.#layerSize.y, y => {
      forUpTo(this.#layerSize.x, x => {
        let tileIndex = x + (y * this.#layerSize.x);
        let dungeonIndex = new Vector(x,y,level);
        callback(tileIndex, dungeonIndex);
      });
    });
  }

}



