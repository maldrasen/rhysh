global.DungeonController = (function() {

  function init() {
    ipcMain.handle("dungeon-builder.get-debug-feature", async (payload) => {
      return Feature.forPreview();
    });

    ipcMain.handle("dungeon-builder.get-debug-zone", async (payload) => {
      return Zone.forPreview();
    });

    ipcMain.handle("dungeon-builder.get-dungeon", async (payload) => {
      console.log("TODO: Show Dungeon")
    });
  }

  return { init };

})();
