global.Tile = class Tile {

  static normal() {
    return new Tile({
      type: _tileEmpty,
      floor: Floor.normal(),
    });
  }

  static solidStone(type) {
    let tile = new Tile();
    tile.fillWithStone();
    return tile;
  }

  #type;
  #floor;
  #walls;
  #fillType;
  #fillName;
  #stairDirection;
  #stairFacing;
  #trigger;
  #sector_id;
  #biome_id;

  constructor(properties = {}) {
    this.#type = properties.type;
    this.#floor = properties.floor;
    this.#walls = { N:null, S:null, E:null, W:null };
    this.#fillType = properties.fillType;
    this.#fillName = properties.fillName;
    this.#stairDirection = properties.stairDirection;
    this.#stairFacing = properties.stairFacing;

    this.#sector_id = properties.sector_id;
    this.#biome_id = properties.biome;
  }

  getType() { return this.#type; }
  setType(type) { return this.#type = type; }
  isEmpty() { return this.#type == _tileEmpty; }
  isSolid() { return this.#type == _tileSolid; }
  isStairs() { return this.#type == _tileStairs; }

  getFloor() { return this.#floor; }
  setFloor(floor) { this.#floor = floor; }
  hasFloor() { return this.#floor != null && this.#floor.isNormal(); }

  wallAt(facing) { return this.#walls[facing]; }
  setWalls(walls) { this.#walls = walls; }
  setWall(facing, wall) { this.#walls[facing] = wall; }
  placeWall(facing) { this.#walls[facing] = Wall.normal(); }
  placeDoor(facing) { this.#walls[facing] = Wall.door(); }
  removeWall(facing) { this.#walls[facing] = null; }

  getFillType() { return this.#fillType; }
  getFillName() { return this.#fillName; }
  isStone() { return this.isSolid() && this.#fillType == _tileFillStone; }
  isStatue() { return this.isSolid() && this.#fillType == _tileFillStatue; }
  isTree() { return this.isSolid() && this.#fillType == _tileFillTree; }

  getStairDirection() { return this.#stairDirection; }
  getStairFacing() { return this.#stairFacing; }
  getTrigger() { return this.#trigger; }

  setTrigger(trigger) { this.#trigger = trigger; }
  hasTrigger() { return this.#trigger != null; }
  getTrigger() { return this.#trigger; }

  getBiomeID() { return this.#biome_id; }
  setBiomeID(id) { this.#biome_id = id; }

  getSectorID() { return this.#sector_id; }
  setSectorID(id) { this.#sector_id = id; }

  copy() {
    const tile = new Tile({
      type: this.#type,
      sector_id: this.#sector_id,
      biome: this.#biome_id,
      floor: (this.#floor ? this.#floor.copy() : null),
      fillType: this.#fillType,
      fillName: this.#fillName,
      stairDirection: this.#stairDirection,
      stairFacing: this.#stairFacing,
    });

    NSEW(facing => {
      tile.#walls[facing] = (this.#walls[facing] ? this.#walls[facing].copy() : null)
    });

    return tile;
  }

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
    this.#type = _tileSolid;
    this.#fillType = fillType;
    this.#fillName = fillName;
  }

  fillWithStone(name = "dungeon") { this.fillWith(_tileFillStone, name); }
  fillWithTree(name = "random")   { this.fillWith(_tileFillTree, name); }
  fillWithStatue(name = "random") { this.fillWith(_tileFillStatue, name); }

  makeEmpty() {
    this.#type = _tileEmpty;
    this.#fillType = null
    this.#fillName = null
  }

  makeStairs(direction, facing) {
    if (ArrayHelper.contains([_N,_S,_E,_W],facing) == false) { throw `Bad facing for stairs: ${facing}`; }
    if (ArrayHelper.contains([_U,_D],direction) == false) { throw `Bad direction for stairs: ${direction}`; }

    this.#type = _tileStairs;
    this.#stairDirection = direction;
    this.#stairFacing = facing;
  }

  flipH() { [this.#walls.W, this.#walls.E] = [this.#walls.E, this.#walls.W] }
  flipV() { [this.#walls.N, this.#walls.S] = [this.#walls.S, this.#walls.N] }

  flipD() {
    this.#walls = {
      N: this.#walls.E,
      S: this.#walls.W,
      E: this.#walls.N,
      W: this.#walls.S,
    };
  }

  pack() { return TilePacker.pack(this); }

  static unpack(tileData)  {
    return TilePacker.unpack(tileData);
  }

}
