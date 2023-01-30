
const MapColor = {
  solidStone: 0x080808,
  floorStone: 0x161616,
  floorWater: 0x293b6a,
  floorVoid:  0x000000,
  wallStone:  0x888888,
  fence:      0x432d20,
  door:       0xCCCCCC,
  outline:    0x000000,
};

const TreeColors = [0x33532b, 0x2c4c28, 0x23401f, 0x1c3a1b, 0x1a351b, 0x132d13, 0x0d2b0d, 0x072809];

const WallGeometry = {}
const FenceGeometry = {}
const DoorGeometry = {}

const wallThickness = 6;
const doorThickness = 12;
const doorInset = 12;
const doorWidth = 40;

// TODO: Eventually the TileGraphics will have to take tile visibility into consideration. Normally we only want to
//       show tiles that the player has seen. They don't nessessarily need to have visited the tile, but they need to
//       have had the tile in their view (which is more difficult to figure out of course) That's the only way that
//       solid tiles would become visible of course. We'd also need a way to determine if a tile blocks the view of
//       the tile past it, or even how much. You should be able to see around a tree for instance, but not though a
//       solid block, but also maybe not as well as through open air. The amount of light the party is emitting should
//       also effect this. Plus there will be spells to show an area of the map, so need to include those tiles on the
//       map as well. This feature is much further down the road though.

window.TileGraphics = class TileGraphics {

  static init() {
    initWallGeometry();
    initFenceGeometry();
    initDoorGeometry();
  }

  constructor(entry) {
    this.tileEntry = entry;
    this.graphics = new PIXI.Graphics();
    this.graphics.pivot.x = TileSize/2;
    this.graphics.pivot.y = TileSize/2;
  }

  build() {
    this.setPosition();
    this.drawGround();

    NSEW(facing => {
      let wall = this.tileEntry.tile.walls[facing]
      if (wall) { this.drawWall(facing, wall); }
    });

    this.drawFill();
    this.drawStairs();

    return this.graphics;
  }

  drawGround() {
    let floor = this.tileEntry.tile.floor;
    let fillColor = MapColor.floorStone;

    if (floor && floor.type == "Water") {
      fillColor = MapColor.floorWater;
    }
    if (floor == null) {
      if (this.tileEntry.tile.type == "Empty") { fillColor = MapColor.floorVoid; }
      if (this.tileEntry.tile.type == "Solid") { fillColor = MapColor.solidStone; }
    }

    this.graphics.beginFill(fillColor);
    this.graphics.drawRect(0, 0, TileSize, TileSize);
    this.graphics.endFill();
  }

  drawWall(facing, wall) {
    let g;
    let color;

    if (wall.type == 'Fence') {
      g = FenceGeometry[facing];
      color = MapColor.fence;
    } else {
      g = WallGeometry[facing];
      color = MapColor.wallStone;
    }

    this.graphics.beginFill(color);
    this.graphics.drawRect(g.x, g.y, g.width, g.height);
    this.graphics.endFill();

    if (wall.type == "Door") {
      this.drawDoor(facing);
    }
  }

  drawDoor(facing) {
    let g = DoorGeometry[facing];

    this.graphics.lineStyle(4, MapColor.outline);
    this.graphics.beginFill(MapColor.door);
    this.graphics.drawRect(g.x, g.y, g.width, g.height);
    this.graphics.endFill();

    // Cover the line between doors on different tiles.
    this.graphics.lineStyle(6, MapColor.door);
    this.graphics.moveTo(g.start.x, g.start.y);
    this.graphics.lineTo(g.stop.x, g.stop.y);
    this.graphics.lineStyle(0, MapColor.outline);
  }

  drawFill() {
    if (this.tileEntry.tile.fillType == null) { return; }

    let drawFunction = {
      Tree: 'drawTree',
      Statue: 'drawStatue',
    }[this.tileEntry.tile.fillType]

    if (drawFunction) {
      return this[drawFunction]();
    }

    console.error(`No draw function for fill ${this.tileEntry.tile.fillType}`)
  }

  drawTree() {
    let fillName = this.tileEntry.tile.fillName;
    let size;
    let color;

    if (fillName == 'random') {
      color = Random.from(TreeColors);
      size = Random.between(20,28);
    }

    this.graphics.lineStyle(0);
    this.graphics.beginFill(color);
    this.graphics.drawCircle(TileSize/2,TileSize/2,size);
    this.graphics.endFill();
  }

  drawStatue() {
    let fillName = this.tileEntry.tile.fillName;
    let fillColor = MapColor.wallStone;
    let size = 25;

    this.graphics.lineStyle(0);
    this.graphics.beginFill(fillColor);
    this.graphics.drawCircle(TileSize/2,TileSize/2,size);
    this.graphics.endFill();
  }

  // The size of the sprite is adjusted so that the walls are visble.
  drawStairs() {
    if (this.tileEntry.tile.type == "Stairs") {
      let direction = this.tileEntry.tile.stairDirection;
      let facing = this.tileEntry.tile.stairFacing;
      let walls = this.tileEntry.tile.walls;
      let sprite = PIXI.Sprite.from(iconForStairs(direction, facing));

      sprite.x = 0;
      sprite.y = 0;
      sprite.height = TileSize;
      sprite.width = TileSize;

      if (walls.W) {
        sprite.x = wallThickness;
        sprite.width = sprite.width - wallThickness;
      }
      if (walls.E) {
        sprite.width = sprite.width - wallThickness;
      }
      if (walls.N) {
        sprite.y = wallThickness;
        sprite.height = sprite.height - wallThickness;
      }
      if (walls.S) {
        sprite.height = sprite.height - wallThickness;
      }

      this.graphics.addChild(sprite);
    }
  }

  setPosition() {
    this.graphics.position.x = this.tileEntry.index.x * TileSize;
    this.graphics.position.y = this.tileEntry.index.y * TileSize;
  }
}

// Because these numbers don't change we can precalculate all the geometry for
// everything we need to draw. Should make things a bit faster to only do this
// once rather than every frame for every tile.
function initWallGeometry() {
  let bump = TileSize - wallThickness

  WallGeometry.N = { x:0,    y:0,    width:TileSize,      height:wallThickness };
  WallGeometry.S = { x:0,    y:bump, width:TileSize,      height:wallThickness };
  WallGeometry.E = { x:bump, y:0,    width:wallThickness, height:TileSize };
  WallGeometry.W = { x:0,    y:0,    width:wallThickness, height:TileSize };
}

function initFenceGeometry() {
  let offset = 2;
  let bump = (TileSize - wallThickness) - offset;

  FenceGeometry.N = { x:0,      y:offset, width:TileSize,      height:wallThickness };
  FenceGeometry.S = { x:0,      y:bump,   width:TileSize,      height:wallThickness };
  FenceGeometry.E = { x:bump,   y:0,      width:wallThickness, height:TileSize };
  FenceGeometry.W = { x:offset, y:0,      width:wallThickness, height:TileSize };
}

function initDoorGeometry() {
  let bump = TileSize - doorThickness;
  let lineStart = doorInset + 2;
  let lineStop = doorInset + doorWidth - 2;

  DoorGeometry.N = { x:doorInset, y:0, width:doorWidth, height:doorThickness };
  DoorGeometry.N.start = new Vector(lineStart, 0);
  DoorGeometry.N.stop = new Vector(lineStop, 0);

  DoorGeometry.S = { x:doorInset, y:bump, width:doorWidth, height:doorThickness };
  DoorGeometry.S.start = new Vector(lineStart, TileSize);
  DoorGeometry.S.stop = new Vector(lineStop, TileSize);

  DoorGeometry.E = { x:bump, y:doorInset, width:doorThickness, height:doorWidth };
  DoorGeometry.E.start = new Vector(TileSize, lineStart);
  DoorGeometry.E.stop = new Vector(TileSize, lineStop);

  DoorGeometry.W = { x:0, y:doorInset, width:doorThickness, height:doorWidth };
  DoorGeometry.W.start = new Vector(0, lineStart);
  DoorGeometry.W.stop = new Vector(0, lineStop);
}

function iconForStairs(direction, facing) {
  let dir = direction == "U" ? "up" : "down";
  return `../assets/icons/stairs-${dir}-${facing}.png`;
}
