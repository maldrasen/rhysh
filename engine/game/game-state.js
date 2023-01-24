global.GameState = (function() {

  const StartLocation = new Vector(61,59,102);
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
    clear().then(async () => {
      setWorldIndex(index);

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
    worldIndex = index;
    worldPath = `${DATA}/worlds/world-${worldIndex}`;
  }

  function getWorldPath() { return worldPath; }

  // Whenever the party moves from one zone into another we update the party location to the point where they enter the
  // zone from. The new point is found in the zoneData for their current zone which should have a list of places it's
  // possible to come to the current zone from. (Or there should at least be a "Default" value)
  function setZone(zoneName) {
    let previousZone = currentZone;
    let currentZone = zoneName;

    Dungeon.getZone(zoneName).then(zone => {
      let zoneData = zone.zoneData;
      let origin;

      if (zoneData.origins.Default) {
        origin = zoneInfo.origins.Default;
      }
      if (zoneInfo.origins[previousZone]) {
        origin = zoneInfo.origins[previousZone]
      }
      if (origin == null) {
        throw `Cannot update origin. No origin point found for ${previousZone} and no default was set.`;
      }

      this.partyLocation = origin.index
      this.partyDirection = origin.facing
    });
  }

  return {
    newGame,
    saveGame,
    loadGame,
    clear,
    getWorldPath,
  };

})();
