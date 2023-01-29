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

  function setTileSource(source) {
    if (tileField) {
      application.removeChild(tileField);
      tileField.destroy({ children:true });
    }

    drawPartyGlyph();

    tileField = new PIXI.Container();
    tileGraphics = new Map();
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
        TileGraphics[tileEntry.index] = graphics;
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

  // Instantly position the field so that the location point is in the center.
  function setLocation(point) {
    location = point;
  }

  function move(direction, instant = false) {
    if (instant) {
      location = location.go(direction);
      return positionField();
    }

    let fromPoint = location;
    let toPoint = location.go(direction);
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

  function positionField() {
    tileField.x = application.screen.width / 2;
    tileField.y = application.screen.height / 2;

    partyGlyph.x = tileField.x;
    partyGlyph.y = tileField.y;

    tileField.pivot.x = location.x * TileSize;
    tileField.pivot.y = location.y * TileSize;

    tileField.scale.set(ScaleFactors[scale]);
    partyGlyph.scale.set(ScaleFactors[scale]);
  }

  return {
    init,
    show,
    hide,
    setTileSource,
    setLocation,
    move,
    zoomIn,
    zoomOut,
  };

})();
