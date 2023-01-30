window.MapCanvas = (function() {

  let ScaleFactors = [1, 0.66, 0.43, 0.28, 0.19];

  let application;
  let tileField;
  let tileGraphics;
  let tileSource;
  let partyGlyph;

  let location;
  let scale = 2;

  function init() {
    window.addEventListener("resize", handleResize);
    createApplication();
  }

  function createApplication() {
    application = new PIXI.Application({
      antialias: true,
      autoStart: false,
      resizeTo: window,
    });

    X.first("#mapCanvas").appendChild(application.view)
  }

  function show() {
    application.resize();
    application.start();
    X.first("#mapCanvas").removeAttribute('class');
  }

  function hide() {
    application.stop();
    X.first("#mapCanvas").setAttribute('class','hide');
  }

  function visible() {
    return X.hasClass('#mapCanvas','hide') == false;
  }

  function setTileSource(source) {
    if (tileField) {
      application.removeChild(tileField);
      tileField.destroy({ children:true });
    }

    drawPartyGlyph();

    tileField = new PIXI.Container();
    tileGraphics = [];
    tileSource = source
    application.stage.addChild(tileField);
    application.stage.addChild(partyGlyph);

    addTiles();
    positionField();
  }

  function drawPartyGlyph() {
    partyGlyph = new PIXI.Graphics();
    partyGlyph.lineStyle(0);
    partyGlyph.beginFill(0xFFFFFF);
    partyGlyph.drawCircle(0,0,18);
    partyGlyph.endFill();
  }

  function addTiles() {
    tileSource.each(tileEntry => {
      if (tileEntry.tile) {
        let graphics = new TileGraphics(tileEntry).build();
        tileGraphics.push({ index:tileEntry.index, graphics:graphics });
        tileField.addChild(graphics);
      }
    });
  }

  function handleResize() {
    if (tileField) {
      application.resize();
      positionField();
    }
  }

  // === Set Scale and Position ================================================

  function setLocation(point) { location = point; }

  function moveTo(newLocation, instant = false) {
    if (instant) {
      location = newLocation;
      return positionField();
    }

    let fromPoint = location;
    let toPoint = newLocation;

    console.log("TODO: Tween This Move...");
    location = toPoint;
    positionField();
  }

  function move(direction, instant = false) {
    moveTo(location.go(direction), instant);
  }

  function changeLevel(direction) {
    if (location.go(direction).z < tileSource.layerOffset) { return false; }
    if (location.go(direction).z >= tileSource.layerOffset + tileSource.layers.length) { return false; }

    location = location.go(direction);
    updateTileVisibility();
  }

  function zoomIn() {
    if (scale > 0) {
      scale -= 1;
      positionField();
    }
  }

  function zoomOut() {
    if (scale < ScaleFactors.length-1) {
      scale += 1;
      positionField();
    }
  }

  // === Positioning ===========================================================
  // The map scale, position, and tile visibility needs to be updated every
  // time the location is updated.

  function positionField() {
    tileField.x = application.screen.width / 2;
    tileField.y = application.screen.height / 2;

    partyGlyph.x = tileField.x;
    partyGlyph.y = tileField.y;

    tileField.pivot.x = location.x * TileSize;
    tileField.pivot.y = location.y * TileSize;

    tileField.scale.set(ScaleFactors[scale]);
    partyGlyph.scale.set(ScaleFactors[scale]);

    updateTileVisibility();
  }

  // Only tiles on the current Z-Level and within the bounds of the window
  // should be rendered.
  function updateTileVisibility() {
    let scaleFactor = ScaleFactors[scale];
    let xTileCount = Math.ceil(application.screen.width / (TileSize * scaleFactor) / 2);
    let yTileCount = Math.ceil(application.screen.height / (TileSize * scaleFactor) / 2);

    let xMin = location.x - xTileCount;
    let xMax = location.x + xTileCount;
    let yMin = location.y - yTileCount;
    let yMax = location.y + yTileCount;

    tileGraphics.forEach(tile => {
      let tileZ = tile.index.z + tileSource.layerOffset

      tile.graphics.renderable = true

      if (tile.index.x < xMin) { tile.graphics.renderable = false; }
      if (tile.index.x > xMax) { tile.graphics.renderable = false; }
      if (tile.index.y < yMin) { tile.graphics.renderable = false; }
      if (tile.index.y > yMax) { tile.graphics.renderable = false; }
      if (tileZ != location.z) { tile.graphics.renderable = false; }
    });
  }

  return {
    init,
    show,
    hide,
    visible,
    setTileSource,

    setLocation,
    move,
    moveTo,
    changeLevel,
    zoomIn,
    zoomOut,
  };

})();
