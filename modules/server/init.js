
global.electron = require('electron');
global.ipcMain = electron.ipcMain;
global.app = electron.app;

// All the messages that are passed back and forth to the client have to go in
// the server module. The specs don't bother with the server code because
// testing message passing is kinda pointless.

ipcMain.handle("client.ready", async () => {
  Browser.send('server.ready', Environment);
  Messenger.publish('server.ready');
  Messenger.publish('database.start');
});

ipcMain.handle("client.loadTemplate", async (payload, path) => {
  return Template.load(path);
});

// === Game ===

ipcMain.handle("game.new", async (payload) => {
  console.log("TODO: New Game")
});

ipcMain.handle("game.continue", async (payload) => {
  console.log("TODO: Continue")
});

ipcMain.handle("game.show-load", async (payload) => {
  console.log("TODO: Show Load")
});

ipcMain.handle("game.show-options", async (payload) => {
  console.log("TODO: Show Options")
});

// === Dungeon ===

ipcMain.handle("dungeon-builder.get-feature-tiles", async (payload) => {
  return Feature.forPreview();
});

ipcMain.handle("dungeon-builder.get-zone-tiles", async (payload) => {
  return Zone.forPreview();
});

ipcMain.handle("dungeon-builder.get-dungeon-tiles", async (payload) => {
  console.log("TODO: Show Dungeon")
});
