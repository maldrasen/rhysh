global.GameController = (function() {

  function init() {
    ipcMain.handle("game.new", (payload) => {
      GameState.newGame();
    });

    ipcMain.handle("game.abort", (payload) => {
      GameState.abortGame();
    });

    ipcMain.handle("game.render", (payload) => {
      GameState.render();
    });

    // TODO: Create the player character using the values we get from the new game form.

    ipcMain.handle("game.start", (payload) => {
      GameState.setStageName("Dungeon");
      GameState.render();
      GameState.saveGame();
    });

    ipcMain.handle("game.continue", (payload, parameters) => {
      GameState.loadGame(parameters[0]);
    });

    ipcMain.handle("game.show-load", (payload) => {
      console.log("TODO: Show Load")
    });

    ipcMain.handle("game.show-options", (payload) => {
      console.log("TODO: Show Options")
    });
  }

  return { init };

})();
