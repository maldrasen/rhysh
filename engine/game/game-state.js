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

  function newGame() {
    if (world != null) { throw `Error: Game is not empty.` }

    let worldIndex = 666; // TODO: Look this up from configuration file.

    timeCount = 0;
    dayCount = 0;
    partyLocation = StartLocation;
    partyDirection = StartDirection;
    stage = StartStage;
    world = worldIndex;

    // Add an event that starts us in town.
    // For now though we can start on the Wolgur map
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

  return { newGame, clear };

})();
