global.TunnelDigger = class TunnelDigger {

  // The TunnelDigger carves a series of narrow tunnels in an area filled with mostly stone. It does this by picking a
  // random tile from the free tiles, finds the closest tile it can connect to, and diggs a diagonal tunnel to that
  // point. There's a bit of randomness in the tunnel to keep them from looking like streight lines.
  constructor(properties) {
    this.biomeBuilder = properties.biomeBuilder
    this.tileSource = properties.tileSource
    this.defaultTile = properties.defaultTile
    this.connectionPoints = new VectorArray();
  }

  start() {
    let count = Math.floor(this.biomeBuilder.freeTiles.size() / 50);

    // This might pick the same tile twice. That shouldn't be a problem though.
    forUpTo(count, i => {
      this.connectionPoints.push(this.biomeBuilder.freeTiles.getRandom())
    });

    let attempts = 100;

    while (this.connectionPoints.size() > 0 && attempts > 0) {
      attempts -= 1;

      let toPoint = this.connectionPoints.getRandom();
      let fromPoint = this.closestConnectionTo(toPoint);

      if (fromPoint) {// TEMP, there should always be a from point
        this.connectPoints(fromPoint, toPoint);
        this.connectionPoints.remove(toPoint);
      }
    }
  }

  // Progressivly sweep outward, looking for another point to connect to.
  closestConnectionTo(point) {
    let radius = 0;
    let other = null;

    while (other == null && radius < 50) {
      radius += 1;
      other = this.findClosestConnection(point, radius);
    }

    return other
  }

  findClosestConnection(point, radius) {
    for (let r = -radius; r <= radius; r++) {
      let north = point.translate(new Vector(r,-radius,0));
      if (this.canConnect(north)) { return north; }

      let south = point.translate(new Vector(r,radius,0));
      if (this.canConnect(south)) { return south; }

      let east = point.translate(new Vector(radius,r,0));
      if (this.canConnect(east)) { return east; }

      let west = point.translate(new Vector(-radius,r,0));
      if (this.canConnect(west)) { return west; }
    }
    return null;
  }

  canConnect(point) {
    if (this.tileSource.inRange(point) == false) { return false; }
    if (this.biomeBuilder.usedTiles.has(point)) { return true; }

    let tile = this.tileSource.getTile(point);
    return (tile != null) && (tile.sector == this.defaultTile.sector)
  }

  connectPoints(fromPoint, toPoint) {
    let xOffset = fromPoint.x - toPoint.x;
    let yOffset = fromPoint.y - toPoint.y;
    let horizontal = fromPoint.x < toPoint.x ? _E : _W;
    let vertical = fromPoint.y < toPoint.y ? _S : _N;

    // Return when the from point and the to point are the same point.
    if (xOffset == 0 && yOffset == 0) {
      return;
    }

    let direction = this.randomDirection(xOffset, yOffset, horizontal, vertical)
    let nextPoint = fromPoint.go(direction)
    let nextTile = this.tileSource.getTile(nextPoint)

    // The only big problem with connecting tiles this way is that sometimes we randomly fall off a cliff, this should
    // be fine though. I don't think it can happen for the most important connection points.
    if (nextTile != null && nextTile.hasFloor() == false) {
      return
    }

    this.tileSource.setTile(nextPoint, this.defaultTile.copy());
    this.biomeBuilder.freeTiles.remove(nextPoint);
    this.connectPoints(nextPoint, toPoint);
  }

  randomDirection(xOffset, yOffset, horizontal, vertical) {
    var roll = Random.roll(12);

    if (Math.abs(xOffset) < Math.abs(yOffset)) {
      return (roll < 4) ? horizontal : vertical;
    }

    if (Math.abs(xOffset) > Math.abs(yOffset)) {
      return (roll < 4) ? vertical : horizontal;
    }

    return (roll < 7) ? vertical : horizontal;
  }

}
