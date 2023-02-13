global.RootController = (function() {

  function init() {
    ipcMain.handle("client.ready", async () => {
      Browser.send('server.ready', {
        environment: Environment,
        lastValidGame: await GameState.getLastValidGame(),
      });

      Messenger.publish('server.ready');
    });

    ipcMain.handle("client.loadTemplate", async (payload, path) => {
      return Template.load(path);
    });
  }

  return { init };

})();
