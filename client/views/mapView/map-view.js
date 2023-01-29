// The map view is really just used to fetch and load the data into the map canvas. I suppose all of this could have
// gone into the canvas itself, but I think I'd like to keep the canvas focused on the map rendering while the view
// takes care of everything else.
window.MapView = (function() {

  function initPreviewControls() {
    let when = (e) => { return true; }
    X.onKeyDown('w', when, e => { MapCanvas.move('N'); });
    X.onKeyDown('s', when, e => { MapCanvas.move('S'); });
    X.onKeyDown('d', when, e => { MapCanvas.move('E'); });
    X.onKeyDown('a', when, e => { MapCanvas.move('W'); });
    X.onArrowUp(when,      e => { MapCanvas.move("N"); });
    X.onArrowDown(when,    e => { MapCanvas.move("S"); });
    X.onArrowRight(when,   e => { MapCanvas.move("E"); });
    X.onArrowLeft(when,    e => { MapCanvas.move("W"); });
    X.onWheelUp(when,      e => { MapCanvas.zoomIn();  });
    X.onWheelDown(when,    e => { MapCanvas.zoomOut(); });
  }

  function showDungeon(options) {
    showMap({
      location: Vector.from(options.location),
      tileSource: new TileSource(options.tileSource),
    });
  }

  function showFeaturePreview(options) {
    initPreviewControls();
    showMap({
      location: new Vector(0,0,0),
      tileSource: new TileSource(options.feature.tileSource),
    });
  }

  function showZonePreview(options) {
    initPreviewControls();
    showMap({
      location: Vector.from(options.location),
      tileSource: new TileSource(options.zone.tileSource),
    });
  }

  function showMap(options) {
    MapCanvas.show();
    MapCanvas.setLocation(options.location);
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
