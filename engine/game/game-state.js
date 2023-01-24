global.GameState = (function() {

  const StartLocation = new Vector(0,0,0);
  const StartDirection = "W";
  const StartStage = "TownGuild";
  const StartZone = "Wolgur";

  var worldIndex;
  var worldPath;

  var timeCount;
  var dayCount;

  var stage;
  var currentZone;
  var partyLocation;
  var partyDirection;

  function newGame() {
    if (worldIndex != null) { throw `Error: Game is not empty.` }

    setWorldIndex(Settings.getWorldCounter());

    timeCount = 0;
    dayCount = 0;

    stage = StartStage;
    currentZone = StartZone;
    partyLocation = StartLocation;
    partyDirection = StartDirection;

    console.log(`\n\nCreating new game in ${worldPath}`)

    fs.mkdir(worldPath, { recursive:true }, error => {
      if (error) { throw error; }

      Settings.setLastWorld(worldIndex);
      Settings.incWorldCounter();
      Settings.save();

      Dungeon.start();
      Dungeon.loadZone("Wolgur");
      Dungeon.loadZone("WolgurCleft");

      // Add an event that starts us in town.
      // For now though we can start on the Wolgur map

      saveGame();
    });
  }

  function saveGame() {
    Kompressor.write(`${worldPath}/GameState.cum`,{
      timeCount: timeCount,
      dayCount: dayCount,
      stage: stage,
      currentZone: currentZone,
      partyLocation: partyLocation,
      partyDirection: partyDirection,
    });

    Sector.save();
  }

  async function loadGame(index) {
    setWorldIndex(index);

    clear().then(async () => {
      let state = await Kompressor.read(`${worldPath}/GameState.cum`);

      timeCount = state.timeCount;
      dayCount = state.dayCount;
      stage = state.stage;
      currentZone = state.currentZone;
      partyLocation = state.partyLocation;
      partyDirection = state.partyDirection;

      await Sector.load();
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

  function setWorldIndex(index) {
    worldIndex = Settings.getWorldCounter();
    worldPath = `${DATA}/worlds/world-${worldIndex}`;
  }

  function getWorldPath() { return worldPath; }

  return {
    newGame,
    saveGame,
    loadGame,
    clear,
    getWorldPath,
  };

})();
