global.Dungeon = (function() {

  let zoneCache = {};

  // Return types:
  //    false                  - That move isn't possible, don't do anything.
  //    { moveTo:location }    - The party has stepped to an adjecent tile.
  //    { climbTo:location }   - The party has taken stairs or climbed to to an new z-level.
  //    { warpTo:location }    - The party has teleported to a new location or crossed into a new zone.
  //
  function requestMove(direction) {
    let zone = zoneCache[GameState.getZone()];
    let location = GameState.getPartyLocation();
    let sourceTile = zone.tileSource.getTile(location);
    let destinationTile = zone.tileSource.getNeighborTiles(location)[direction];

    if (destinationTile == null) { return false; }
    if (destinationTile.tile == null) { return false; }

    // First make sure that the destination tile is a valid tile.
    destinationTile = destinationTile.tile;
    if (destinationTile.type == Tile.Type.Solid) { return false; }
    if (destinationTile.hasFloor() == false) { return false; }

    // The party pushed against a wall. This can be a complicated interaction.
    if (sourceTile.wallAt(direction) || destinationTile.wallAt(oppositeDirection(direction))) {
      return handleWall({
        location: location,
        direction: direction,
        sourceTile: sourceTile,
        destinationTile: destinationTile,
        sourceWall: sourceTile.wallAt(direction),
        destinationWall: destinationTile.wallAt(oppositeDirection(direction)),
      });
    }

    // Both source and destination are valid. We can move to the new tile.
    // Moving might trigger an event or a battle though. If so that trigger
    // should be included with the move event.
    let newLocation = location.go(direction);
    let response = { moveTo:newLocation };

    // Climb stairs
    if (destinationTile.type == Tile.Type.Stairs) {
      if (destinationTile.stairDirection == U) { newLocation = newLocation.go(U); }
      if (destinationTile.stairDirection == D) { newLocation = newLocation.go(D); }
      response = { climbTo:newLocation }
    }

    // console.log("Check for everything:");
    // console.log("  From:",sourceTile);
    // console.log("  To:",destinationTile);

    GameState.setPartyLocation(newLocation);

    return response;
  }

  // Pushing against a wall can be rather complicated. If the wall is solid and
  // uninteresting we can just return false. If there is something interesting
  // about the wall, pushing against it may trigger something, like reveiling a
  // hidden door.
  //
  // TODO: Eventually we'll need to handle trapped or locked doors but for now
  //       we assume that every door is unlocked and can be passed though.
  function handleWall(context) {
    let location = context.location;
    let direction = context.direction;
    let sourceType = context.sourceWall ? context.sourceWall.type : null;
    let destinationType = context.destinationWall ? context.destinationWall.type : null;

    if (sourceType == Wall.Type.Normal)      { return false; }
    if (sourceType == Wall.Type.Fence)       { return false; }
    if (destinationType == Wall.Type.Fence)  { return false; }
    if (destinationType == Wall.Type.Normal) { return false; }

    if (sourceType == Wall.Type.Door) {
      let newLocation = location.go(direction);

      GameState.setPartyLocation(newLocation);

      return {
        moveTo: newLocation,
        doorAction: "opened",
        doorStory: "The door was unlocked.",
      };
    }
  }

  // === Zone Management =======================================================

  // A zone is ready if it has already been put into the cache.
  function isZoneReady(name) {
    return zoneCache[name] != null;
  }

  // This function will get the cached copy of the zone if it's already been
  // loaded. If it's already been built this will read the zone file first,
  // then return the zone. If the zone has never been built it will be created
  // first.
  function getZone(name, callback) {
    isZoneReady(name) ? callback(zoneCache[name]) : loadZone(name).then(zone => callback(zone));
  }

  function loadZone(name) {
    console.log("Loading Zone:",name)

    return new Promise(resolve => {
      new Zone(name).load().then(zone => {
        zoneCache[name] = zone;
        resolve(zone);
      });
    });
  }

  return { requestMove, isZoneReady, getZone, loadZone };

})();





