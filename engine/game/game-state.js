global.GameState = (function() {

  // TODO: Game State is getting stupid long. We should break this into
  //       multiple classes. Perhaps saving and loading could be done someplace
  //       else, and managing the current state should be done here.

  // New Game Constants
  const StartLocation = new Vector(61,59,102);
  const StartStage = "NewGame";
  const StartZone = "Wolgur";

  var worldIndex;
  var worldPath;

  var timeCount;
  var dayCount;

  var stageName;
  var currentBattle;
  var currentEvent;
  var currentZone;
  var partyLocation;

  function newGame() {
    if (worldIndex != null) { throw `Error: Game is not empty.` }

    setWorldIndex(Settings.getWorldCounter());

    timeCount = 14 * RhyshCalendar.TicksPerHour; // 2pm
    dayCount = 69; // Day of the Blushing Wolf

    stageName = StartStage;
    currentZone = StartZone;
    partyLocation = StartLocation;

    console.log(`\n\nCreating new game in ${worldPath}`)

    fs.mkdir(worldPath, { recursive:true }, error => {
      if (error) { throw error; }

      Settings.incWorldCounter();
      Settings.save();

      ZoneLibrary.loadZone("Wolgur");
      ZoneLibrary.loadZone("WolgurCleft");

      saveGame();
      GameRenderer.render();
    });
  }

  // The startGame() function takes place sometime after newGame() is called.
  // It puts the game into the initial state then takes the character creation
  // parameters and builds the main character.
  function startGame(parameters) {
    console.log("=== Game Start ===");
    console.log(parameters);

    CharacterBuilder.buildMainCharacter(parameters);

    Settings.setLastWorld(worldIndex);
    Settings.save();

    setCurrentEvent(new Event("game.start",{}));
    setStageName("Dungeon");
    saveGame();
    GameRenderer.render();
  }

  // This should only be called from the newGame view when we start a new game,
  // but give up before the first event has completed.
  function abortGame() {
    deleteGame(worldIndex);
    clear()
  }

  function saveGame() {

    let state = {
      version: VERSION,
      timeCount: timeCount,
      dayCount: dayCount,
      stageName: stageName,
      currentZone: currentZone,
      partyLocation: partyLocation,
    }

    if (currentEvent) {
      state.currentEvent = currentEvent.pack();
    }

    Kompressor.write(`${worldPath}/GameState.cum`,state);
    CharacterLibrary.saveAll();
    Flag.save();
    Sector.save();

    return "success";
  }

  function deleteGame(index) {
    let path = `${DATA}/worlds/${index}`;
    fs.rm(path, { recursive: true, force: true }, error => {
      console.log(`Deleted Game: ${path}`);
    });
  }

  async function loadGame(index) {
    clear().then(async () => {
      setWorldIndex(index);

      console.log(`=== Loading Game ${index} ===`)

      let state = await Kompressor.read(`${worldPath}/GameState.cum`);

      timeCount = state.timeCount;
      dayCount = state.dayCount;
      stageName = state.stageName;
      currentZone = state.currentZone;
      partyLocation = Vector.from(state.partyLocation);

      if (state.currentEvent) {
        currentEvent = Event.unpack(state.currentEvent);
      }

      ZoneLibrary.loadZone(currentZone);

      await CharacterLibrary.loadMainCharacter();
      await Sector.load();
      await Flag.load();

      GameRenderer.render();
    });
  }

  async function clear() {
    worldIndex = null;
    worldPath = null;
    timeCount = null;
    dayCount = null;

    stageName = null;
    currentBattle = null;
    currentZone = null;
    currentEvent = null;
    partyLocation = null;

    CharacterLibrary.clear();
    Flag.clear();
  }

  function getCurrentEvent() { return currentEvent; }
  function setCurrentEvent(event) { currentEvent = event; }

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
    worldPath = `${DATA}/worlds/${worldIndex}`;
  }

  // Whenever the party moves from one zone into another we update the party
  // location to the point where they enter the zone from. The new point is
  // found in the zoneData for their current zone which should have a list of
  // places it's possible to come to the current zone from. (Or there should at
  // least be a "Default" value)
  function setCurrentZone(zoneName) {
    return new Promise(resolve => {
      ZoneLibrary.getZone(zoneName, async (zone) => {

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
  function getCurrentBattle() { return currentBattle; }
  function getCurrentZoneName() { return currentZone; }
  function getCurrentZone() { return ZoneLibrary.getCachedZone(currentZone); }
  function getTimeCount() { return timeCount; }
  function getDayCount() { return dayCount; }
  function getPartyLocation() { return partyLocation; }

  // === Load Game =============================================================

  async function getLastValidGame() {
    if (areThereWorlds() == false) { return null; }

    let validWorlds = await getValidWorlds();

    return (validWorlds.length > 0) ? validWorlds[0] : null;
  }

  // A world is valid if it has a player object which will happen when the new
  // form has been completed.
  function getValidWorlds() {
    return new Promise(async resolve => {
      let validWorlds = [];

      fs.readdirSync(`${DATA}/worlds`).forEach(worldIndex => {
        if (isWorldValid(`${DATA}/worlds/${worldIndex}`)) {
          validWorlds.push(worldIndex);
        }
      });

      let gameStates = await Promise.all(validWorlds.map(async worldIndex => {
        let path = `${DATA}/worlds/${worldIndex}`

        return compileGameData({
          worldIndex: worldIndex,
          path: path,
          date: new Date(fs.statSync(`${path}/GameState.cum`).mtimeMs),
          gameState: await Kompressor.read(`${path}/GameState.cum`),
          playerState: await Kompressor.read(`${path}/Character-Main.cum`),
        });
      }));

      gameStates = ArrayHelper.compact(gameStates);
      gameStates.sort((a,b) => { return b.date - a.date });

      resolve(gameStates);
    });
  }

  // The game data is the data that is displayed in each row of the load game
  // overlay, and includes information about the main character as well as the
  // current world state.
  //
  // TODO: dayCount and timeCount should be formatted as actual in game date
  //       and time.
  //
  function compileGameData(state) {

    // Games saved under previous versions don't work by default. I might
    // update this in the future to allow for certain version numbers to be
    // loadable, but for now we can always require the current version.
    if (state.gameState.version != VERSION) {
      return console.log(`${state.path} has an invalid version (${state.gameState.version})`);
    }

    try {
      return {
        date: state.date,
        path: state.path,
        worldIndex: state.worldIndex,
        firstName: state.playerState.firstName,
        lastName: state.playerState.lastName,
        archetype: ArchetypeDictionary.lookup(state.playerState.archetypeCode).name,
        species: SpeciesDictionary.lookup(state.playerState.speciesCode).name,
        sex: state.playerState.sex,
        level: state.playerState.level,
        location: state.gameState.currentZone,
        dayCount: state.gameState.dayCount,
        timeCount: state.gameState.timeCount,
      }
    }
    catch (error) {
      console.error(`=== Error Creating Game Data for ${state.path} ===`)
      console.error("Player State:",state.playerState);
      console.error("Game State:",state.gameState);
      console.error(error)
    }
  }

  // Just need to check to see that the worlds directory has been created. A
  // try/catch is a shitty way to handle a boolean, but it's how NodeJS handles
  // checking to see if a file exists.
  function areThereWorlds() {
    try {
      fs.accessSync(`${DATA}/worlds`);
    }
    catch(error) {
      return false;
    }
    return true;
  }

  // While this function looks like a simple getter function it also cleans up
  // invalid world directories if they're encountered. These invalid worlds are
  // created when a player starts the new game process, but doesn't finish it,
  // leaving a half finished world directory with no main character.
  function isWorldValid(path) {
    try {
      fs.accessSync(`${path}/Character-Main.cum`);
    }
    catch(e) {
      console.log(`Cleaning Invalid World: ${path}`)
      fs.rmSync(path,{ recursive:true });
      return false;
    }
    return true;
  }

  // ===========================================================================

  async function endEvent(endState) {
    let code = currentEvent.getCode();
    let template = EventDictionary.lookup(code);
    if (template.onFinish) {
      template.onFinish(endState);
    }

    // Not sure how this will actually be used yet, but I know some events
    // should be repeatable, but not by default. { repeat:true } is the
    // simplist implementation and in this case we just don't set the flag that
    // indicates the event has been done. We can also give it a requirement of
    // some sort, something like { repeat:'flag.conditional-flag'} or anything
    // else that the scrutinizer could parse, baring in mind it has access to
    // the end event state as well.
    let canRepeat = (template.repeat == true);

    if (typeof template.repeat == 'string') {
      let scrutinizer = new Scrutinizer();
      scrutinizer.setState(endState);
      canRepeat = await scrutinizer.meetsRequirements(template.repeat);
    }

    // If an event can repeat we should keep track of the number of times it's
    // been seen. This would let us do something like play an event 10 times
    // then change it somehow.
    if (canRepeat) {
      let flag = `[EventCount].${code}`;
      let count = Flag.get(flag) || 0;
      Flag.set(flag, count + 1);
    } else {
      Flag.set(`[EventComplete].${code}`,true);
    }

    currentEvent = null;

    GameRenderer.render();
  }

  // TODO: Right now we're only keeping track of the time. Eventually the
  //       passage of time will trigger different events and conditions and
  //       whatnot.
  function advanceTime(ticks) {
    timeCount += ticks;
    if (timeCount >= RhyshCalendar.DayLength) {
      dayCount += 1;
      timeCount = 0;
    }
  }

  function triggerBattle(options = {}) {
    console.log("\n=== Trigger Battle ===");
    console.log("Options:",options);

    currentBattle = new BattleState(options);
    setStageName("Battle");

    GameRenderer.render();
  }

  return {
    newGame,
    startGame,
    abortGame,
    deleteGame,
    saveGame,
    loadGame,
    clear,

    setCurrentEvent,
    setCurrentZone,
    setStageName,
    setPartyLocation,

    getCurrentBattle,
    getCurrentEvent,
    getCurrentZone,
    getCurrentZoneName,
    getTimeCount,
    getDayCount,
    getStage,
    getStageName,
    getWorldPath,
    getPartyLocation,

    getLastValidGame,
    getValidWorlds,

    endEvent,

    advanceTime,

    triggerBattle,
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
