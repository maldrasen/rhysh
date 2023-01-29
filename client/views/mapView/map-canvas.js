window.MapCanvas = (function() {

  let application;
  let tileField;
  let tileGraphics;
  let tileSource;
  let location;

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

    tileField = new PIXI.Container();
    tileGraphics = new Map();
    tileSource = source
    application.stage.addChild(tileField);

    addTiles();
    positionField();
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

  function setLocation(point) {
    location = point;
  }

  function move(direction) {
    console.log("Move:",direction)
  }

  function zoomIn() {}
  function zoomOut() {}

  // This is going to be tricky... I feel like I want to be able to move the
  // pivot around, not the location, but that doesn't seem to work with the
  // rotation...
  function positionField() {
    tileField.x = application.screen.width / 2;
    tileField.y = application.screen.height / 2;
    // tileField.pivot.x = -application.screen.width / 2;
    // tileField.pivot.y = -application.screen.height / 2;

    // application.ticker.add((delta) => {
    //     tileField.rotation -= 0.01 * delta;
    // });
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
