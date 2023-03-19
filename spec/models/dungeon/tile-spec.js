describe('Tile', function() {

  it("builds a normal tile", function() {
    let tile = Tile.normal();
    expect(tile.getType()).to.equal(_tileEmpty);
    expect(tile.getFloor().getType()).to.equal(_floorNormal);
  });

  it("builds a solid tile", function() {
    let tile = Tile.solidStone();
    expect(tile.getType()).to.equal(_tileSolid);
    expect(tile.getFillType()).to.equal(_tileFillStone);
    expect(tile.getFillName()).to.equal("dungeon");
  });

  it("Flips walls horizontally", function() {
    let tile = Tile.normal();
    tile.placeWall(_E);
    tile.flipH();
    expect(tile.wallAt(_E)).to.be.null;
    expect(tile.wallAt(_W).isNormal()).to.be.true;
  });

  it("Flips walls vertically", function() {
    let tile = Tile.normal();
    tile.placeWall(_N);
    tile.flipV();
    expect(tile.wallAt(_N)).to.be.null;
    expect(tile.wallAt(_S).isNormal()).to.be.true;
  });

  it("Flips walls diagonally", function() {
    let tile = Tile.normal();
    tile.placeWall(_N);
    tile.placeWall(_W);
    tile.flipD();
    expect(tile.wallAt(_N)).to.be.null;
    expect(tile.wallAt(_W)).to.be.null;
    expect(tile.wallAt(_S).isNormal()).to.be.true;
    expect(tile.wallAt(_E).isNormal()).to.be.true;
  });

  it("sets walls from a string", function() {
    let tile = Tile.normal();
    tile.setWallsFromString("SEX");
    expect(tile.wallAt(_S).isNormal()).to.be.true;
    expect(tile.wallAt(_E).isNormal()).to.be.true;
    expect(tile.wallAt(_W)).to.be.null;
  });

  it("sets the floor from a string", function() {
    let tile = Tile.normal();
    tile.setFloorFromString("Water");
    expect(tile.getFloor().isWater()).to.be.true;
  })

});
