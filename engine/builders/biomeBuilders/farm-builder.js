global.FarmBuilder = class FarmBuilder extends BiomeBuilder {

  #farmSector_id;
  #farmTile;

  placeFeatures() {
    this.#farmSector_id = Sector.defineNextSector({ type:'outside' });

    this.#farmTile = Tile.normal();
    this.#farmTile.biome = this.biomeName;
    this.#farmTile.sector_id = this.#farmSector_id;

    this.addHouses(this.biomeOptions.houseCount);
    this.addTrees(this.biomeOptions.treeCount);
    this.fillSpace();
  }

  addHouses(houseCount) {
    while (houseCount > 0) {
      let feature = Feature.randomFrom(['farms']);
      feature.randomFlip();

      let dungeonIndex = this.freeTiles.getRandom();
      if (this.featureCanBePlaced(dungeonIndex,feature) == false) {
        continue;
      }

      this.placeFeature(dungeonIndex,feature)

      houseCount -= 1
    }
  }

  addTrees(treeCount) {
    while (treeCount > 0) {
      let dungeonIndex = this.freeTiles.getRandom();

      let tile = Tile.normal();
          tile.biome = this.biomeName;
          tile.sector_id = this.#farmSector_id;
          tile.fillWithTree();

      this.tileSource.setTile(dungeonIndex, tile);
      this.freeTiles.remove(dungeonIndex);

      treeCount -= 1
    }
  }

  fillSpace() {
    this.freeTiles.each(index => {
      this.tileSource.setTile(index, this.#farmTile.copy())
    });
  }

}
