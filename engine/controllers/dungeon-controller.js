global.DungeonController = (function() {

  function init() {
    ipcMain.handle("dungeon-builder.show-debug-feature", async (payload) => {
      Feature.previewFeature();
    });

    ipcMain.handle("dungeon-builder.show-debug-zone", async (payload) => {
      Zone.previewZone();
    });
  }

  return { init };

})();
