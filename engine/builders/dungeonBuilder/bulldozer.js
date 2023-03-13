global.Bulldozer = class Bulldozer {

  // We sometimes need to be absolutely sure that a certain point on the map is accessable. Normally this is taken care
  // of by the secton connector, but some biome builders won't be using that. This is a bit of a blunt force solution
  // to that problem that carves a tunnel from the point we need to connect to, to the first empty tile.

  constructor(properties) {
    this.biomeBuilder = properties.biomeBuilder;
    this.tileSource = properties.tileSource;
    this.startPoint = properties.startPoint;
    this.defaultTile = properties.defaultTile;
    this.directionMap = { N:[_N,_E,_W], S:[_S,_E,_W], E:[_E,_N,_S], W:[_W,_N,_S] }[properties.direction];

    if (this.defaultTile == null) { throw `Default Tile is null.`; }
  }

  start() {
    this.carve(this.startPoint);
  }

  carve(point) {
    this.tileSource.setTile(point, this.defaultTile.copy())
    this.biomeBuilder.freeTiles.remove(point);

    let direction = this.directionMap[0];
    let roll = Random.roll(6);

    if (roll == 1) { direction = this.directionMap[1]; }
    if (roll == 2) { direction = this.directionMap[2]; }

    let nextPoint = point.go(direction);
    let nextTile = this.tileSource.getTile(nextPoint);

    if (nextTile == null || nextTile.sector_id == this.defaultTile.sector_id || nextTile.isSolid()) {
      this.carve(nextPoint);
    }
  }

}
