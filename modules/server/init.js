
global.electron = require('electron');
global.ipcMain = electron.ipcMain;
global.app = electron.app;

ipcMain.handle("client.ready", async () => {
  Browser.send('server.ready', Environment);
  Messenger.publish('server.ready');
  Messenger.publish('database.start');
});

ipcMain.handle("client.loadTemplate", async (payload, path) => {
  return Template.load(path);
});
