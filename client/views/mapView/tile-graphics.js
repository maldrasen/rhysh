
const MapColor = {
  ground: 0x333333,
  wall:   0x888888,
};

window.TileGraphics = class TileGraphics {

  constructor(entry) {
    this.tileEntry = entry;
    this.graphics = new PIXI.Graphics();
  }

  build(entry) {
    this.drawGround();
    this.drawWalls();
    this.setPosition();
    return this.graphics;
  }

  drawGround() {
    this.graphics.beginFill(MapColor.ground);
    this.graphics.drawRect(4, 4, TileSize-8, TileSize-8);
    this.graphics.endFill();
  }

  drawWalls() {
    this.graphics.beginFill(MapColor.wall);
    this.graphics.drawRect(0, 0, TileSize, 4); // N
    this.graphics.drawRect(0, TileSize-4, TileSize, 4); // S
    this.graphics.drawRect(TileSize-4, 0, 4, TileSize); // E
    this.graphics.drawRect(0, 0, 4, TileSize); // W
    this.graphics.endFill();
  }

  setPosition() {
    this.graphics.position.x = this.tileEntry.index.x * TileSize;
    this.graphics.position.y = this.tileEntry.index.y * TileSize;
  }

}