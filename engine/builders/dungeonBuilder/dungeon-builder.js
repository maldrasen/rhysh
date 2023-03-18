global.DungeonBuilder = (function() {

  function buildAllZones() {
    Zone.allCodes().forEach(code => {
      let zone = Zone.lookup(code);
      let builder = new ZoneBuilder(code);
          builder.buildZone();

      writeZoneFile(zone, builder.getTileSource());
    });
  }

  // We only save the zone files if there is a current game.
  function writeZoneFile(zone, tileSource) {
    if (GameState.getWorldPath()) {
      Kompressor.write(zone.zoneFilePath(), {
        tileSource: tileSource,
      });
    }
  }

  return {
    buildAllZones,
  };

})();
