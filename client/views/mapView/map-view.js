// The map view is really just used to fetch and load the data into the map
// canvas. I suppose all of this could have gone into the canvas itself, but I
// think I'd like to keep the canvas focused on the map rendering while the
// view takes care of everything else.
window.MapView = (function() {

  function initPreviewControls() {
    let when = (e) => { return true; }

    X.onKeyDown('w', when, e => { MapCanvas.moveTo('N'); });
    X.onKeyDown('s', when, e => { MapCanvas.moveTo('S'); });
    X.onKeyDown('d', when, e => { MapCanvas.moveTo('E'); });
    X.onKeyDown('a', when, e => { MapCanvas.moveTo('W'); });
    X.onArrowUp(when,      e => { MapCanvas.moveTo('N'); });
    X.onArrowDown(when,    e => { MapCanvas.moveTo('S'); });
    X.onArrowRight(when,   e => { MapCanvas.moveTo('E'); });
    X.onArrowLeft(when,    e => { MapCanvas.moveTo('W'); });
    X.onPageUp(when,       e => { MapCanvas.changeLevel('U'); });
    X.onPageDown(when,     e => { MapCanvas.changeLevel('D'); });
    X.onWheelUp(when,      e => { MapCanvas.zoomIn(); });
    X.onWheelDown(when,    e => { MapCanvas.zoomOut(); });
  }

  function reset() {
    MapCanvas.reset();
  }

  function isOpen() {
    return X.hasClass('#mapCanvas','hide') == false;
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

  // === Pass Through ==========================================================
  // These functions are just passed to the canvas because I don't want other
  // non-map classes interacting with the canvas. Is there anything else the
  // view needs to do with these though?
  function move(response) { MapCanvas.move(response); }

  return {
    name: "MapView",
    reset: reset,
    isOpen: isOpen,
    showDungeon: showDungeon,
    showFeaturePreview: showFeaturePreview,
    showZonePreview: showZonePreview,
    move: move,
  }

})();
