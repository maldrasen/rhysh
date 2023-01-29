global.DungeonController = (function() {

  function init() {

    // Options format: { zone:"ZoneName" }
    ipcMain.handle("dungeon.is-zone-ready", async (payload, options) => {
      return Dungeon.isZoneReady(options.zone);
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
