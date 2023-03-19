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
  #sector_id;
  #biome_id;
  #floor;
  #walls;
  #fillType;
  #fillName;
  #stairDirection;
  #stairFacing;
  #trigger;

  constructor(properties = {}) {
    this.#type = properties.type;
    this.#sector_id = properties.sector_id;
    this.#biome_id = properties.biome;
    this.#floor = properties.floor;
    this.#walls = { N:null, S:null, E:null, W:null };
    this.#fillType = properties.fillType;
    this.#fillName = properties.fillName;
    this.#stairDirection = properties.stairDirection;
    this.#stairFacing = properties.stairFacing;
  }

  get type()           { console.trace(); throw "=== No type property ===" }
  get sector_id()      { console.trace(); throw "=== No sector_id property ===" }
  get biome_id()       { console.trace(); throw "=== No biome_id property ===" }
  get floor()          { console.trace(); throw "=== No floor property ===" }
  get walls()          { console.trace(); throw "=== No walls property ===" }
  get fillType()       { console.trace(); throw "=== No fillType property ===" }
  get fillName()       { console.trace(); throw "=== No fillName property ===" }
  get stairDirection() { console.trace(); throw "=== No stairDirection property ===" }
  get stairFacing()    { console.trace(); throw "=== No stairFacing property ===" }
  get trigger()        { console.trace(); throw "=== No trigger property ===" }

  getType() { return this.#type; }
  getFillType() { return this.#fillType; }
  getFillName() { return this.#fillName; }
  getFloor() { return this.#floor; }
  getStairDirection() { return this.#stairDirection; }

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

  isEmpty() { return this.#type == _tileEmpty; }
  isSolid() { return this.#type == _tileSolid; }
  isStairs() { return this.#type == _tileStairs; }
  isStone() { return this.isSolid() && this.#fillType == _tileFillStone; }
  isStatue() { return this.isSolid() && this.#fillType == _tileFillStatue; }
  isTree() { return this.isSolid() && this.#fillType == _tileFillTree; }

  setFloor(floor) { this.#floor = floor; }
  hasFloor() { return this.#floor != null && this.#floor.isNormal(); }

  wallAt(facing) { return this.#walls[facing]; }
  setWall(facing, wall) { this.#walls[facing] = wall; }
  placeWall(facing) { this.#walls[facing] = Wall.normal(); }
  placeDoor(facing) { this.#walls[facing] = Wall.door(); }
  removeWall(facing) { this.#walls[facing] = null; }

  setTrigger(trigger) { this.#trigger = trigger; }
  hasTrigger() { return this.#trigger != null; }
  getTrigger() { return this.#trigger; }

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

  // === Persistance ===========================================================

  pack() {
    const tile = {
      type: this.#type,
      floor: (this.#floor ? this.#floor.pack() : null),
      trigger: (this.#trigger ? this.#trigger.pack() : null),
      walls: {},
    };

    if (this.#fillType) {
      tile.fillType = this.#fillType;
      tile.fillName = this.#fillName;
    }

    if (this.#stairDirection) {
      tile.stairDirection = this.#stairDirection;
      tile.stairFacing = this.#stairFacing;
    }

    NSEW(facing => {
      tile.walls[facing] = this.#walls[facing] ? this.#walls[facing].pack() : null;
    })

    return tile
  }

  // === Tile Loading ==========================================================
  // We create tiles from tile data when loading them from the JSON map data.
  // The tile data should be the same across map type. For example, a tile with
  // both extra and extended data:
  //
  // { "root":     { "id": 20, "tile": "Empty", "floor": "Normal", "walls": "W" },
  //   "extra":    { "id": 0,  "type": "Door", "doors": "W" },
  //   "extended": { "id": 58, "type": "Point", "value": "Green" }}
  //
  // The zone data may be null if we're loading a feature. That should be okay
  // because the zoneData is used to lookup event points and such, which
  // shouldn't apply to plain features.
  static fromTileData(tileData, zoneData, index) {
    const tile = new Tile();
    const root = tileData.root;

    if (root == null) {
      return console.error('No Root in:',tileData);
    }

    tile.setTypeFromString(root.tile);

    if (root.walls) { tile.setWallsFromString(root.walls); }
    if (root.floor) { tile.setFloorFromString(root.floor); }
    if (tileData.extra) { tile.setExtra(tileData.extra, zoneData, index); }
    if (tileData.extended) { tile.setExtended(tileData.extended, zoneData, index); }
    if (root.tile == "Solid") { tile.setFill(root.fill); }

    return tile;
  }

  // Similar to loading a tile from the tile data, a Tile object can also be
  // created from the JSON a tile gets stringified into.
  static unpack(tileData) {
    if (tileData.type == null) { throw `No Type.` }

    const tile = new Tile({
      type: tileData.type,
      sector_id: tileData.sector_id,
      biome_id: tileData.biome_id,
      fillType: tileData.fillType,
      fillName: tileData.fillName,
      stairDirection: tileData.stairDirection,
      stairFacing: tileData.stairFacing,
    });

    if (tileData.floor) {
      tile.setFloor(Floor.unpack(tileData.floor));
    }

    if (tileData.trigger) {
      tile.setTrigger(Trigger.unpack(tileData.trigger));
    }

    if (tileData.walls) {
      NSEW(facing => {
        if (tileData.walls[facing]) {
          tile.setWall(facing, Wall.unpack(tileData.walls[facing]));
        }
      });
    }

    return tile;
  }

  setTypeFromString(string) {
    this.#type = {
      "Empty": _tileEmpty,
      "Solid": _tileSolid,
    }[string];
  }

  setWallsFromString(wallString) {
    NSEW(facing => {
      if (wallString.indexOf(facing) >= 0) {
        this.placeWall(facing);
      }
    });
  }

  setFloorFromString(floorString) {
    this.#floor = Floor.fromString(floorString);
  }

  setFill(fill) {
    if (fill == "Stone") { return this.fillWithStone(); }
    console.error("Unknown Fill:",fill);
  }

  setExtra(extra, zoneData, index) {
    if (extra.type == "Stairs") { return this.makeStairs((extra.stairs == "Up" ? _U : _D), extra.facing); }
    if (extra.type == "Door") { return this.setDoorExtra(extra); }
    if (extra.type == "Fence") { return this.setFenceExtra(extra); }
    if (extra.type == "Gateway") { return this.setGatewayExtra(extra, zoneData, index); }

    if (extra.type == "SecretDoor") { return; } // TODO: Implement secret doors.
    if (extra.type == "TrappedDoor") { return; } // TODO: Implement trapped doors.
    if (extra.type == "FenceGate") { return; } // TODO: Implement fence gates.
    if (extra.type == "Pillar") { return; } // TODO: Implement pillars.

    console.error("Unknown Extra Error: What do I do with this? ",extra);
  }

  setExtended(extension, zoneData, index) {
    if (extension.type == "Tree") { return this.fillWithTree(extension.value); }
    if (extension.type == "Statue") { return this.fillWithStatue(extension.value); }
    if (extension.type == "Bridge") { return; } // TODO: Implement Bridges
    if (extension.type == "Sign") { return; } // TODO: Implement Signs
    if (extension.type == "Bang") { return; } // TODO: Implement Triggers
    if (extension.type == "Trigger") { return; } // TODO: Implement Triggers
    if (extension.type == "PossibleTrigger") { return; } // TODO: Implement Triggers

    console.error("Unknown Extension Error: What do I do with this?", extension);
  }

  setFenceExtra(extra) {
    NSEW(facing => {
      if (extra.facing.indexOf(facing) >= 0) {
        if (this.#walls[facing] != null) {
          console.error("Error: Trying to set a fence where a wall has already been placed.");
        } else {
          this.#walls[facing] = new Wall(_wallFence);
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

  setGatewayExtra(extra, zoneData, index) {
    // Loop through all of the exit points in the zone data to see if this exit
    // point matches.
    ObjectHelper.each(zoneData.exits, zoneName => {
      let exitData = zoneData.exits[zoneName]
      exitData.points.forEach(point => {
        if (index.equals(point)) {
          this.setTrigger(Trigger.exit({ toZone:zoneName, visible:exitData.visible }))
        }
      });
    });
  }

}
