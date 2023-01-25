global.RootController = (function() {

  function init() {
    ipcMain.handle("client.ready", async () => {
      Browser.send('server.ready', {
        environment: Environment,
        lastWorld: Settings.getLastWorld(),
      });

      Messenger.publish('server.ready');
      Messenger.publish('database.start');
    });

    ipcMain.handle("client.loadTemplate", async (payload, path) => {
      return Template.load(path);
    });
  }

  return { init };

})();
