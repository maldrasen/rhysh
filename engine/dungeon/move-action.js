global.MoveAction = class MoveAction {

  constructor(direction) {
    let zone = GameState.getCurrentZone();

    this.response = { action:'none' };
    this.direction = direction;
    this.location = GameState.getPartyLocation();

    let neighbor = zone.tileSource.getNeighborTiles(this.location)[this.direction];

    this.sourceTile = zone.tileSource.getTile(this.location);
    this.destinationTile = neighbor ? neighbor.tile : null;
  }

  // Response:
  //   action:[none, move, climb, warp]
  //   location: the location being moved to
  getResponse() {

    // First make sure that the destination tile is a valid tile.
    if (this.destinationTile == null) { return this.response; }
    if (this.destinationTile.isSolid()) { return this.response; }
    if (this.destinationTile.hasFloor() == false && this.destinationTile.isStairs() == false) { return this.response; }

    this.sourceWall = this.sourceTile.wallAt(this.direction);
    this.destinationWall = this.destinationTile.wallAt(oppositeDirection(this.direction));

    // The party pushed against a wall. This can be a complicated interaction.
    if (this.sourceWall || this.destinationWall) {
      this.handleWall();
    }
    // If there were no walls than the party can move.
    else {
      this.response.location = this.location.go(this.direction);
      this.response.action = 'move';
    }

    // Climb stairs
    if (this.destinationTile.isStairs()) {
      let dir = this.destinationTile.stairDirection == U ? U : D;
      this.response.location = this.response.location.go(dir);
      this.response.action = 'climb';
    }

    this.handleMovement();

    return this.response;
  }

  // Pushing against a wall can be rather complicated. If the wall is solid and
  // uninteresting we can just return false. If there is something interesting
  // about the wall, pushing against it may trigger something, like reveiling a
  // hidden door.
  //
  // TODO: Eventually we'll need to handle trapped or locked doors but for now
  //       we assume that every door is unlocked and can be passed though.
  handleWall() {
    let sourceType = this.sourceWall ? this.sourceWall.type : null;
    let destinationType = this.destinationWall ? this.destinationWall.type : null;

    if (sourceType == Wall.Type.Normal)      { return false; }
    if (sourceType == Wall.Type.Fence)       { return false; }
    if (destinationType == Wall.Type.Fence)  { return false; }
    if (destinationType == Wall.Type.Normal) { return false; }

    if (sourceType == Wall.Type.Door) {
      this.response.location = this.location.go(this.direction);
      this.response.action = 'move';
      this.response.doorAction = 'opened';
      this.response.doorStory = 'The door was unlocked.';
    }
  }

  // When we move from one tile to another we need to check for a bunch of
  // different things that can happen. Events can be triggered, battles can
  // start, secrets can be reveiled.
  handleMovement() {
    if (this.response.action == 'none') { return; }

    // console.log("Handle Movement:");
    // console.log(`  From (${this.location}):`,this.sourceTile);
    // console.log(`  To (${this.response.location}):`,this.destinationTile);
    // console.log("  Response:",this.response);

    GameState.setPartyLocation(this.response.location);
  }

}