describe('Tile', function() {

  it("builds a normal tile", function() {
    let tile = Tile.normal();
    expect(tile.type).to.equal(Tile.Type.Empty);
    expect(tile.floor.type).to.equal(Floor.Type.Normal);
  });

  it("builds a solid tile", function() {
    let tile = Tile.solidStone();
    expect(tile.type).to.equal(Tile.Type.Solid);
    expect(tile.fillType).to.equal(Tile.FillType.Stone);
    expect(tile.fillName).to.equal("dungeon");
  });

  it("Flips walls horizontally", function() {
    let tile = Tile.normal();
    tile.placeWall(E);
    tile.flipH();
    expect(tile.wallAt(E)).to.be.null;
    expect(tile.wallAt(W).isNormal()).to.be.true;
  });

  it("Flips walls vertically", function() {
    let tile = Tile.normal();
    tile.placeWall(N);
    tile.flipV();
    expect(tile.wallAt(N)).to.be.null;
    expect(tile.wallAt(S).isNormal()).to.be.true;
  });

  it("Flips walls diagonally", function() {
    let tile = Tile.normal();
    tile.placeWall(N);
    tile.placeWall(W);
    tile.flipD();
    expect(tile.wallAt(N)).to.be.null;
    expect(tile.wallAt(W)).to.be.null;
    expect(tile.wallAt(S).isNormal()).to.be.true;
    expect(tile.wallAt(E).isNormal()).to.be.true;
  });

  it("sets walls from a string", function() {
    let tile = Tile.normal();
    tile.setWallsFromString("SEX");
    expect(tile.wallAt(S).isNormal()).to.be.true;
    expect(tile.wallAt(E).isNormal()).to.be.true;
    expect(tile.wallAt(W)).to.be.null;
  });

  it("sets the floor from a string", function() {
    let tile = Tile.normal();
    tile.setFloorFromString("Water");
    expect(tile.floor.isWater()).to.be.true;
  })

});
