global.GameController = (function() {

  function init() {
    ipcMain.handle("game.new", async (payload) => {
      GameState.newGame();
    });

    ipcMain.handle("game.render", async (payload) => {
      GameState.render();
    });

    // TODO: Create the player character using the values we get from the new game form.

    ipcMain.handle("game.start", async (payload) => {
      GameState.setStageName("Dungeon");
      GameState.render();
      GameState.saveGame();
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
