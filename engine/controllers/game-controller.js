global.GameController = (function() {

  function init() {
    ipcMain.handle("game.new", () => {
      GameState.newGame();
    });

    ipcMain.handle("game.abort", () => {
      GameState.abortGame();
    });

    ipcMain.handle("game.render", () => {
      GameState.render();
    });

    // TODO: Orc and Dragon name should probably come from different indices.
    ipcMain.handle("game.get-random-names", () => {
      return {
        male: Name.getFullRandom('Male','Elf'),
        futa: Name.getFullRandom('Futa','Elf'),
        female: Name.getFullRandom('Female','Elf'),
      };
    });

    ipcMain.handle("game.start", (payload, parameters) => {
      GameState.startGame(parameters);
    });

    ipcMain.handle("game.continue", (payload, parameters) => {
      GameState.loadGame(parameters[0]);
    });

    ipcMain.handle("game.show-load", () => {
      console.log("TODO: Show Load")
    });

    ipcMain.handle("game.show-options", () => {
      console.log("TODO: Show Options")
    });

    ipcMain.handle("game.end-event", (payload, state) => {
      GameState.endEvent(state);
    });

  }

  return { init };

})();
