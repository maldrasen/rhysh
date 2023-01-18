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

  // === Tile Loading ==================================================================================================
  // We create tiles from tile data when loading them from the JSON map data. The tile data should be
  // the same across map type. For example, a tile with both extra and extended data:
  //    { "root":     { "id": 20, "tile": "Empty", "floor": "Normal", "walls": "W" },
  //      "extra":    { "id": 0,  "type": "Door", "doors": "W" },
  //      "extended": { "id": 58, "type": "Point", "value": "Green" }}

  static fromTileData(tileData) {
    let tile = new Tile();
    let root = tileData.root;

    if (root == null) {
      return console.error('No Root in:',tileData);
    }

    if (root.walls) { tile.setWallsFromString(root.walls); }
    if (root.floor) { tile.setFloorFromString(root.floor); }
    if (tileData.extra) { tile.setExtra(tileData.extra); }
    if (tileData.extended) { tile.setExtended(tileData.extended); }
    if (root.tile == "Solid") { tile.setFill(root.fill); }

    return tile;
  }

  setWallsFromString(wallString) {
    NSEW(facing => {
      if (wallString.indexOf(facing) >= 0) {
        this.placeWall(facing);
      }
    });
  }

  setFloorFromString(floorString) {
    this.floor = Floor.fromString(floorString);
  }

  setFill(fill) {
    if (fill == "Stone") { return this.fillWithStone(); }
    console.error("Unknown Fill:",fill);
  }

  setExtra(extra) {

    if (extra.type == "Stairs") {
      if (extra.stairs == "Down") { this.type = Tile.Type.StairsDown; }
      if (extra.stairs == "Up")   { this.type = Tile.Type.StairsUp; }
      return;
    }

    if (extra.type == "Door") { return this.setDoorExtra(extra); }
    if (extra.type == "Fence") { return this.setFenceExtra(extra); }

    if (extra.type == "SecretDoor") { return; } // TODO: Implement secret doors.
    if (extra.type == "TrappedDoor") { return; } // TODO: Implement trapped doors.
    if (extra.type == "FenceGate") { return; } // TODO: Implement fence gates.
    if (extra.type == "Pillar") { return; } // TODO: Implement pillars.
    if (extra.type == "Gateway") { return; } // TODO: Implement transitions.

    console.error("Unknown Extra Error: What do I do with this? ",extra);
  }

  setExtended(extension) {
    if (extension.type == "Tree") { return this.fillWithTree(extension.value); }
    if (extension.type == "Statue") { return this.fillWithStatue(extension.value); }
    if (extension.type == "Bridge") { return; } // TODO: Implement Bridges
    if (extension.type == "Sign") { return; } // TODO: Implement Signs
    if (extension.type == "Trigger") { return; } // TODO: Implement Triggers
    if (extension.type == "PossibleTrigger") { return; } // TODO: Implement Triggers

    console.error("Unknown Extension Error: What do I do with this?", extension);
  }

  setFenceExtra(extra) {
    NSEW(facing => {
      if (extra.facing.indexOf(facing) >= 0) {
        if (this.walls[facing] != null) {
          console.error("Error: Trying to set a fence where a wall has already been placed.");
        } else {
          this.walls[facing] = new Wall(Wall.Type.Fence);
        }
      }
    });
  }

  setDoorExtra(extra) {
    NSEW(facing => {
      if (extra.facing.indexOf(facing) >= 0) {
        this.placeDoor(facing);
      }
    });
  }

}
