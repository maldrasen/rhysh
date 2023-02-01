global.DungeonController = (function() {

  function init() {

    // Options format: { zone:"ZoneName" }
    ipcMain.handle("dungeon.is-zone-ready", async (payload, options) => {
      return Dungeon.isZoneReady(options.zone);
    });

    // Options format: { direction:"N" }
    ipcMain.handle("dungeon.request-move", async (payload, options) => {
      try {
        return new MoveAction(options.direction).getResponse();
      } catch(error) {
        console.error("=== Error thrown while moving ===");
        console.error(error);
        return { action:'none' }
      }
    });

    ipcMain.handle("dungeon-builder.show-debug-feature", async (payload) => {
      Feature.previewFeature();
    });

    ipcMain.handle("dungeon-builder.show-debug-zone", async (payload) => {
      Zone.previewZone();
    });
  }

  return { init };

})();
