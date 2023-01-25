global.GameController = (function() {

  function init() {
    ipcMain.handle("game.new", async (payload) => {
      GameState.newGame();
    });

    // TODO: Create the player character, set stage.
    ipcMain.handle("game.start", async (payload) => {
      console.log("TODO: Start");
    });

    ipcMain.handle("game.continue", async (payload, parameters) => {
      GameState.loadGame(parameters[0]);
    });

    ipcMain.handle("game.show-load", async (payload) => {
      console.log("TODO: Show Load")
    });

    ipcMain.handle("game.show-options", async (payload) => {
      console.log("TODO: Show Options")
    });
  }

  return { init };

})();
