global.BiomeBuilder = class BiomeBuilder {

  #biomeName;
  #biomeOptions;
  #zone;
  #tileSource;
  #supplementaryData;
  #freeTiles;
  #usedTiles;

  constructor(properties) {
    this.#biomeName = properties.biomeName;
    this.#biomeOptions = properties.biomeOptions;
    this.#zone = properties.zone;
    this.#tileSource = properties.tileSource;
    this.#supplementaryData = properties.supplementaryData;
    this.setFreeTiles(properties.freeTiles);
  }

  get biomeName() { return this.#biomeName };
  get biomeOptions() { return this.#biomeOptions };
  get zone() { return this.#zone };
  get tileSource() { return this.#tileSource };
  get supplementaryData() { return this.#supplementaryData };
  get freeTiles() { return this.#freeTiles };
  get usedTiles() { return this.#usedTiles };

  fullBuild() {
    console.log(`  ${this.biomeName}: Starting full build on ${this.freeTiles.size()} tiles`)

    this.runExtraBuilders("First")
    this.placeFeatures()
    this.connectSectors()
    this.trimDeadEnds()
    this.decorate()
    this.runExtraBuilders("Last")
  }

  // Child classes should implement these functions when needed.
  placeFeatures() {}
  connectSectors() {}
  trimDeadEnds() {}
  decorate() {}
  defaultTile() {}

  // When setting the free tiles array we want to force a copy because the builders mutate the free and used tile
  // arrays while building.
  setFreeTiles(tiles) {
    this.#freeTiles = tiles.copy();
    this.#usedTiles = new VectorArray();
  }

  // A zone can specify additional options for the biome builders to use. One of these is the "extraBuilders" option,
  // which lists extra build functions to invoke. The option needs to at least specify which builder to use and which
  // phase to run it in.
  runExtraBuilders(phase) {
    if (this.biomeOptions.extraBuilders) {
      this.biomeOptions.extraBuilders.forEach(extraBuilder => {
        if (extraBuilder.phase == phase) {
          if (extraBuilder.type == "Bulldozer") { this.runBulldozer(extraBuilder); }
        }
      })
    }
  }

  runBulldozer(options) {
    new Bulldozer({
      "biomeBuilder": this,
      "tileSource": this.tileSource,
      "startPoint": Vector.from(options.startPoint),
      "direction":  options.direction,
      "defaultTile": this.defaultTile(),
    }).start();
  }

  // Determine if a feature is able to be placed in this location. This only checks to see if there's a null tile at
  // every index the feature's tiles would be placed in. It doesn't look for things like doors being able to be
  // connected. We could extend it to do that possibly or create some kind of abort() function that clears tiles if it
  // becomes impossible to connect the feature.
  //
  // TODO: Because the free tiles come from a single layer this also doesn't consider the z-depth of a feature at all.
  //       This is fine for the cleft and other areas where a zone will have nothing but air above the tile, but this
  //       will need to be fixed when we start building underground areas. It's easy enough to loop though a feature's
  //       z-levels, but the real question is how to differentiate between zones where features can be any height and
  //       are always placed on the ground, and other zones that are closed off vertically?
  //
  featureCanBePlaced(baseIndex, feature) {
    let placable = true

    feature.eachTile((index, _) => {
      if (feature.getTile(index)) {
        let tileIndex = baseIndex.translate(new Vector(index.x, index.y, 0));
        if (this.freeTiles.has(tileIndex) == false) {
          placable = false;
        }
      }
    });

    return placable
  }

  // TODO: I've completely changed how sectors work here. A feature can actually have multiple sectors. The farms for
  //       instance have both room and outside tiles. I'm going to need a way to get a tile's sector from the feature,
  //       perhaps using the region layer for the sections of feature maps. Sector can be null for now though.
  placeFeature(baseIndex, feature) {
    feature.eachTile((index, tile) => {
      if (tile) {
        let tileIndex = baseIndex.translate(new Vector(index.x, index.y, index.z));

        tile.biome = this.biomeName;
        // tile.setSectorID(null); // Fix

        this.tileSource.setTile(tileIndex, tile);
        this.freeTiles.remove(tileIndex);
      }
    });
  }

}
