global.GameState = (function() {

  // New Game Constants
  const StartLocation = new Vector(61,59,102);
  const StartStage = "NewGame";
  const StartZone = "Wolgur";

  // Time - Each tick is 10 seconds
  //        We'll eventually want to put this into a calander class.
  const DayLength = 24*60*60*6;

  var worldIndex;
  var worldPath;

  var timeCount;
  var dayCount;

  var stageName;
  var currentZone;
  var partyLocation;

  function newGame() {
    if (worldIndex != null) { throw `Error: Game is not empty.` }

    setWorldIndex(Settings.getWorldCounter());

    timeCount = 0;
    dayCount = 0;

    stageName = StartStage;
    currentZone = StartZone;
    partyLocation = StartLocation;

    console.log(`\n\nCreating new game in ${worldPath}`)

    fs.mkdir(worldPath, { recursive:true }, error => {
      if (error) { throw error; }

      Settings.setLastWorld(worldIndex);
      Settings.incWorldCounter();
      Settings.save();

      Dungeon.loadZone("Wolgur");
      Dungeon.loadZone("WolgurCleft");

      // Add an event that starts us in town.
      // For now though we can start on the Wolgur map

      saveGame();
      render();
    });
  }

  function saveGame() {
    Kompressor.write(`${worldPath}/GameState.cum`,{
      timeCount: timeCount,
      dayCount: dayCount,
      stageName: stageName,
      currentZone: currentZone,
      partyLocation: partyLocation,
    });

    Sector.save();
  }

  async function loadGame(index) {
    clear().then(async () => {
      setWorldIndex(index);

      let state = await Kompressor.read(`${worldPath}/GameState.cum`);

      timeCount = state.timeCount;
      dayCount = state.dayCount;
      stageName = state.stageName;
      currentZone = state.currentZone;
      partyLocation = Vector.from(state.partyLocation);

      Dungeon.loadZone(currentZone);

      await Sector.load();

      render();
    });
  }

  async function clear() {
    worldIndex = null;
    worldPath = null;
    timeCount = null;
    dayCount = null;
    partyLocation = null;
    stageName = null;

    await Database.clear();
  }

  // I'm not sure if setting the stage should trigger the render or that should
  // be done manually. Maybe do it manually for now and see if there are
  // instances where we don't. It's possible this will need to do some work
  // between the set and the render that only the setter knows about.
  function setStageName(stage) {
    if (GameState.Stages[stage] == null) { throw `Error: Unknown Stage "${stage}"`; }
    stageName = stage;
  }

  function setWorldIndex(index) {
    worldIndex = index;
    worldPath = `${DATA}/worlds/world-${worldIndex}`;
  }

  // Whenever the party moves from one zone into another we update the party
  // location to the point where they enter the zone from. The new point is
  // found in the zoneData for their current zone which should have a list of
  // places it's possible to come to the current zone from. (Or there should at
  // least be a "Default" value)
  function setCurrentZone(zoneName) {
    return new Promise(resolve => {
      Dungeon.getZone(zoneName, async (zone) => {

        let previousZone = currentZone;
        let zoneData = await zone.getZoneData();

        if (zoneData.origins.Default) { setPartyLocation(Vector.from(zoneData.origins.Default)); }
        if (zoneData.origins[previousZone]) { setPartyLocation(Vector.from(zoneData.origins[previousZone])); }

        if (getPartyLocation() == null) {
          throw `Cannot update origin. No origin point found for ${previousZone} and no default was set.`;
        }

        currentZone = zoneName;
        resolve();
      });
    });
  }

  function setPartyLocation(location) {
    partyLocation = location;
  }

  function getStage() { return GameState.Stages[stageName]; }
  function getStageName() { return stageName; }
  function getWorldPath() { return worldPath; }
  function getCurrentZoneName() { return currentZone; }
  function getCurrentZone() { return Dungeon.getCachedZone(currentZone); }
  function getPartyLocation() { return partyLocation; }

  // TODO: Right now we're only keeping track of the time. Eventually the
  //       passage of time will trigger different events and conditions and
  //       whatnot.
  function advanceTime(ticks) {
    timeCount += ticks;
    if (timeCount >= DayLength) {
      dayCount += 1;
      timeCount = 0;
    }
  }

  function render() {
    ViewState.render({
      timeCount: timeCount,
      dayCount: dayCount,
      stageName: getStageName(),
      stage: getStage(),
      zone: getCurrentZoneName(),
      location: getPartyLocation(),
    });
  }

  return {
    newGame,
    saveGame,
    loadGame,
    clear,

    setCurrentZone,
    setStageName,
    setPartyLocation,

    getCurrentZone,
    getCurrentZoneName,
    getStage,
    getStageName,
    getWorldPath,
    getPartyLocation,

    advanceTime,

    render,
  };

})();

GameState.Stages = {

  // Basic Views
  NewGame:        { view:"NewGame"        },
  TownBlacksmith: { view:"TownBlacksmith" },
  TownGuild:      { view:"TownGuild"      },
  TownStore:      { view:"TownStore"      },
  TownTavern:     { view:"TownTavern"     },

  // Complex Views
  Dungeon: { control:"Dungeon" },
  Battle:  { control:"Battle"  },

};
