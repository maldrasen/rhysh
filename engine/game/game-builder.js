global.GameBuilder = (function() {

  const StartLocation = new Vector(61,59,102);
  const StartStage = "NewGame";
  const StartZone = "Wolgur";

  const StartDay = 69;
  const StartTime = 14 * RhyshCalendar.TicksPerHour;

  function newGame() {
    if (GameState.getWorldPath() != null) { throw `Error: Game is not empty.` }

    GameState.setWorldIndex(Settings.getWorldCounter());
    GameState.init({
      stageName: StartStage,
      currentZone: StartZone,
      partyLocation: StartLocation,
      dayCount: StartDay,
      timeCount: StartTime,
    });

    console.log(`\n\nCreating new game in ${GameState.getWorldPath()}`)

    fs.mkdir(GameState.getWorldPath(), { recursive:true }, error => {
      if (error) { throw error; }

      Settings.incWorldCounter();
      Settings.save();
      GameData.saveGame();
      GameRenderer.render();
      DungeonBuilder.buildAllZones();
    });
  }

  // The startGame() function takes place sometime after newGame() is called.
  // It puts the game into the initial state then takes the character creation
  // parameters and builds the main character.
  function startGame(parameters) {
    console.log("=== Game Start ===");
    console.log(parameters);

    CharacterBuilder.buildMainCharacter(parameters);

    Settings.setLastWorld(GameState.getWorldIndex());
    Settings.save();

    GameState.setCurrentEvent(new EventState("game.start"));
    GameState.setStageName("Dungeon");
    GameData.saveGame();
    GameRenderer.render();
  }

  return {
    newGame,
    startGame,
  };

})();