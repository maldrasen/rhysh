global.TilePacker = (function() {

  function pack(tile) {
    const packed = {
      type: tile.getType(),
      floor: (tile.getFloor() ? tile.getFloor().pack() : null),
      trigger: (tile.getTrigger() ? tile.getTrigger().pack() : null),
      walls: {},
    };

    if (tile.getFillType()) {
      packed.fillType = tile.getFillType();
      packed.fillName = tile.getFillName();
    }

    if (tile.getStairDirection()) {
      packed.stairDirection = tile.getStairDirection();
      packed.stairFacing = tile.getStairFacing();
    }

    NSEW(facing => {
      packed.walls[facing] = tile.wallAt(facing) ? tile.wallAt(facing).pack() : null;
    })

    return packed
  }

  function unpack(data) {
    if (data.type == null) { throw `No Type.` }

    const tile = new Tile({
      type: data.type,
      fillType: data.fillType,
      fillName: data.fillName,
      stairDirection: data.stairDirection,
      stairFacing: data.stairFacing,
      sector_id: data.sector_id,
      biome_id: data.biome_id,
    });

    if (data.floor) {
      tile.setFloor(Floor.unpack(data.floor));
    }

    if (data.trigger) {
      tile.setTrigger(Trigger.unpack(data.trigger));
    }

    if (data.walls) {
      NSEW(facing => {
        if (data.walls[facing]) {
          tile.setWall(facing, Wall.unpack(data.walls[facing]));
        }
      });
    }

    return tile;
  }

  return {
    pack,
    unpack,
  }

})();
