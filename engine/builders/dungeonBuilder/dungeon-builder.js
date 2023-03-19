global.DungeonBuilder = (function() {

  function buildAllZones() {
    Zone.allCodes().forEach(code => {
      let zone = Zone.lookup(code);
      let builder = new ZoneBuilder(code);

      try {
        builder.buildZone();
      } catch(error) {
        console.error("=== Error Building Zone ===");
        console.error(error);
        console.trace();
      }

      writeZoneFile(zone, builder.getTileSource());
    });
  }

  // We only save the zone files if there is a current game.
  function writeZoneFile(zone, tileSource) {
    if (tileSource && GameState.getWorldPath()) {
      Kompressor.write(zone.zoneFilePath(), {
        tileSource: tileSource.pack(),
      });
    }
  }

  return {
    buildAllZones,
  };

})();
