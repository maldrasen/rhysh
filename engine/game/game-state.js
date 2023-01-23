global.GameState = (function() {

  const StartLocation = new Vector(0,0,0);
  const StartDirection = "W";
  const StartStage = "TownGuild";
  const StartZone = "Wolgur";

  var worldIndex;
  var worldPath;
  var timeCount;
  var dayCount;
  var partyLocation;
  var partyDirection;
  var stage;

  function newGame() {
    if (worldIndex != null) { throw `Error: Game is not empty.` }

    worldIndex = Settings.getWorldCounter();
    worldPath = `${DATA}/worlds/world-${worldIndex}`;

    timeCount = 0;
    dayCount = 0;
    partyLocation = StartLocation;
    partyDirection = StartDirection;
    stage = StartStage;

    console.log(`\n\nCreating new game in ${worldPath}`)

    fs.mkdir(worldPath, { recursive:true }, error => {
      if (error) { throw error; }

      Settings.setLastWorld(worldIndex);
      Settings.incWorldCounter();
      Settings.save();

      Dungeon.start();
      Dungeon.loadZone(StartZone);
      // Add an event that starts us in town.
      // For now though we can start on the Wolgur map
    });
  }

  async function clear() {
    worldIndex = null;
    worldPath = null;
    timeCount = null;
    dayCount = null;
    partyLocation = null;
    partyDirection = null;
    stage = null;

    await Database.clear();
  }

  function worldPath() { return worldPath }

  return {
    newGame,
    clear,
    worldPath
  };

})();
