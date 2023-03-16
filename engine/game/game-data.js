global.GameData = (function() {

  // This should only be called from the newGame view when we start a new game,
  // but give up before the first event has completed.
  function abortGame() {
    GameData.deleteGame(GameState.getWorldIndex());
    GameState.clear()
  }

  function deleteGame(index) {
    let path = `${DATA}/worlds/${index}`;
    fs.rm(path, { recursive: true, force: true }, error => {
      console.log(`Deleted Game: ${path}`);
    });
  }

  function saveGame() {

    let state = {
      version: VERSION,
      timeCount: GameState.getTimeCount(),
      dayCount: GameState.getDayCount(),
      stageName: GameState.getStageName(),
      currentZone: GameState.getCurrentZoneName(),
      partyLocation: GameState.getPartyLocation(),
    }

    if (GameState.getCurrentEvent()) {
      state.currentEvent = GameState.getCurrentEvent().pack();
    }

    Kompressor.write(`${GameState.getWorldPath()}/GameState.cum`,state);
    CharacterLibrary.saveAll();
    Inventory.save();
    Flag.save();
    Sector.save();

    return "success";
  }

  // === Load Game =============================================================

  async function loadGame(index) {
    GameState.clear()
    GameState.setWorldIndex(index);

    console.log(`=== Loading Game ${index} ===`)

    let state = await Kompressor.read(`${GameState.getWorldPath()}/GameState.cum`);

    GameState.init({
      stageName: state.stageName,
      currentZone: state.currentZone,
      partyLocation: Vector.from(state.partyLocation),
      dayCount: state.dayCount,
      timeCount: state.timeCount,
    });

    if (state.currentEvent) {
      GameState.setCurrentEvent(Event.unpack(state.currentEvent));
    }

    ZoneLibrary.loadZone(GameState.getCurrentZoneName());

    await CharacterLibrary.loadMainCharacter();
    await Inventory.load();
    await Flag.load();
    await Sector.load();

    GameRenderer.render();
  }

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
        archetype: Archetype.lookup(state.playerState.archetypeCode).name,
        species: Species.lookup(state.playerState.speciesCode).name,
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

  return {
    abortGame,
    deleteGame,
    saveGame,
    loadGame,
    getLastValidGame,
    getValidWorlds,
  };

})();