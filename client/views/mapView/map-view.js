// The map view is really just used to fetch and load the data into the map canvas. I suppose all of this could have
// gone into the canvas itself, but I think I'd like to keep the canvas focused on the map rendering while the view
// takes care of everything else.
window.MapView = (function() {

  function initPreviewControls() {

  }

  function showDungeon(options) {
    showMap({
      location: Vector.from(options.position.location),
      direction: options.position.direction,
      tileSource: new TileSource(options.tileSource),
    });
  }

  function showFeaturePreview(options) {
    initPreviewControls();
    showMap({
      location: new Vector(0,0,0),
      direction: "N",
      tileSource: new TileSource(options.feature.tileSource),
    });
  }

  function showZonePreview(options) {
    initPreviewControls();
    showMap({
      location: Vector.from(options.position.location),
      direction: options.position.direction,
      tileSource: new TileSource(options.zone.tileSource),
    });
  }

  function showMap(options) {
    MapCanvas.show();
    MapCanvas.setOriginPoint(options.location);
    MapCanvas.setDirection(options.direction);
    MapCanvas.setTileSource(options.tileSource);
    MainContent.hideCover({ fadeTime:1000 });
  }

  return {
    name: "MapView",
    showDungeon: showDungeon,
    showFeaturePreview: showFeaturePreview,
    showZonePreview: showZonePreview,
  }

})();
