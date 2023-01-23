global.TileFixer = class TileFixer {

  constructor(properties) {
    this.tileSource = properties.tileSource
    this.canRemove = []
  }

  // As a final step we loop though all of the tiles in the zone and ensure that all the walls and doors have been
  // correctly placed.
  start() {
    this.tileSource.each((index, tile) => {
      if (tile) {
        this.checkIndex(index, tile);
      }
    });

    this.canRemove.forEach(index => {
      this.tileSource.setTile(index, null);
    });
  }

  checkIndex(index, tile) {
    let neighbors = this.tileSource.getNeighborTiles(index)

    this.canBeRemoved(tile,neighbors) ?
      this.canRemove.push(index):
      this.fixWalls(tile, neighbors, index);
  }

  // A tile can be removed if it and every neighboring tile is solid stone. This is used to clear out big solid spaces.
  canBeRemoved(tile,neighbors) {
    let remove = tile.isStone();

    NSEW(direction => {
      if (neighbors[direction] && neighbors[direction].tile) {
        if (neighbors[direction].tile.isStone() == false) {
          remove = false;
        }
      }
    });

    return remove;
  }

  fixWalls(tile, neighbors, index) {
    NSEW(direction => {
      if (neighbors[direction] && neighbors[direction].tile) {
        this.fixWall(tile, neighbors[direction].tile, direction);
      }
    });

    this.tileSource.setTile(index, tile);
  }

  fixWall(tile, neighbor, direction) {
    if (tile.canHaveWalls() == false) { return; }

    let tileWall = tile.walls[direction];
    let oppositeWall = this.getOppositeWall(neighbor, direction);

    // Make sure both sides of a tile have doors and walls.
    if (!isWall(tileWall) && isWall(oppositeWall)) { tile.placeWall(direction); }
    if (!isDoor(tileWall) && isDoor(oppositeWall)) { tile.placeDoor(direction); }

    // Occationally something like a tree will spawn where a door should go.
    if (tile.isTree() && isDoor(oppositeWall)) { tile.makeEmpty(); }

    // Wall off null neighbors.
    if (neighbor == null) { tile.placeWall(direction); }

    // There should be a wall if the neighbor tile is solid stone.
    if (neighbor && neighbor.isStone()) { tile.placeWall(direction); }
  }

  getOppositeWall(neighbor, direction) {
    return (neighbor == null) ? null : neighbor.walls[oppositeDirection(direction)];
  }

}

function isDoor(wall) { return wall && wall.isDoor(); }
function isWall(wall) { return wall && wall.isNormal(); }
