global.GameController = (function() {

  function init() {

    ipcMain.handle("game.quit", () => {
      GameState.clear();
    });

    ipcMain.handle("game.new", () => {
      GameBuilder.newGame();
    });

    ipcMain.handle("game.abort", () => {
      GameData.abortGame();
    });

    ipcMain.handle("game.render", () => {
      GameRenderer.render();
    });

    // TODO: Orc and Dragon name should probably come from different indices.
    ipcMain.handle("game.get-random-names", () => {
      return {
        male: NameBuilder.getFullRandom('Male','Elf'),
        futa: NameBuilder.getFullRandom('Futa','Elf'),
        female: NameBuilder.getFullRandom('Female','Elf'),
      };
    });

    ipcMain.handle("game.start", (payload, parameters) => {
      GameBuilder.startGame(parameters);
    });

    ipcMain.handle("game.continue", (payload, parameters) => {
      GameData.loadGame(parameters[0]);
    });

    ipcMain.handle("game.show-load", async () => {
      return await GameData.getValidWorlds();
    });

    ipcMain.handle("game.save", async (payload, worldIndex) => {
      return await GameData.saveGame();
    });

    ipcMain.handle("game.load", (payload, worldIndex) => {
      GameData.loadGame(worldIndex);
    });

    ipcMain.handle("game.delete", (payload, worldIndex) => {
      GameData.deleteGame(worldIndex);
    });

    ipcMain.handle("game.end-event", (payload, state) => {
      GameState.endEvent(state);
    });
  }

  return { init };

})();
