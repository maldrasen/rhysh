global.Tile = class Tile {

  static Type = {
    Empty: 0,
    Solid: 1,
    StairsUp: 2,
    StairsDown: 3,
  }

  static FillType = {
    Stone: 0,
    Tree: 1,
    Statue: 2,
  }

  static normal() {
    return new Tile({
      type: Tile.Type.Empty,
      floor: Floor.normal(),
    });
  }

  static solidStone(type) {
    let tile = new Tile();
    tile.fillWithStone();
    return tile;
  }

  constructor(properties = {}) {
    this.type = properties.type;
    this.sector_id = properties.sector;
    this.biome_id = properties.sector;
    this.floor = properties.floor;

    this.walls = { N:null, S:null, E:null, W:null };
    this.extensions = {};
  }

  isEmpty() { return this.type == Tile.Type.Empty; }
  isSolid() { return this.type == Tile.Type.Solid; }
  isStone() { return this.isSolid() && this.fillType == Tile.FillType.Stone; }
  isStatue() { return this.isSolid() && this.fillType == Tile.FillType.Statue; }
  isTree() { return this.isSolid() && this.fillType == Tile.FillType.Tree; }

  hasFloor() { return this.floor && this.floor.isNormal(); }

  wallAt(facing) { return this.walls[facing]; }
  placeWall(facing) { this.walls[facing] = Wall.normal(); }
  placeDoor(facing) { this.walls[facing] = Wall.door(); }
  removeWall(facing) { this.walls[facing] = null; }

  // A tile can have walls if it's empty, stairs, or is filled with something that can be seen around like a tree or a
  // statue.
  canHaveWalls() {
    if (!this.isSolid()) { return true; }
    if (this.isStatue()) { return true; }
    if (this.isTree()) { return true; }
    return false;
  }

  // If a tile is solid we need to know what it's filled with in order to properly render it. It should be map of
  // fill-type to fill-value. Types I know about so far are:
  //   statue: random
  //   stone:  dungeon
  //   tree:   random
  // If no fill is specified and we have a solid tile, assume it's filled with generic dungeon stone.
  fillWith(fillType, fillName) {
    this.type = Tile.Type.Solid;
    this.fillType = fillType;
    this.fillName = fillName;
  }

  fillWithStone(name = "dungeon") { this.fillWith(Tile.FillType.Stone, name); }
  fillWithTree(name = "random")   { this.fillWith(Tile.FillType.Tree, name); }
  fillWithStatue(name = "random") { this.fillWith(Tile.FillType.Statue, name); }

  makeEmpty() {
    this.type = Tile.Type.Empty;
    this.fillType = null
    this.fillName = null
  }

  flipH() { [this.walls.W, this.walls.E] = [this.walls.E, this.walls.W] }
  flipV() { [this.walls.N, this.walls.S] = [this.walls.S, this.walls.N] }

  flipD() {
    this.walls = {
      N: this.walls.E,
      S: this.walls.W,
      E: this.walls.N,
      W: this.walls.S,
    };
  }

}
