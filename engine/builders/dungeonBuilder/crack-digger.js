global.CrackDigger = class CrackDigger {

  // The tunneler randomly selects carve points to start from, then carves into an empty area until path length is
  // reached or something solid is encountered. Carving is done with a random walk, but mostly heads away from the
  // empty space next to the carve point. This is designed to produce a series of cracks heading away from open space.
  constructor(properties) {
    this.biomeBuilder = properties.biomeBuilder
    this.tileSource = properties.tileSource
    this.defaultTile = properties.defaultTile
    this.carvePoints = [...properties.carvePoints]
  }

  // Builds the cracks from the given density. Should be beteen 0 and 1. A higher density leads to more cracks.
  start(density) {
    forUpTo(Math.floor(this.carvePoints.length * density), _ => {
      let startIndex = Random.from(this.carvePoints)
      let neighbors = this.tileSource.getNeighborTiles(startIndex)
      let direction = Random.from([N,S,E,W]);

      NSEW(facing => {
        if (neighbors[facing].tile) {
          direction = oppositeDirection(facing);
        }
      });

      let averageLength = this.calculatePathLength(startIndex, direction);
      let length = Random.between(averageLength, averageLength*2);

      this.carvePath(startIndex, DirectionMaps[direction], length);
    });
  }

  // The path length is determined by how far from the start index we can go in the specified direction before we run
  // into an already defined tile. This probably need to check to make sure we don't go out of bounds either. Max path
  // length is 100.
  calculatePathLength(index, direction) {
    let nextIndex = index.go(direction)
    let length = 1

    while(true) {
      if (length >= 100 || this.tileSource.getTile(nextIndex) != null) {
        return length;
      }

      nextIndex = nextIndex.go(direction);
      length += 1;
    }
  }

  carvePath(index, directionMap, length) {

    // Stop when a tile is encountered.
    if (this.tileSource.getTile(index)) { return; }

    let direction = directionMap[0];
    let roll = Random.roll(6);

    if (roll == 1) { direction = directionMap[1]; }
    if (roll == 2) { direction = directionMap[2]; }

    this.tileSource.setTile(index, this.defaultTile.copy());
    this.biomeBuilder.freeTiles.remove(index);

    if (length > 0) {
      this.carvePath(index.go(direction), directionMap, length-1);
    }
  }
}

// An array of the possible directions that the tunnel will go, with the first element being the most likely.
const DirectionMaps = { N:[N,E,W], S:[S,E,W], E:[E,N,S], W:[W,N,S] };
