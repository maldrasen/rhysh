global.CleftBuilder = class CleftBuilder extends BiomeBuilder {

  // TODO: I tried adding some random cave features to the clefts, but I didn't think that they worked very well. The
  //       didn't really fit into the rocky, narrow passage look that I'm going for. Just plopping in features doesn't
  //       play well with the diggers either and they end up disconnected from everything else. Instead, I think I
  //       should loop through the cleft tiles for dead ends and randomly place interesting things there, especially
  //       for those dead ends that are looking off the side of the cliff.

  placeFeatures() {
    this.cleftSector_id = Sector.defineNextSector({ type:'outside' });

    this.cleftTile = Tile.normal();
    this.cleftTile.biome = this.biomeName;
    this.cleftTile.sector_id = this.cleftSector_id;

    new CrackDigger({
      "biomeBuilder": this,
      "tileSource": this.tileSource,
      "carvePoints": this.supplementaryData.CarvePoints,
      "defaultTile": this.defaultTile(),
    }).start(0.33);

    // new TunnelDigger({
    //   "biomeBuilder": this,
    //   "tileSource": this.tileSource,
    //   "defaultTile": this.defaultTile(),
    // }).start();

    this.fillSpace();
  }

  defaultTile() {
    return this.cleftTile;
  }

  fillSpace() {
    this.freeTiles.each(index => {
      this.tileSource.setTile(index, Tile.solidStone());
    });
  }
}
