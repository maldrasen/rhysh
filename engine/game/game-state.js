global.GameState = (function() {

  const StartLocation = new Vector(0,0,0);
  const StartDirection = "W";
  const StartStage = "TownGuild";

  var timeCount;
  var dayCount;
  var partyLocation;
  var partyDirection;
  var stage;
  var world;

  function start(worldIndex) {
    if (world != null) { throw `Error: Game is not empty.` }

    timeCount = 0;
    dayCount = 0;
    partyLocation = startLocation;
    partyDirection = startDirection;
    stage = startStage;
    world = worldIndex;

    // Add an event that starts us in town.
  }

  async function clear() {
    timeCount = null;
    dayCount = null;
    partyLocation = null;
    partyDirection = null;
    stage = null;
    world = null;

    await Database.clear();
  }

  return { start };

})();
