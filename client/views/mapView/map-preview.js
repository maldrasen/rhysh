window.MapPreview = (function() {

  let $currentMode;

  function initPreviewControls(mode) {
    if ($currentMode != null) { return false; }

    $currentMode = mode;
    X.onCodeDown(32, when, e => {
      $currentMode == 'zone' ? previewZone() : previewFeature();
    });

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

  function when() {
    return true;
  }

  function previewFeature() {
    MainContent.reset();
    ClientCommands.send('dungeon-builder.show-debug-feature');
  }

  function previewZone() {
    MainContent.reset();
    ClientCommands.send('dungeon-builder.show-debug-zone');
  }

  function showFeaturePreview(options) {
    initPreviewControls('feature');
    MapView.showMap({
      location: new Vector(0,0,0),
      tileSource: new TileSource(options.feature.tileSource),
    });
  }

  function showZonePreview(options) {
    initPreviewControls('zone');
    MapView.showMap({
      location: Vector.from(options.location),
      tileSource: new TileSource(options.zone.tileSource),
    });
  }

  return {
    previewFeature,
    previewZone,
    showFeaturePreview,
    showZonePreview,
  }

})()