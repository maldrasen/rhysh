global.RootController = (function() {

  function init() {
    ipcMain.handle("client.ready", async () => {
      Browser.send('server.ready', {
        environment: Environment,
        settings: Settings.getAll(),
        lastValidGame: await GameData.getLastValidGame(),
      });

      Switchboard.serverReady();
    });

    ipcMain.handle("client.loadTemplate", async (payload, path) => {
      return Template.load(path);
    });

    ipcMain.handle("options.save", async (payload, options) => {
      Settings.setAll(options);
      Settings.save();
      return "success";
    });
  }

  return { init };

})();
