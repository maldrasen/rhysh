global.TileLoader = (function() {

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
  // because the zone is used to lookup event points and such, which shouldn't
  // apply to plain features.
  function fromTileData(tileData, zone, index) {
    const tile = new Tile();
    const root = tileData.root;

    if (root == null) {
      return console.error('No Root in:',tileData);
    }

    setType(tile, root.tile);

    if (root.walls) { setWalls(tile, root.walls); }
    if (root.floor) { setFloor(tile, root.floor); }
    if (root.tile == "Solid") { setFill(tile, root.fill); }
    if (tileData.extra) { setExtra(tile, tileData.extra, zone, index); }
    if (tileData.extended) { setExtended(tile, tileData.extended, zone, index); }

    return tile;
  }

  function setType(tile, string) {
    tile.setType({
      Empty: _tileEmpty,
      Solid: _tileSolid,
    }[string]);
  }

  function setWalls(tile, wallString) {
    NSEW(facing => {
      if (wallString.indexOf(facing) >= 0) {
        tile.placeWall(facing);
      }
    });
  }

  function setFloor(tile, floorString) {
    tile.setFloor(Floor.fromString(floorString));
  }

  function setFill(tile, fill) {
    if (fill == "Stone") { return tile.fillWithStone(); }
    throw `Unknown Fill ${fill}`;
  }

  function setExtra(tile, extra, zone, index) {
    if (extra.type == "Stairs") { return tile.makeStairs((extra.stairs == "Up" ? _U : _D), extra.facing); }
    if (extra.type == "Door") { return setDoorExtra(tile, extra); }
    if (extra.type == "Fence") { return setFenceExtra(tile, extra); }
    if (extra.type == "Gateway") { return setGatewayExtra(tile, zone, index); }

    if (extra.type == "SecretDoor") { return; } // TODO: Implement secret doors.
    if (extra.type == "TrappedDoor") { return; } // TODO: Implement trapped doors.
    if (extra.type == "FenceGate") { return; } // TODO: Implement fence gates.
    if (extra.type == "Pillar") { return; } // TODO: Implement pillars.

    throw `Unknown Extra Error: What do I do with this? ${JSON.stringify(extra)}`
  }

  function setExtended(tile, extension, zone, index) {
    if (extension.type == "Tree") { return tile.fillWithTree(extension.value); }
    if (extension.type == "Statue") { return tile.fillWithStatue(extension.value); }
    if (extension.type == "Bridge") { return; } // TODO: Implement Bridges
    if (extension.type == "Sign") { return; } // TODO: Implement Signs
    if (extension.type == "Bang") { return; } // TODO: Implement Triggers
    if (extension.type == "Trigger") { return; } // TODO: Implement Triggers
    if (extension.type == "PossibleTrigger") { return; } // TODO: Implement Triggers

    throw `Unknown Extension Error: What do I do with this? ${JSON.stringify(extension)}`
  }

  function setFenceExtra(tile, extra) {
    NSEW(facing => {
      if (extra.facing.indexOf(facing) >= 0) {
        if (tile.wallAt(facing) != null) {
          throw `Error: Trying to set a fence where a wall has already been placed.`;
        } else {
          tile.setWall(facing, new Wall(_wallFence));
        }
      }
    });
  }

  function setDoorExtra(tile, extra) {
    NSEW(facing => {
      if (extra.facing.indexOf(facing) >= 0) {
        tile.placeDoor(facing);
      }
    });
  }

  // Loop through all of the exit points in the zone data to see if this exit
  // point matches.
  function setGatewayExtra(tile, zone, index) {
    ObjectHelper.each(zone.exits, zoneName => {
      let exitData = zone.exits[zoneName]
      exitData.points.forEach(point => {
        if (index.equals(point)) {
          tile.setTrigger(Trigger.exit({ toZone:zoneName, visible:exitData.visible }))
        }
      });
    });
  }

  return { fromTileData };

})();
