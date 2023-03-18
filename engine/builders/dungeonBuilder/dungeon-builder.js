global.DungeonBuilder = (function() {

  function buildAllZones() {
    Zone.allCodes().forEach(code => {
      new ZoneBuilder(code).buildZone();
    });
  }

  return {
    buildAllZones,
  };

})();
