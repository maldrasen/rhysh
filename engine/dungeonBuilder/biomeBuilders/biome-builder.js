global.BiomeBuilder = class BiomeBuilder {

  constructor(properties) {
    this.biomeName = properties.biomeName
    this.biomeOptions = properties.biomeOptions
    this.zoneInfo = properties.zoneInfo
    this.zoneData = properties.zoneData
    this.tileSource = properties.tileSource
    this.supplementaryData = properties.supplementaryData
    this.setFreeTiles(properties.freeTiles);
  }

  fullBuild() {
    var startTime = Date.now()

    console.log(`  ${this.biomeName}: Starting full build on ${this.freeTiles.length} tiles`)

    this.runExtraBuilders("First")
    this.placeFeatures()
    this.connectSectors()
    this.trimDeadEnds()
    this.decorate()
    this.runExtraBuilders("Last")

    console.log(`  ${this.biomeName}: Completed build in ${Date.now() - startTime}ms`)
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
    this.freeTiles = [...tiles];
    this.usedTiles = [];
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
      "startPoint": options.startPoint,
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
  featureCanBePlaced(index, feature) {
    feature.eachTile(tileEntry => {
      console.log("TODO: Tile Entry?",tileEntry);
      // if feature.getTile(x,y,0) != null:
      //   var tileIndex = index.translate(Vector3i(x,y,0))
      //   if isIndexFree(tileIndex) == false:
      //     return false
    });
    return true
  }

  placeFeature(baseIndex, feature) {
    console.log("TODO: Place Feature",baseIndex,feature);
  }

  isIndexFree(index) {
    return ArrayHelper.contains(this.freeTiles, index);
  }

  removeFreeIndex(index) {
    ArrayHelper.remove(this.freeTiles, index);
  }

}
